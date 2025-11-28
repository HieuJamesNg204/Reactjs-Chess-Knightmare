import React from 'react';
import Sidebar from '../components/Sidebar.jsx';
import NewGameForm from '../components/NewGameForm.jsx';

const MOCK_HISTORY = [
    { id: 1, opponent: 'Grandmaster Engine', result: 'Victory', date: '2 days ago', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-900/20' },
    { id: 2, opponent: 'Tactical Bot V6', result: 'Defeat', date: '4 days ago', color: 'text-red-400 border-red-500/30 bg-red-900/20' },
    { id: 3, opponent: 'Stockfish Elite', result: 'Stalemate', date: '1 week ago', color: 'text-amber-400 border-amber-500/30 bg-amber-900/20' },
    { id: 4, opponent: 'Training Bot', result: 'Victory', date: '1 week ago', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-900/20' },
];

const MOCK_STATS = { totalGames: 42, winRate: '65%', bestStreak: 7 };

const DashboardPage = () => {
    return (
        <div className="w-full max-w-7xl mx-auto px-6 py-10"> 
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                <div className="lg:col-span-3">
                    <Sidebar />
                </div>

                <div className="lg:col-span-6 flex justify-center">
                    <NewGameForm />
                </div>

                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-neutral-900/80 backdrop-blur-md border border-amber-500/20 p-6 rounded-xl shadow-2xl">
                        
                        <div className="pb-6 border-b border-neutral-800">
                            <h3 className="text-lg font-serif tracking-wider text-amber-500 mb-4 uppercase">Battle Statistics</h3>
                            <div className="grid grid-cols-1 gap-3">
                                <StatItem label="Campaigns Waged" value={MOCK_STATS.totalGames} icon="⚔️" />
                                <StatItem label="Victory Rate" value={MOCK_STATS.winRate} icon="👑" />
                                <StatItem label="Highest Streak" value={MOCK_STATS.bestStreak} icon="🔥" />
                            </div>
                        </div>

                        <div className="pt-6">
                            <div className="flex justify-between items-end mb-4">
                                <h3 className="text-lg font-serif tracking-wider text-amber-500 uppercase">Recent Skirmishes</h3>
                            </div>
                            <ul className="space-y-3">
                                {MOCK_HISTORY.map((game) => (
                                    <li key={game.id} className="flex justify-between items-center p-3 rounded-lg bg-neutral-800/40 border border-neutral-700/50 hover:border-amber-500/30 transition duration-300">
                                        <div className="flex flex-col">
                                            <span className="text-neutral-200 font-medium text-sm">{game.opponent}</span>
                                            <span className="text-neutral-500 text-xs">{game.date}</span>
                                        </div>
                                        <span className={`px-3 py-1 rounded text-xs font-bold border uppercase tracking-wider ${game.color}`}>
                                            {game.result}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            <button className="w-full mt-6 py-2 text-xs font-bold tracking-widest uppercase text-neutral-400 hover:text-amber-500 border border-dashed border-neutral-700 hover:border-amber-500/50 rounded transition duration-200">
                                Open Archives
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatItem = ({ label, value, icon }) => (
    <div className="flex justify-between items-center p-3 bg-neutral-800/50 rounded border border-neutral-700/50">
        <span className="text-neutral-400 text-sm font-medium flex items-center gap-2">
            <span className="opacity-70">{icon}</span>
            {label}
        </span>
        <span className="text-lg font-bold text-white font-serif">{value}</span>
    </div>
);

export default DashboardPage;