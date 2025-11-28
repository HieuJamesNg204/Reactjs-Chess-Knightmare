import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import GameBoardPage from './pages/GameBoardPage.jsx';
import GameHistoryPage from './pages/GameHistoryPage.jsx';
import GameAnalysisPage from './pages/GameAnalysisPage.jsx';

const Navigation = () => {
    const { isAuthenticated, logout } = useContext(AuthContext);
    const location = useLocation();
    const isAuthPage = ['/login', '/register'].includes(location.pathname);

    if (isAuthPage) return null;

    return (
        <header className="sticky top-0 z-50 w-full border-b border-amber-500/10 bg-neutral-900/90 backdrop-blur-xl shadow-lg shadow-black/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-20 items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-700 rounded-lg flex items-center justify-center shadow-lg shadow-amber-600/20 group-hover:shadow-amber-500/40 transition-all duration-300">
                            <span className="text-2xl text-white">♟️</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-serif font-bold tracking-wide text-neutral-100 group-hover:text-amber-400 transition-colors">
                                CHESS KNIGHTMARE
                            </span>
                            <span className="text-[0.65rem] uppercase tracking-[0.2em] text-amber-500/70 font-semibold">
                                Tactical Warfare Suite
                            </span>
                        </div>
                    </Link>
                    
                    {isAuthenticated && (
                        <nav className="flex items-center gap-8">
                            <div className="hidden md:flex gap-6">
                                <Link to="/dashboard" className="text-sm font-medium text-neutral-400 hover:text-amber-400 transition-colors uppercase tracking-wider">Dashboard</Link>
                                <Link to="/history" className="text-sm font-medium text-neutral-400 hover:text-amber-400 transition-colors uppercase tracking-wider">Archives</Link>
                            </div>
                            <div className="h-6 w-px bg-neutral-800 hidden md:block"></div>
                            <button 
                                onClick={logout}
                                className="px-6 py-2.5 text-xs font-bold text-neutral-900 bg-gradient-to-r from-amber-600 to-amber-500 rounded hover:from-amber-500 hover:to-amber-400 transition-all shadow-lg shadow-amber-900/20 uppercase tracking-widest transform hover:-translate-y-0.5"
                            >
                                Sign Out
                            </button>
                        </nav>
                    )}
                </div>
            </div>
        </header>
    );
};

const AppContent = () => {
    const { isAuthenticated, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="min-h-screen w-full bg-neutral-950 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-900/20 via-neutral-950 to-neutral-950"></div>
                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
                    <p className="mt-6 text-amber-500 font-serif tracking-[0.3em] text-sm animate-pulse uppercase">Initializing Strategy</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-amber-500/30 selection:text-amber-100 flex flex-col">
            <Navigation />
            
            <main className="flex-grow relative flex flex-col">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-neutral-950 pointer-events-none z-0"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none z-0"></div>
                
                <div className="relative z-10 w-full h-full flex-grow flex flex-col">
                    <Routes>
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/login" element={<LoginPage />} />

                        <Route
                            path="/dashboard"
                            element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />}
                        />
                        <Route
                            path="/history"
                            element={isAuthenticated ? <GameHistoryPage /> : <Navigate to="/login" />}
                        />
                        <Route 
                            path="/game/:gameId" 
                            element={isAuthenticated ? <GameBoardPage /> : <Navigate to="/login" />} 
                        />
                        <Route
                            path="/"
                            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
                        />
                        <Route 
                            path="/analyze/:gameId" 
                            element={isAuthenticated ? <GameAnalysisPage />: <Navigate to="/login" />}
                        />
                    </Routes>
                </div>
            </main>
        </div>
    );
};

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </Router>
    );
};

export default App;