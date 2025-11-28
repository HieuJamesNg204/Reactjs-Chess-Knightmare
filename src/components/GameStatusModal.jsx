import React from 'react';
import { FaTrophy, FaSkull, FaHandshake, FaSearch, FaArrowLeft } from 'react-icons/fa';

const GameStatusModal = ({ 
    isOpen, 
    statusMessage, 
    playerResult, 
    onBackToDashboard, 
    onAnalyze 
}) => {
    if (!isOpen) return null;

    const config = {
        win: {
            theme: 'amber',
            icon: <FaTrophy className="w-16 h-16 text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" />,
            title: 'VICTORY SECURED',
            sub: 'Enemy Forces Neutralized',
            border: 'border-amber-500',
            glow: 'shadow-[0_0_50px_rgba(245,158,11,0.2)]',
            text: 'text-amber-500',
            bg: 'bg-amber-500/10'
        },
        loss: {
            theme: 'red',
            icon: <FaSkull className="w-16 h-16 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />,
            title: 'MISSION FAILED',
            sub: 'King Captured',
            border: 'border-red-500',
            glow: 'shadow-[0_0_50px_rgba(239,68,68,0.2)]',
            text: 'text-red-500',
            bg: 'bg-red-500/10'
        },
        draw: {
            theme: 'neutral',
            icon: <FaHandshake className="w-16 h-16 text-neutral-400 drop-shadow-[0_0_15px_rgba(163,163,163,0.5)]" />,
            title: 'STALEMATE',
            sub: 'Armistice Agreed',
            border: 'border-neutral-400',
            glow: 'shadow-[0_0_50px_rgba(163,163,163,0.2)]',
            text: 'text-neutral-400',
            bg: 'bg-neutral-500/10'
        },
        playing: {
            theme: 'blue',
            icon: null,
            title: 'IN PROGRESS',
            sub: '...',
            border: 'border-blue-500',
            glow: '',
            text: 'text-blue-500',
            bg: 'bg-blue-500/10'
        }
    };

    const currentConfig = config[playerResult] || config.playing;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/90 backdrop-blur-md transition-opacity duration-300">
            <div className={`relative w-full max-w-md mx-4 p-1 rounded-2xl bg-gradient-to-b from-neutral-800 to-neutral-950 ${currentConfig.glow}`}>
                <div className={`relative bg-neutral-900/90 rounded-xl border ${currentConfig.border} p-8 flex flex-col items-center text-center overflow-hidden`}>
                    
                    <div className={`absolute inset-0 ${currentConfig.bg} opacity-20 pointer-events-none`}></div>
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50"></div>

                    <div className="mb-6 relative z-10 transform hover:scale-110 transition-transform duration-500">
                        {currentConfig.icon}
                    </div>

                    <h2 className={`text-3xl font-serif font-bold tracking-wide mb-1 ${currentConfig.text}`}>
                        {currentConfig.title}
                    </h2>
                    <p className="text-neutral-400 text-xs uppercase tracking-[0.3em] mb-8 font-bold">
                        {currentConfig.sub}
                    </p>

                    <div className="w-full bg-neutral-950/50 border border-neutral-800 rounded-lg p-4 mb-8">
                        <p className="text-neutral-300 font-mono text-sm leading-relaxed">
                            <span className="text-neutral-600 mr-2">{'>'}</span>
                            {statusMessage}
                        </p>
                    </div>

                    <div className="w-full space-y-3 relative z-10">
                        <button
                            onClick={onAnalyze}
                            className="w-full group relative px-6 py-3.5 bg-neutral-100 hover:bg-white text-neutral-900 font-bold uppercase tracking-wider rounded-lg transition-all duration-200 flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                        >
                            <FaSearch className="text-neutral-900" />
                            <span>Analyze Tactics</span>
                        </button>
                        
                        <button
                            onClick={onBackToDashboard}
                            className="w-full group px-6 py-3.5 bg-transparent hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-700 hover:border-neutral-500 font-bold uppercase tracking-wider rounded-lg transition-all duration-200 flex items-center justify-center gap-3"
                        >
                            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-200" />
                            <span>Return to Base</span>
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default GameStatusModal;