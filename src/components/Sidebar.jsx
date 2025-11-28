import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const { logout, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div className="w-full h-full min-h-[500px] flex flex-col bg-neutral-900/80 backdrop-blur-md border border-amber-500/20 rounded-xl shadow-2xl shadow-black overflow-hidden">
            <div className="p-6 border-b border-amber-500/10 bg-neutral-800/30">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center shadow-lg shadow-amber-900/50 text-white font-bold text-xl">
                        {user ? user.username.charAt(0).toUpperCase() : 'G'}
                    </div>
                    <div>
                        <p className="text-xs text-amber-500 uppercase tracking-widest font-semibold">Commander</p>
                        <h3 className="text-lg font-serif text-white tracking-wide truncate max-w-[140px]">
                            {user ? user.username : 'Guest'}
                        </h3>
                    </div>
                </div>
            </div>

            <nav className="flex-grow p-4 space-y-2">
                <button
                    onClick={() => navigate('/dashboard')}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
                        isActive('/dashboard') 
                        ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                        : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                    }`}
                >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    <span className="font-medium tracking-wide">War Room</span>
                </button>

                <button
                    onClick={() => navigate('/history')}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
                        isActive('/history') 
                        ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                        : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                    }`}
                >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium tracking-wide">Battle Archives</span>
                </button>
            </nav>

            <div className="p-4 border-t border-amber-500/10 bg-neutral-800/30">
                <button
                    onClick={handleLogout}
                    className="w-full py-3 px-4 rounded-lg bg-red-900/20 text-red-400 border border-red-900/50 hover:bg-red-900/40 hover:border-red-500/50 transition-all duration-200 flex items-center justify-center gap-2 font-medium tracking-wide group"
                >
                    <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Log Out
                </button>
            </div>
        </div>
    );
};

export default Sidebar;