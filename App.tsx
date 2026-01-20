import React, { useState, useRef, useEffect } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { ProgressBar } from './components/ProgressBar';
import { Header } from './components/Header';
import { ContentDisplay } from './components/ContentDisplay';
import { ActionButtons } from './components/ActionButtons';
import { AudioPlayer } from './components/AudioPlayer';
import { ErrorDisplay } from './components/ErrorDisplay';
import { HistoryPanel } from './components/HistoryPanel';
import { BackgroundDecorations } from './components/BackgroundDecorations';
import { TTSService } from './services/ttsService';
import { TTSConfig, ProcessingState, VoiceName, ChunkTiming, SynthesisResult, HistoryItem } from './types';
import { generateCacheKey, getCachedAudio, clearCache } from './utils/cache';

const ttsService = new TTSService();

const App: React.FC = () => {
  const [text, setText] = useState<string>(() => localStorage.getItem('lumina_text') || '');
  const [config, setConfig] = useState<TTSConfig>(() => {
    const saved = localStorage.getItem('lumina_config');
    return saved ? JSON.parse(saved) : { voice: VoiceName.Puck, speed: 1.0, language: 'original' };
  });
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('lumina_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [translationPreview, setTranslationPreview] = useState<string>('');
  const [isTranslatingPreview, setIsTranslatingPreview] = useState<boolean>(false);
  const [processingState, setProcessingState] = useState<ProcessingState>({
    isProcessing: false, progress: 0, currentStep: 'Ready', totalChunks: 0, processedChunks: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [generatedChunks, setGeneratedChunks] = useState<string[]>([]);
  const [chunkTimings, setChunkTimings] = useState<ChunkTiming[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(true);
  const [, setCurrentTime] = useState(0); 
  const [activeChunkIndex, setActiveChunkIndex] = useState<number>(-1);
  const [estimatedWordIndex, setEstimatedWordIndex] = useState<number>(-1);

  const audioRef = useRef<HTMLAudioElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const latestTranslationPromise = useRef<Promise<string> | null>(null);
  const lastTranslatedText = useRef<{ source: string, lang: string, result: string } | null>(null);

  useEffect(() => { localStorage.setItem('lumina_text', text); }, [text]);
  useEffect(() => { localStorage.setItem('lumina_config', JSON.stringify(config)); }, [config]);
  useEffect(() => { localStorage.setItem('lumina_history', JSON.stringify(history)); }, [history]);

  // Debounced Real-time Translation
  useEffect(() => {
    if (config.language === 'original' || !text.trim()) {
      setTranslationPreview('');
      lastTranslatedText.current = null;
      return;
    }

    const timer = setTimeout(() => {
      setIsTranslatingPreview(true);
      const promise = ttsService.translateText(text, config.language)
        .then(result => {
          setTranslationPreview(result);
          lastTranslatedText.current = { source: text, lang: config.language, result };
          return result;
        })
        .catch(e => {
          console.error("Translation failed", e);
          return "";
        })
        .finally(() => {
          setIsTranslatingPreview(false);
        });
      
      latestTranslationPromise.current = promise;
    }, 800);

    return () => clearTimeout(timer);
  }, [text, config.language]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Generate: Ctrl+Enter or Cmd+Enter
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (isEditing && !!text.trim() && !processingState.isProcessing) {
          handleGenerate();
        }
      }

      // 2. Stop: Escape
      if (e.key === 'Escape') {
        if (processingState.isProcessing) {
          abortControllerRef.current?.abort();
        }
      }

      // 3. Play/Pause: Spacebar
      const activeElement = document.activeElement;
      const isInputFocused = activeElement instanceof HTMLTextAreaElement || 
                             activeElement instanceof HTMLInputElement;
      
      if (e.key === ' ' && !isInputFocused) {
        e.preventDefault(); // Prevent scrolling
        if (!isEditing && audioUrl && audioRef.current) {
          if (audioRef.current.paused) {
            audioRef.current.play();
          } else {
            audioRef.current.pause();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditing, text, processingState.isProcessing, audioUrl, config]);

  // Highlight Tracking
  useEffect(() => {
    let animationFrameId: number;
    const update = () => {
      if (audioRef.current && !audioRef.current.paused) {
        const time = audioRef.current.currentTime;
        setCurrentTime(time);
        const chunkIdx = chunkTimings.findIndex(t => time >= t.start && time < t.end);
        setActiveChunkIndex(chunkIdx);
        if (chunkIdx !== -1 && generatedChunks[chunkIdx]) {
          const words = generatedChunks[chunkIdx].split(/\s+/);
          const progress = Math.min(1, (time - chunkTimings[chunkIdx].start) / chunkTimings[chunkIdx].duration);
          setEstimatedWordIndex(Math.floor(progress * words.length));
        }
      }
      animationFrameId = requestAnimationFrame(update);
    };
    if (audioUrl && !isEditing) animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId);
  }, [audioUrl, isEditing, chunkTimings, generatedChunks]);

  const handleGenerate = async () => {
    if (!text.trim()) { setError("Please enter text."); return; }
    setError(null);
    setAudioUrl(null);
    abortControllerRef.current = new AbortController();

    try {
      let textToSynthesize = text;

      if (config.language !== 'original') {
        if (lastTranslatedText.current?.source === text && lastTranslatedText.current?.lang === config.language) {
          textToSynthesize = lastTranslatedText.current.result;
        } 
        else if (isTranslatingPreview && latestTranslationPromise.current) {
          setProcessingState({ isProcessing: true, progress: 5, currentStep: 'Finalizing background translation...', totalChunks: 0, processedChunks: 0 });
          textToSynthesize = await latestTranslationPromise.current;
        } 
        else {
          setProcessingState({ isProcessing: true, progress: 5, currentStep: 'Syncing linguistic context...', totalChunks: 0, processedChunks: 0 });
          textToSynthesize = await ttsService.translateText(text, config.language);
        }
      }

      if (!textToSynthesize) throw new Error("Could not obtain text for synthesis.");

      const result = await ttsService.synthesize(textToSynthesize, config, (s) => setProcessingState(s), abortControllerRef.current.signal);
      
      setAudioUrl(result.audioUrl);
      setGeneratedChunks(result.chunks);
      setChunkTimings(result.timings);
      setIsEditing(false);
      setHistory(prev => [{ id: Date.now().toString(), timestamp: Date.now(), text, config: { ...config } }, ...prev].slice(0, 15));
    } catch (err: any) {
      if (err.message !== 'Aborted') setError(err.message || "Synthesis failed.");
      setProcessingState(p => ({ ...p, isProcessing: false }));
    }
  };

  const handleRestoreHistory = async (item: HistoryItem) => {
    setText(item.text);
    setConfig(item.config);
    const key = await generateCacheKey(item.text, item.config);
    const cached = await getCachedAudio(key);
    if (cached) {
      setAudioUrl(URL.createObjectURL(cached.blob));
      setGeneratedChunks(cached.chunks);
      setChunkTimings(cached.timings);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
    setShowHistoryModal(false);
  };

  const handleDeleteHistory = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 flex flex-col items-center selection:bg-cyan-500/30">
      <BackgroundDecorations />
      <main className="w-full max-w-5xl relative z-10 flex flex-col items-center pb-20">
        <Header onOpenHistory={() => setShowHistoryModal(true)} />
        <div className="w-full">
            <ControlPanel config={config} onChange={setConfig} disabled={processingState.isProcessing || !isEditing} onPreviewRequest={(v) => ttsService.previewVoice(v).then(u => new Audio(u).play())} />
            {isEditing ? (
              <>
                <ContentDisplay text={text} onTextChange={setText} isProcessing={processingState.isProcessing} translationPreview={translationPreview} isTranslating={isTranslatingPreview} targetLanguage={config.language} onOpenHistory={() => setShowHistoryModal(true)} />
                <ActionButtons isEditing={true} isProcessing={processingState.isProcessing} hasText={!!text.trim()} onGenerate={handleGenerate} onEdit={() => {}} onStop={() => abortControllerRef.current?.abort()} />
              </>
            ) : audioUrl && (
              <div className="w-full flex flex-col items-center">
                 <AudioPlayer audioUrl={audioUrl} audioRef={audioRef} generatedChunks={generatedChunks} activeChunkIndex={activeChunkIndex} estimatedWordIndex={estimatedWordIndex} />
                 <button onClick={() => setIsEditing(true)} className="mt-8 px-8 py-3 rounded-full font-semibold bg-slate-900 border border-white/10 hover:border-cyan-500/30 text-slate-300 transition-all">Generate New</button>
              </div>
            )}
            <ProgressBar state={processingState} />
            {error && <ErrorDisplay message={error} />}
        </div>
        <HistoryPanel history={history} isOpen={showHistoryModal} onClose={() => setShowHistoryModal(false)} onRestore={handleRestoreHistory} onDelete={handleDeleteHistory} onClearCache={clearCache} />
      </main>
    </div>
  );
};

export default App;