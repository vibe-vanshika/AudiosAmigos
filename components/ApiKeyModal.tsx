import React, { useState, useEffect } from 'react';

interface ApiKeyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
    const [apiKey, setApiKey] = useState('');
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const savedKey = localStorage.getItem('gemini_api_key');
        if (savedKey) {
            setApiKey(savedKey);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSave = () => {
        localStorage.setItem('gemini_api_key', apiKey);
        setIsSaved(true);
        setTimeout(() => {
            setIsSaved(false);
            onClose();
        }, 1000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-4">
            <div
                className="absolute inset-0 bg-black/75 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            ></div>

            <div className="glass-card rounded-t-lg md:rounded-lg w-full md:max-w-md flex flex-col shadow-2xl relative z-10 animate-scale-up overflow-hidden">

                <div className="p-4 md:p-6 border-b border-[var(--studio-line)] flex justify-between items-center bg-[rgba(5,6,4,0.46)]">
                    <h3 className="text-lg md:text-xl font-bold text-[var(--studio-paper)] flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--signal-amber)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 6a3 3 0 1 0-6 0 3 3 0 0 0 6 0" />
                            <path d="M12 9v12m0 0h3m-3 0h-3m4-6h-4" />
                        </svg>
                        Gemini API Key
                    </h3>
                    <button
                        onClick={onClose}
                        className="icon-button focus-ring"
                        aria-label="Close API key settings"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-4 md:p-6 space-y-4">
                    <p className="text-[var(--studio-muted)] text-sm leading-relaxed">
                        Enter your Google Gemini API key to enable neural synthesis. Your key is stored locally in your browser.
                    </p>

                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--studio-muted)] group-focus-within:text-[var(--signal-amber)] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 6a3 3 0 1 0-6 0 3 3 0 0 0 6 0" />
                                <path d="M12 9v12m0 0h3m-3 0h-3m4-6h-4" />
                            </svg>
                        </div>
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Paste your API key here..."
                            className="w-full bg-[rgba(5,6,4,0.62)] border border-[var(--studio-line)] rounded-lg py-3.5 pl-10 pr-4 text-[var(--studio-paper)] placeholder:text-[var(--studio-dim)] focus:outline-none focus:border-[rgba(244,178,77,0.55)] focus:ring-2 focus:ring-[rgba(244,178,77,0.14)] transition-all duration-200 font-mono text-sm"
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            onClick={onClose}
                            className="studio-button focus-ring px-5 py-2.5 text-[var(--studio-muted)] hover:text-[var(--studio-paper)] text-sm font-semibold min-h-[44px]"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaved}
                            className={`focus-ring px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 border min-h-[44px] ${isSaved
                                ? 'bg-[rgba(88,214,141,0.16)] text-[var(--signal-green)] border-[rgba(88,214,141,0.32)]'
                                : 'bg-[var(--signal-amber)] text-[#25190b] hover:bg-[#f7c76b] border-[rgba(255,248,232,0.2)] shadow-xl active:scale-[0.98]'
                                }`}
                        >
                            {isSaved ? (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    Saved
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M15 6a3 3 0 1 0-6 0 3 3 0 0 0 6 0" />
                                        <path d="M12 9v10m0 0h2m-2 0h-2m3-4h-3" />
                                    </svg>
                                    Save Key
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <div className="px-4 md:px-6 py-4 bg-[rgba(5,6,4,0.5)] border-t border-[var(--studio-line)]">
                    <a
                        href="https://aistudio.google.com/app/apikey"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[rgba(244,178,77,0.7)] hover:text-[var(--signal-amber)] flex items-center gap-1.5 transition-colors py-1"
                    >
                        Get an API key from Google AI Studio
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    );
};
