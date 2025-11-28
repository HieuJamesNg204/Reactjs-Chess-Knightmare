import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

const NewGameForm = () => {
    const [difficulty, setDifficulty] = useState(5);
    const [playerColor, setPlayerColor] = useState('white');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const colors = ['white', 'black'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const token = localStorage.getItem('token'); 
        if (!token) {
            setError('Authentication required to deploy forces.');
            setIsLoading(false);
            return;
        }

        try {
            let finalColorChoice = playerColor;
            if (playerColor === 'random') {
                const randomIndex = Math.floor(Math.random() * colors.length);
                finalColorChoice = colors[randomIndex];
                setPlayerColor(finalColorChoice);
            }

            const response = await axios.post(`${API_URL}/games/new`, 
                { difficulty, playerColor: finalColorChoice },
                { 
                    headers: { 'x-auth-token': `${token}` }
                }
            );

            const newGameId = response.data.gameId;
            navigate(`/game/${newGameId}`);

        } catch (err) {
            console.error('Failed to start game:', err);
            setError(err.response?.data?.message || 'Strategic error. Connection failed.');
        } finally {
            setIsLoading(false);
        }
    };

    const getDifficultyLabel = (val) => {
        if (val <= 3) return "Recruit";
        if (val <= 6) return "Veteran";
        if (val <= 9) return "Grandmaster";
        return "Deity";
    };

    return (
        <div className="w-full max-w-xl relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-600 to-amber-900 rounded-2xl blur opacity-20"></div>
            <div className="relative w-full bg-neutral-900 border border-amber-500/20 p-8 rounded-xl shadow-2xl"> 
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-serif font-bold text-white tracking-wide">Tactical Setup</h2>
                    <p className="text-amber-500/60 text-sm mt-2 uppercase tracking-widest">Prepare for Battle</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <label className="text-sm font-bold text-neutral-400 uppercase tracking-wider">
                                Enemy Strength
                            </label>
                            <span className="text-amber-500 font-serif font-bold text-lg">
                                {getDifficultyLabel(difficulty)} <span className="text-neutral-600 text-sm">/ Level {difficulty}</span>
                            </span>
                        </div>
                        <div className="relative h-12 flex items-center">
                            <div className="absolute w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-amber-600 transition-all duration-300" 
                                    style={{ width: `${(difficulty / 10) * 100}%` }}
                                ></div>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value)}
                                className="absolute w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div 
                                className="absolute w-6 h-6 bg-neutral-900 border-2 border-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)] pointer-events-none transition-all duration-300"
                                style={{ left: `calc(${((difficulty - 1) / 9) * 100}% - 12px)` }}
                            ></div>
                        </div>
                        <div className="flex justify-between text-xs text-neutral-600 font-mono uppercase">
                            <span>Easy</span>
                            <span>Impossible</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <p className="text-sm font-bold text-neutral-400 uppercase tracking-wider text-center">Choose Your Alliance</p>
                        <div className="grid grid-cols-3 gap-4">
                            <ColorCard 
                                value="white" 
                                label="White" 
                                selected={playerColor} 
                                onSelect={setPlayerColor} 
                                colorClass="bg-neutral-200"
                                textColor="text-neutral-900"
                            />
                            <ColorCard 
                                value="random" 
                                label="Random" 
                                selected={playerColor} 
                                onSelect={setPlayerColor} 
                                colorClass="bg-neutral-700"
                                textColor="text-neutral-300"
                                isRandom
                            />
                            <ColorCard 
                                value="black" 
                                label="Black" 
                                selected={playerColor} 
                                onSelect={setPlayerColor} 
                                colorClass="bg-black"
                                textColor="text-neutral-400"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-4 rounded-lg text-lg font-serif font-bold tracking-wider uppercase transition-all duration-300 shadow-lg ${
                            isLoading 
                                ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed' 
                                : 'bg-gradient-to-r from-amber-700 to-amber-500 text-white hover:shadow-amber-500/20 hover:-translate-y-0.5 hover:brightness-110'
                        }`}
                    >
                        {isLoading ? 'Mobilizing Forces...' : 'Deploy Army'}
                    </button>
                </form>

                {error && (
                    <div className="mt-6 p-3 bg-red-900/20 border border-red-500/30 rounded text-center">
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const ColorCard = ({ value, label, selected, onSelect, colorClass, textColor, isRandom }) => {
    const isSelected = selected === value;
    return (
        <div 
            onClick={() => onSelect(value)}
            className={`cursor-pointer relative h-24 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-2
                ${isSelected 
                    ? 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)] bg-neutral-800' 
                    : 'border-neutral-700 bg-neutral-800/50 hover:border-neutral-500'
                }`}
        >
            <div className={`w-8 h-8 rounded-full shadow-inner flex items-center justify-center ${colorClass}`}>
                {isRandom && <span className="text-lg font-bold text-neutral-400">?</span>}
            </div>
            <span className={`text-xs font-bold uppercase tracking-wider ${isSelected ? 'text-amber-500' : 'text-neutral-500'}`}>
                {label}
            </span>
            {isSelected && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_5px_#f59e0b]"></div>
            )}
        </div>
    );
};

export default NewGameForm;