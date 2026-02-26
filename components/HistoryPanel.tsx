import React, { useState } from 'react';
import { HistoryItem } from '../types';

interface HistoryPanelProps {
  history: HistoryItem[];
  isOpen: boolean;
  onClose: () => void;
  onRestore: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onClearCache: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, isOpen, onClose, onRestore, onDelete, onClearCache }) => {
  const [showClearCacheConfirm, setShowClearCacheConfirm] = useState(false);

  if (!isOpen) return null;

  const handleClearCacheClick = () => {
    onClearCache();
    setShowClearCacheConfirm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" 
        onClick={onClose}
      ></div>

      <div className="bg-slate-900 border border-white/10 rounded-t-2xl md:rounded-2xl w-full md:max-w-2xl max-h-[100dvh] md:max-h-[80vh] flex flex-col shadow-2xl relative z-10 animate-scale-up overflow-hidden">
        
        <div className="p-4 md:p-6 border-b border-white/5 flex justify-between items-center bg-slate-800/50">
           <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Session History
           </h3>
           
           <div className="flex items-center gap-2">
               {showClearCacheConfirm ? (
                 <div className="flex items-center gap-2 bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20 animate-slide-up">
                    <span className="text-red-400 text-xs font-bold">CLEAR CACHE?</span>
                    <button 
                      onClick={handleClearCacheClick}
                      className="text-white hover:text-red-400 text-xs font-black uppercase py-1 px-2 min-h-[32px]"
                    >
                      YES
                    </button>
                    <button 
                      onClick={() => setShowClearCacheConfirm(false)}
                      className="text-slate-500 hover:text-white text-xs uppercase py-1 px-2 min-h-[32px]"
                    >
                      NO
                    </button>
                 </div>
               ) : (
                 <button
                   onClick={() => setShowClearCacheConfirm(true)}
                   className="px-3 py-2.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white text-xs font-semibold transition-all border border-red-500/20 active:scale-95 min-h-[44px]"
                   title="Clear audio cache to free up space"
                 >
                   Clear Cache
                 </button>
               )}
               <button 
                 onClick={onClose} 
                 className="p-2.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
               >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
               </button>
           </div>
        </div>

        <div className="overflow-y-auto p-4 md:p-6 custom-scrollbar flex-1">
            {history.length === 0 ? (
                <div className="text-center py-12 text-slate-600">
                    <svg className="w-12 h-12 mx-auto mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm font-medium">No recent activity found.</p>
                </div>
            ) : (
                <div className="space-y-3 md:space-y-4">
                    {history.map((item, idx) => (
                    <div 
                        key={item.id} 
                        className="group relative bg-white/5 p-4 rounded-xl transition-all duration-300 hover:bg-white/10 hover:-translate-y-[1px] border border-transparent hover:border-violet-500/30 flex flex-col gap-2 animate-slide-up"
                        style={{ animationDelay: `${idx * 0.05}s` }}
                    >
                        <div className="flex justify-between items-start gap-3">
                          <p className="text-slate-200 font-light text-sm line-clamp-2 leading-relaxed italic flex-1">"{item.text}"</p>
                          <button 
                            onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                            className="text-slate-600 hover:text-red-400 p-2.5 transition-colors rounded-lg hover:bg-red-500/10 min-w-[44px] min-h-[44px] flex items-center justify-center flex-shrink-0"
                            title="Delete this history item"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform duration-200 group-hover:rotate-[-8deg]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between mt-1 gap-2">
                             <div className="flex flex-wrap gap-1.5 text-xs text-slate-500 font-mono uppercase tracking-wide">
                                <span className="bg-black/30 px-2 py-1 rounded">{new Date(item.timestamp).toLocaleDateString()}</span>
                                <span className="bg-violet-500/10 text-violet-300 px-2 py-1 rounded">{item.config.voice}</span>
                                <span className="bg-fuchsia-500/10 text-fuchsia-300 px-2 py-1 rounded">{item.config.language}</span>
                            </div>
                            
                            <button
                                onClick={() => { onRestore(item); onClose(); }}
                                className="px-4 py-2.5 rounded-lg bg-violet-500/20 text-violet-300 hover:bg-violet-500 hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-lg shadow-black/20 min-h-[44px] flex-shrink-0 active:scale-95"
                            >
                                Restore
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                            </button>
                        </div>
                    </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
