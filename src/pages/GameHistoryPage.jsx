import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';
import { AuthContext } from '../context/AuthContext.jsx';
import { FaChessKing, FaChessPawn, FaScroll, FaSearch, FaTrophy, FaSkullCrossbones, FaHandshake, FaTimesCircle } from 'react-icons/fa';

const GameHistoryPage = () => {
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { isAuthenticated } = useContext(AuthContext);

    const loadGameHistory = useCallback(async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        setIsLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) {
            setError('Security clearance required.');
            setIsLoading(false);
            return;
        }

        try {
            const res = await API.get('/games/history', {
                headers: { 'x-auth-token': token }
            });
            setHistory(res.data);
        } catch (err) {
            console.error('Failed to retrieve archives:', err);
            setError(err.response?.data?.message || 'Failed to retrieve battle archives.');
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        loadGameHistory();
    }, [loadGameHistory]);

    const getResultBadge = (result, status) => {
        if (status === 'terminated') {
            return (
                <span className="inline-flex items-center px-3 py-1 text-xs font-bold uppercase tracking-wider rounded border border-neutral-600 bg-neutral-800 text-neutral-400">
                    <FaTimesCircle className="mr-2" /> Aborted
                </span>
            );
        } else if (result === '1-0') {
            return (
                <span className="inline-flex items-center px-3 py-1 text-xs font-bold uppercase tracking-wider rounded border border-emerald-500/30 bg-emerald-900/20 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                    <FaTrophy className="mr-2" /> Victory
                </span>
            );
        } else if (result === '0-1') {
            return (
                <span className="inline-flex items-center px-3 py-1 text-xs font-bold uppercase tracking-wider rounded border border-red-500/30 bg-red-900/20 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.1)]">
                    <FaSkullCrossbones className="mr-2" /> Defeat
                </span>
            );
        } else if (result === '1/2-1/2') {
            return (
                <span className="inline-flex items-center px-3 py-1 text-xs font-bold uppercase tracking-wider rounded border border-amber-500/30 bg-amber-900/20 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.1)]">
                    <FaHandshake className="mr-2" /> Stalemate
                </span>
            );
        }
        return (
            <span className="inline-flex items-center px-3 py-1 text-xs font-bold uppercase tracking-wider rounded border border-neutral-500/30 bg-neutral-800 text-neutral-300 animate-pulse">
                <FaChessPawn className="mr-2" /> Active
            </span>
        );
    };

    if (isLoading) {
        return (
            <div className="min-h-[60vh] w-full flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div>
                <p className="mt-6 text-amber-500 font-serif tracking-[0.2em] text-sm animate-pulse uppercase">Decrypting Archives</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[60vh] w-full flex items-center justify-center p-4">
                <div className="bg-red-900/20 border border-red-500/30 p-8 rounded-xl text-center max-w-md">
                    <FaSkullCrossbones className="text-4xl text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl text-red-400 font-serif mb-2">Archive Error</h3>
                    <p className="text-red-300/70 text-sm">{error}</p>
                    <button 
                        onClick={loadGameHistory}
                        className="mt-6 px-6 py-2 bg-red-900/40 hover:bg-red-900/60 text-red-200 text-xs uppercase tracking-widest rounded border border-red-500/30 transition-all"
                    >
                        Retry Connection
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto py-12 px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 pb-6 border-b border-amber-500/20">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-white tracking-wide flex items-center gap-4">
                        <span className="text-amber-500 text-3xl"><FaScroll /></span>
                        Battle Archives
                    </h1>
                    <p className="text-neutral-400 mt-2 text-sm tracking-wide">
                        Review strategic outcomes and analyze past skirmishes.
                    </p>
                </div>
                <div className="mt-4 md:mt-0 px-4 py-2 bg-neutral-800/50 border border-neutral-700 rounded-lg flex items-center gap-3 text-neutral-400">
                    <span className="text-sm font-serif text-amber-500">Total Campaigns:</span>
                    <span className="font-mono font-bold text-white">{history.length}</span>
                </div>
            </div>

            {history.length === 0 ? (
                <div className="bg-neutral-900/80 backdrop-blur-md border border-amber-500/10 p-16 rounded-xl shadow-2xl text-center">
                    <div className="w-20 h-20 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <FaChessKing className="text-4xl text-neutral-600" />
                    </div>
                    <h3 className="text-2xl font-serif text-white mb-2">No Campaigns Recorded</h3>
                    <p className="text-neutral-400 mb-8 max-w-md mx-auto">
                        Your legacy has yet to begin. Deploy your forces to the battlefield to create your first entry.
                    </p>
                    <button 
                        onClick={() => navigate('/dashboard')} 
                        className="px-8 py-3 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white font-bold rounded shadow-lg shadow-amber-900/40 uppercase tracking-widest transition-all transform hover:-translate-y-0.5"
                    >
                        Initiate New Game
                    </button>
                </div>
            ) : (
                <div className="bg-neutral-900/80 backdrop-blur-md border border-amber-500/10 rounded-xl shadow-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-neutral-900 border-b border-amber-500/20">
                                <tr>
                                    <th className="px-6 py-5 text-left text-xs font-bold text-amber-500 uppercase tracking-[0.15em]">Timestamp</th>
                                    <th className="px-6 py-5 text-left text-xs font-bold text-amber-500 uppercase tracking-[0.15em]">Opponent</th>
                                    <th className="px-6 py-5 text-left text-xs font-bold text-amber-500 uppercase tracking-[0.15em]">Difficulty</th>
                                    <th className="px-6 py-5 text-left text-xs font-bold text-amber-500 uppercase tracking-[0.15em]">Allegiance</th>
                                    <th className="px-6 py-5 text-left text-xs font-bold text-amber-500 uppercase tracking-[0.15em]">Outcome</th>
                                    <th className="px-6 py-5 text-right text-xs font-bold text-amber-500 uppercase tracking-[0.15em]">Intel</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800/50">
                                {history.map((game) => (
                                    <tr key={game.gameId} className="hover:bg-neutral-800/40 transition duration-200 group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-mono text-neutral-400 group-hover:text-neutral-200 transition-colors">
                                                {new Date(game.updatedAt).toLocaleDateString()}
                                            </div>
                                            <div className="text-[10px] font-mono text-neutral-600">
                                                {new Date(game.updatedAt).toLocaleTimeString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm font-serif font-medium text-neutral-200 group-hover:text-amber-100">
                                                AI Engine
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <div className="h-1.5 w-12 bg-neutral-700 rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full bg-amber-600" 
                                                        style={{ width: `${(game.difficulty / 10) * 100}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs font-mono text-amber-500">Lvl {game.difficulty}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`text-xs font-bold uppercase tracking-wider ${game.humanColor === 'white' ? 'text-neutral-100' : 'text-neutral-500'}`}>
                                                {game.humanColor}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getResultBadge(game.result, game.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            {game.status !== 'terminated' ? (
                                                <button
                                                    onClick={() => navigate(`/analyze/${game.gameId}`)}
                                                    className="text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-amber-500 transition-colors flex items-center justify-end gap-2 ml-auto group/btn"
                                                >
                                                    <FaSearch className="w-3 h-3 group-hover/btn:scale-110 transition-transform" />
                                                    Analyze
                                                </button>
                                            ) : (
                                                <span className="text-xs text-neutral-700 uppercase tracking-wider cursor-not-allowed">N/A</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GameHistoryPage;