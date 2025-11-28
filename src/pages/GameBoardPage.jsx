import React, { useState, useCallback, useEffect, useContext } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/api';
import { AuthContext } from '../context/AuthContext.jsx';
import GameStatusModal from '../components/GameStatusModal.jsx';
import { FaFlag, FaHistory, FaChessBoard, FaRobot, FaUserAstronaut, FaMicrochip } from 'react-icons/fa';

const GameBoardPage = () => {
    const { gameId } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useContext(AuthContext);

    const [game, setGame] = useState(new Chess()); 
    const [boardWidth, setBoardWidth] = useState(600);
    const [playerColor, setPlayerColor] = useState('w'); 

    const [moveFrom, setMoveFrom] = useState('');
    const [optionSquares, setOptionSquares] = useState({});

    const [isModalOpen, setIsModalOpen] = useState(false);

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const isMounted = React.useRef(true);

    useEffect(() => {
        return () => {
            isMounted.current = false; // Cleanup when component unmounts
        };
    }, []);

    const safeGameMutate = (modify) => {
        setGame((g) => {
            const newGame = new Chess(g.fen()); 
            try {
                modify(newGame);
            } catch (error) {
                console.error("Move attempt failed within safeGameMutate:", error.message);
                return g; 
            }
            if (newGame.fen() !== g.fen()) {
                return newGame;
            }
            return g; 
        });
    };

    const sendMoveToBackend = async (move) => {
        const token = localStorage.getItem('token'); 
        if (!token) return;

        try {
            // 1. Send the player's move to the server
            const response = await API.post(`/games/${gameId}/move`, move, {
                headers: { 'x-auth-token': `${token}` }
            });

            // 2. DELAY
            // Wait 500ms to 1500ms to simulate "thinking"
            // This runs concurrently with the actual network request if placed before,
            // but placing it here ensures a minimum pause after the server responds.
            await delay(1000); 

            if (!isMounted.current) return;

            // 3. Execute Bot's Move
            // Note: Adjust 'response.data.move' to match your actual API response structure 
            // (e.g., response.data.botMove, response.data.fen, etc.)
            const botMove = response.data.move; 
            
            if (botMove) {
                safeGameMutate((g) => {
                    g.move(botMove);
                });
            }

        } catch (error) {
            console.error('Failed to send move:', error.response?.data?.message || error.message);
            // If the move failed (illegal, server error), undo the player's move locally
            safeGameMutate((game) => {
                game.undo();
            });
        }
    };

    const isPlayerTurn = playerColor === game.turn();
    const boardOrientation = playerColor === 'w' ? 'white' : 'black';

    const getMoveOptions = useCallback((square) => {
        const moves = game.moves({
            square,
            verbose: true
        });

        if (moves.length === 0) {
            setOptionSquares({});
            return false;
        }

        const newSquares = {};
        for (const move of moves) {
            newSquares[move.to] = {
                background: game.get(move.to) && game.get(move.to)?.color !== game.get(square)?.color 
                    ? 'radial-gradient(circle, rgba(220, 38, 38, 0.6) 85%, transparent 85%)' 
                    : 'radial-gradient(circle, rgba(245, 158, 11, 0.4) 25%, transparent 25%)', 
                borderRadius: '50%'
            };
        }

        newSquares[square] = { 
            background: 'rgba(245, 158, 11, 0.3)',
            boxShadow: 'inset 0 0 10px rgba(245, 158, 11, 0.5)'
        }; 
        
        setOptionSquares(newSquares);
        return true;
    }, [game]);

    const onSquareClick = useCallback(({ square, piece }) => {
        const pieceColor = piece?.pieceType?.charAt(0).toLowerCase(); 

        if (!moveFrom && pieceColor === playerColor) { 
            if (!isPlayerTurn) return; 
            const hasMoveOptions = getMoveOptions(square);
            if (hasMoveOptions) setMoveFrom(square);
            return;
        }

        if (moveFrom) {
            const move = {
                from: moveFrom,
                to: square,
                promotion: (game.get(moveFrom)?.type === 'p' && (square.endsWith('8') || square.endsWith('1'))) 
                            ? 'q' : undefined,
            };

            let moveResult = null;
            
            safeGameMutate((g) => {
                moveResult = g.move(move);
            });

            if (moveResult === null) {
                const hasMoveOptions = getMoveOptions(square);
                setMoveFrom(hasMoveOptions ? square : '');
                if (!hasMoveOptions) setOptionSquares({});
                return;
            }
            
            let moveStr = `${move.from}${move.to}`;
            if (move.promotion) moveStr += move.promotion;
            
            sendMoveToBackend({ move: moveStr });

            setMoveFrom('');
            setOptionSquares({});
        }
    }, [moveFrom, playerColor, isPlayerTurn, game, safeGameMutate, sendMoveToBackend, getMoveOptions]);

    const onDrop = useCallback(({ sourceSquare, targetSquare, piece }) => {
        const move = {
            from: sourceSquare,
            to: targetSquare,
            promotion: ((piece.pieceType === 'wP' || piece.pieceType === 'bP') && (targetSquare.endsWith('8') || targetSquare.endsWith('1'))) 
                    ? 'q' : undefined,
        };

        let moveResult = null; 

        safeGameMutate((game) => {
            moveResult = game.move(move);
        });

        if (moveResult === null) return false; 
        
        let moveStr = `${move.from}${move.to}`;
        if (move.promotion) moveStr += move.promotion;
        
        sendMoveToBackend({ move: moveStr });
        return true; 
    }, [safeGameMutate, sendMoveToBackend]);

    const handleBackToDashboard = () => {
        navigate('/dashboard');
    };

    const handleAnalyze = () => {
        navigate(`/analyze/${gameId}`); 
        setIsModalOpen(false); 
    };

    const checkGameStatus = useCallback(() => {
        if (game.isGameOver() && !isModalOpen) {
            setIsModalOpen(true);
        }
    }, [game, isModalOpen]);

    useEffect(() => {
        checkGameStatus();
    }, [checkGameStatus]);

    const terminateGame = async () => {
        try {
            await API.post(`/games/${gameId}/terminate`, {
                headers: { 'x-auth-token': `${localStorage.getItem('token')}` }
            });
            navigate('/dashboard');
        } catch (error) {
            console.error('Failed to terminate game:', error.response?.data?.message || error.message);
        }
    };

    const loadGame = useCallback(async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        try {
            const res = await API.get(`/games/${gameId}`);
            const { fen, players, status } = res.data;
            
            let humanColor = 'white'; 
            if (players.white === 'Human') {
                humanColor = 'white';
            } else if (players.black === 'Human') {
                humanColor = 'black';
            }
            
            setPlayerColor(humanColor === 'white' ? 'w' : 'b');

            safeGameMutate((game) => {
                game.load(fen);
            });
            
        } catch (error) {
            console.error('Failed to load game:', error);
            navigate('/dashboard'); 
        }
    }, [gameId, isAuthenticated, navigate, safeGameMutate]);
    
    useEffect(() => {
        loadGame();
        
        const handleResize = () => {
            if (window.innerWidth < 768) setBoardWidth(window.innerWidth - 48);
            else setBoardWidth(600);
        };
        
        window.addEventListener('resize', handleResize);
        handleResize();
        
        return () => window.removeEventListener('resize', handleResize);
    }, [loadGame]);

    let statusMessage = '';
    let gameResult = 'playing';
    let statusColor = 'text-neutral-200';
    
    if (game.isCheckmate()) {
        const losingColor = game.turn(); 
        if (losingColor === playerColor) {
            statusMessage = `CRITICAL FAILURE // KING CAPTURED`;
            gameResult = 'loss';
            statusColor = 'text-red-500';
        } else {
            statusMessage = `TARGET ELIMINATED // VICTORY`;
            gameResult = 'win';
            statusColor = 'text-emerald-500';
        }
    } else if (game.isDraw()) {
        statusMessage = 'STALEMATE DETECTED';
        gameResult = 'draw';
        statusColor = 'text-amber-500';
    } else if (game.isCheck()) {
        statusMessage = `WARNING: KING UNDER ATTACK`;
        gameResult = 'playing';
        statusColor = 'text-orange-500 animate-pulse';
    } else {
        statusMessage = `${game.turn() === 'w' ? 'WHITE' : 'BLACK'} OPERATIVE MOVING`;
        gameResult = 'playing';
        statusColor = 'text-amber-500';
    }

    return (
        <div className="min-h-screen w-full bg-neutral-950 flex flex-col items-center justify-center py-8 px-4 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-neutral-950 z-0"></div>
            
            <GameStatusModal
                isOpen={isModalOpen}
                statusMessage={statusMessage} 
                playerResult={gameResult}
                onBackToDashboard={handleBackToDashboard}
                onAnalyze={handleAnalyze}
            />
            
            <div className="relative z-10 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                <div className="lg:col-span-2 flex flex-col items-center">
                    <div className={`w-full max-w-[650px] bg-neutral-900/80 backdrop-blur-xl border ${game.isCheck() ? 'border-red-500/40 shadow-[0_0_30px_rgba(220,38,38,0.2)]' : 'border-amber-500/20 shadow-2xl'} rounded-2xl p-1 transition-all duration-500`}>
                        <div className="w-full flex justify-between items-center px-6 py-3 border-b border-neutral-800 mb-1">
                            <div className="flex items-center gap-2">
                                <FaChessBoard className="text-amber-600" />
                                <span className="text-xs font-bold tracking-[0.2em] text-neutral-500 uppercase">Sector 7 Grid</span>
                            </div>
                            <div className={`text-sm font-mono font-bold tracking-widest ${statusColor}`}>
                                {statusMessage}
                            </div>
                        </div>
                        
                        <div className="p-2 rounded-xl overflow-hidden">
                            <Chessboard
                                options={{
                                    position: game.fen(),
                                    onPieceDrop: onDrop,
                                    onSquareClick: onSquareClick,
                                    squareStyles: optionSquares,
                                    boardOrientation,
                                    arePiecesDraggable: isPlayerTurn,
                                    customBoardStyle: {
                                        borderRadius: '4px',
                                        boxShadow: '0 5px 15px rgba(0,0,0,0.5)',
                                    },
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 w-full">
                    <div className="bg-neutral-900/90 backdrop-blur border border-neutral-800 rounded-xl p-6 shadow-xl flex flex-col gap-6 h-full min-h-[600px]">
                        
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-neutral-800/50 rounded-lg border border-neutral-700">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${playerColor === 'w' ? 'bg-neutral-200 text-neutral-900' : 'bg-neutral-900 text-neutral-200 border border-neutral-600'}`}>
                                        <FaUserAstronaut className="text-xl" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-amber-500 uppercase tracking-wider font-bold">Commander (You)</p>
                                        <p className="text-white font-serif">
                                            {playerColor === 'w' ? 'White Legion' : 'Black Legion'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-center">
                                <div className="h-8 w-px bg-gradient-to-b from-transparent via-amber-500/50 to-transparent"></div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-neutral-800/50 rounded-lg border border-neutral-700 opacity-80">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${playerColor === 'w' ? 'bg-neutral-900 text-neutral-200 border border-neutral-600' : 'bg-neutral-200 text-neutral-900'}`}>
                                        <FaRobot className="text-xl" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-red-400 uppercase tracking-wider font-bold">Adversary</p>
                                        <p className="text-neutral-400 font-serif">
                                            {playerColor === 'w' ? 'Black Legion' : 'White Legion'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-grow flex flex-col bg-neutral-950 rounded-lg border border-neutral-800 overflow-hidden relative">
                            <div className="px-4 py-3 bg-neutral-900 border-b border-neutral-800 flex justify-between items-center">
                                <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest flex items-center gap-2">
                                    <FaHistory /> Tactical Log
                                </h3>
                                

[Image of chess algebraic notation]

                                <FaMicrochip className="text-neutral-700" />
                            </div>
                            <div className="flex-grow overflow-y-auto p-4 font-mono text-sm space-y-1 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent">
                                <div className="grid grid-cols-6 gap-2 text-xs text-neutral-600 mb-2 border-b border-neutral-800 pb-2 uppercase tracking-wider">
                                    <span className="col-span-1">#</span>
                                    <span className="col-span-2">White</span>
                                    <span className="col-span-2">Black</span>
                                </div>
                                {game.history().reduce((result, move, index) => {
                                    if (index % 2 === 0) {
                                        result.push([move]);
                                    } else {
                                        result[result.length - 1].push(move);
                                    }
                                    return result;
                                }, []).map((pair, i) => (
                                    <div key={i} className="grid grid-cols-6 gap-2 text-neutral-300 hover:bg-neutral-800/50 rounded px-1 py-0.5 transition-colors">
                                        <span className="col-span-1 text-neutral-600">{i + 1}.</span>
                                        <span className="col-span-2 text-amber-100">{pair[0]}</span>
                                        <span className="col-span-2 text-neutral-400">{pair[1] || '...'}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={terminateGame}
                            className="w-full py-4 bg-red-900/10 hover:bg-red-900/30 text-red-500 hover:text-red-400 border border-red-900/50 hover:border-red-500 rounded-lg font-bold text-xs uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 group"
                        >
                            <FaFlag className="group-hover:-translate-y-0.5 transition-transform" />
                            Abort Mission
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameBoardPage;