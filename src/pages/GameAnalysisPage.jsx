import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import API from '../api/api';
import { 
    FaArrowLeft, 
    FaArrowRight, 
    FaStepBackward, 
    FaStepForward, 
    FaMicrochip, 
    FaExclamationTriangle, 
    FaSkullCrossbones, 
    FaCheckCircle, 
    FaChessBoard, 
    FaSearch,
    FaArrowCircleLeft
} from 'react-icons/fa';

const getEvalColor = (cpValue) => {
    const normalized = Math.min(Math.max(cpValue, -800), 800) / 800;
    const whiteHeight = `${(50 + (normalized * 50)).toFixed(1)}%`;
    return whiteHeight;
};

const GameAnalysisPage = () => {
    const { gameId } = useParams();
    const navigate = useNavigate();
    
    const [gameData, setGameData] = useState(null);
    const [chess, setChess] = useState(null); 
    const [currentMoveIndex, setCurrentMoveIndex] = useState(-1); 
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [analysisStatus, setAnalysisStatus] = useState('loaded'); 
    const [boardWidth, setBoardWidth] = useState(600);

    const fetchGameAndAnalysis = useCallback(async () => {
        const token = localStorage.getItem('token'); 
        if (!token) {
            setError('Security Clearance Invalid.');
            setIsLoading(false);
            return;
        }
        
        setIsLoading(true);
        setError(null);
        try {
            let res = await API.get(`/games/${gameId}`);
            let data = res.data;

            if (data.status === 'finished' && (!data.analysis || data.analysis.length === 0)) {
                setAnalysisStatus('analyzing');
                const analysisRes = await API.post(`/games/${gameId}/analyze`, {
                  headers: { 'x-auth-token': token }
                });
                data.analysis = analysisRes.data.analysis; 
            }
            
            setAnalysisStatus('loaded');
            const initialChess = new Chess();
            setChess(initialChess);
            setGameData(data);
            setCurrentMoveIndex(-1); 
        } catch (err) {
            console.error('Failed to load or analyze game:', err);
            setError(err.response?.data?.message || 'Data Corruption Detected.');
            setAnalysisStatus('error');
        } finally {
            setIsLoading(false);
        }
    }, [gameId]);

    useEffect(() => {
        fetchGameAndAnalysis();
        const handleResize = () => {
            if (window.innerWidth < 768) setBoardWidth(window.innerWidth - 80);
            else setBoardWidth(550);
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, [fetchGameAndAnalysis]);

    const history = gameData?.moves || [];

    const navigateToMove = useCallback((index) => {
        if (!chess || !history) return;
        chess.reset(); 
        for (let i = 0; i <= index; i++) {
            chess.move(history[i]);
        }
        setChess(new Chess(chess.fen())); 
        setCurrentMoveIndex(index);
    }, [chess, history]);

    const handleNextMove = () => {
        if (currentMoveIndex < history.length - 1) {
            navigateToMove(currentMoveIndex + 1);
        }
    };

    const handlePreviousMove = () => {
        if (currentMoveIndex > -1) {
            navigateToMove(currentMoveIndex - 1);
        }
    };
    
    const handleReset = () => navigateToMove(-1); 
    const handleEnd = () => navigateToMove(history.length - 1); 

    const currentAnalysisEntry = gameData?.analysis?.[currentMoveIndex];
    const currentFen = chess ? chess.fen() : 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    const moveNumber = Math.floor(currentMoveIndex / 2) + 1;
    
    const formatEvaluation = () => {
        if (!currentAnalysisEntry) return '--';
        const { type, value } = currentAnalysisEntry.evaluation;
        
        if (type === 'mate') {
            const sign = value > 0 ? '+' : '';
            return `M${sign}${Math.abs(value)}`;
        }
        
        const sign = value > 0 ? '+' : '';
        return `${sign}${Math.abs(value) / 100}`;
    };

    if (isLoading || analysisStatus === 'analyzing') {
        return (
            <div className="min-h-screen w-full bg-neutral-950 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-900/10 via-neutral-950 to-neutral-950"></div>
                <div className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div>
                <p className="mt-6 text-amber-500 font-serif tracking-[0.3em] text-sm animate-pulse uppercase">
                    {analysisStatus === 'analyzing' ? 'Please wait while the battle is being reviewed! This may take a few minutes . . . ' : 'Retrieving Battle Data'}
                </p>
                
            </div>
        );
    }

    if (error || analysisStatus === 'error' || !gameData) {
        return (
            <div className="min-h-screen w-full bg-neutral-950 flex items-center justify-center p-4">
                <div className="bg-red-900/10 border border-red-500/30 p-8 rounded-xl text-center max-w-md backdrop-blur-sm">
                    <FaExclamationTriangle className="text-4xl text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl text-red-400 font-serif mb-2">Decryption Failed</h3>
                    <p className="text-red-300/70 text-sm mb-6">{error || 'Could not load game data.'}</p>
                    <button
                        onClick={() => navigate('/history')}
                        className="px-6 py-2 bg-red-900/40 hover:bg-red-900/60 text-red-200 text-xs uppercase tracking-widest rounded border border-red-500/30 transition-all"
                    >
                        Return to Archives
                    </button>
                </div>
            </div>
        );
    }
    
    const evalCpValue = currentAnalysisEntry?.evaluation?.type === 'cp' ? currentAnalysisEntry.evaluation.value : 0;
    const whiteEvalHeight = getEvalColor(evalCpValue);

    return (
        <div className="min-h-screen w-full bg-neutral-950 flex flex-col items-center py-8 px-4 relative overflow-y-auto">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-neutral-950 z-0"></div>
            
            <div className="relative z-10 w-full max-w-7xl mb-6 flex justify-between items-center border-b border-neutral-800 pb-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/history')} className="text-neutral-500 hover:text-amber-500 transition-colors">
                        <FaArrowCircleLeft className="text-2xl" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-serif font-bold text-white tracking-wide">Strategic Deconstruction</h1>
                        <p className="text-neutral-500 text-xs uppercase tracking-widest">ID: {gameId.substring(0, 8)} // AI Level {gameData.difficulty}</p>
                    </div>
                </div>
                <div className="px-4 py-2 bg-neutral-900 rounded border border-amber-500/20 flex items-center gap-3">
                    <FaMicrochip className="text-amber-600" />
                    <span className="text-xs font-mono text-amber-500">STOCKFISH 16 ACTIVE</span>
                </div>
            </div>

            <div className="relative z-10 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                <div className="lg:col-span-7 flex justify-center lg:justify-start relative">
                    <div className="relative flex gap-4">
                        <div className="relative w-8 h-[550px] bg-neutral-800 rounded-lg overflow-hidden border border-neutral-700 shadow-inner">
                            
                            <div 
                                className="w-full absolute top-0 transition-all duration-700 ease-in-out bg-gradient-to-b from-white to-neutral-200"
                                style={{ height: whiteEvalHeight }}
                            />
                            <div 
                                className="w-full absolute bottom-0 transition-all duration-700 ease-in-out bg-gradient-to-t from-black to-neutral-800"
                                style={{ height: `${100 - parseFloat(whiteEvalHeight)}%` }}
                            />
                            <div className="absolute left-0 right-0 top-1/2 h-px bg-amber-500/50 z-10"></div>
                            <span className={`absolute left-1/2 transform -translate-x-1/2 text-[10px] font-bold px-1 rounded z-20 ${parseFloat(whiteEvalHeight) > 50 ? 'bottom-2 text-white' : 'top-2 text-black'}`}>
                                {formatEvaluation()}
                            </span>
                        </div>

                        <div className={`bg-neutral-900/80 backdrop-blur-xl border border-amber-500/20 rounded-xl p-2 shadow-2xl`}>
                            <Chessboard
                                options={{
                                    position: currentFen,
                                    boardOrientation: gameData.humanColor, // Use human color for orientation
                                    arePiecesDraggable: false, // Viewer mode
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-5 flex flex-col gap-6">
                    <div className="bg-neutral-900/90 backdrop-blur border border-neutral-800 rounded-xl p-6 shadow-xl">
                        <div className="flex justify-between items-center mb-6 border-b border-neutral-800 pb-4">
                            <h2 className="text-sm font-bold text-amber-500 uppercase tracking-widest flex items-center gap-2">
                                <FaSearch /> Analysis Log
                            </h2>
                            <span className="text-4xl font-mono font-bold text-white">
                                {currentMoveIndex === -1 ? 'START' : `${moveNumber}${currentMoveIndex % 2 === 0 ? '.' : '...'}`}
                            </span>
                        </div>

                        <div className="grid grid-cols-4 gap-2 mb-6">
                            <button onClick={handleReset} className="p-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white rounded border border-neutral-700 flex justify-center items-center transition-all">
                                <FaStepBackward />
                            </button>
                            <button onClick={handlePreviousMove} className="p-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white rounded border border-neutral-700 flex justify-center items-center transition-all">
                                <FaArrowLeft />
                            </button>
                            <button onClick={handleNextMove} className="p-3 bg-amber-600 hover:bg-amber-500 text-white rounded border border-amber-500/50 flex justify-center items-center shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all">
                                <FaArrowRight />
                            </button>
                            <button onClick={handleEnd} className="p-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white rounded border border-neutral-700 flex justify-center items-center transition-all">
                                <FaStepForward />
                            </button>
                        </div>

                        <div className="bg-neutral-950 rounded-lg border border-neutral-800 p-4 min-h-[200px]">
                            {currentAnalysisEntry ? (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-neutral-500 uppercase tracking-wider">Executed Maneuver</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl font-serif font-bold text-white">{currentAnalysisEntry.move}</span>
                                            {currentAnalysisEntry.isBlunder && <span className="px-2 py-0.5 bg-red-900/30 text-red-500 text-xs border border-red-500/30 rounded uppercase font-bold">Blunder</span>}
                                            {currentAnalysisEntry.isMistake && <span className="px-2 py-0.5 bg-orange-900/30 text-orange-500 text-xs border border-orange-500/30 rounded uppercase font-bold">Mistake</span>}
                                            {!currentAnalysisEntry.isBlunder && !currentAnalysisEntry.isMistake && <span className="px-2 py-0.5 bg-emerald-900/30 text-emerald-500 text-xs border border-emerald-500/30 rounded uppercase font-bold">Solid</span>}
                                        </div>
                                    </div>

                                    {currentAnalysisEntry.comment && (
                                        <div className={`p-3 rounded border-l-2 ${currentAnalysisEntry.isBlunder ? 'bg-red-950/20 border-red-500' : 'bg-orange-950/20 border-orange-500'}`}>
                                            <div className="flex items-start gap-3">
                                                {currentAnalysisEntry.isBlunder ? <FaSkullCrossbones className="text-red-500 mt-1" /> : <FaExclamationTriangle className="text-orange-500 mt-1" />}
                                                <p className="text-sm text-neutral-300 italic leading-relaxed">{currentAnalysisEntry.comment}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-2 pt-2 border-t border-neutral-800">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-amber-500 uppercase">Optimal Vector</span>
                                            <span className="text-sm font-mono text-emerald-400 font-bold">{currentAnalysisEntry.bestMove}</span>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-xs text-neutral-500 uppercase block">Principal Variation</span>
                                            <p className="text-xs font-mono text-neutral-400 break-all leading-relaxed bg-neutral-900 p-2 rounded border border-neutral-800">
                                                {currentAnalysisEntry.principalVariation}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-neutral-600 gap-2">
                                    <FaChessBoard className="text-3xl opacity-20" />
                                    <p className="text-xs uppercase tracking-widest">Awaiting Selection</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex-grow bg-neutral-900/90 backdrop-blur border border-neutral-800 rounded-xl p-6 shadow-xl flex flex-col overflow-hidden max-h-[300px]">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Move History</h3>
                        </div>
                        <div className="flex-grow overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent">
                            <div className="grid grid-cols-6 gap-2 text-xs text-neutral-600 mb-2 uppercase tracking-wider border-b border-neutral-800 pb-2 sticky top-0 bg-neutral-900/95">
                                <span className="col-span-1">#</span>
                                <span className="col-span-2">White</span>
                                <span className="col-span-3">Black</span>
                            </div>
                            {history.reduce((result, move, index) => {
                                if (index % 2 === 0) result.push([move]);
                                else result[result.length - 1].push(move);
                                return result;
                            }, []).map((pair, i) => (
                                <div 
                                    key={i} 
                                    className={`grid grid-cols-6 gap-2 text-sm py-1 px-2 rounded transition-all cursor-pointer border border-transparent
                                        ${Math.floor(currentMoveIndex / 2) === i ? 'bg-neutral-800 border-neutral-700' : 'hover:bg-neutral-800/50'}
                                    `}
                                >
                                    <span className="col-span-1 text-neutral-600 font-mono text-xs pt-1">{i + 1}.</span>
                                    <span 
                                        onClick={() => navigateToMove(i * 2)}
                                        className={`col-span-2 font-mono cursor-pointer hover:text-amber-400 transition-colors ${currentMoveIndex === i * 2 ? 'text-amber-500 font-bold' : 'text-neutral-300'}`}
                                    >
                                        {pair[0]}
                                    </span>
                                    <span 
                                        onClick={() => pair[1] && navigateToMove(i * 2 + 1)}
                                        className={`col-span-3 font-mono cursor-pointer hover:text-amber-400 transition-colors ${currentMoveIndex === i * 2 + 1 ? 'text-amber-500 font-bold' : 'text-neutral-400'}`}
                                    >
                                        {pair[1] || ''}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameAnalysisPage;