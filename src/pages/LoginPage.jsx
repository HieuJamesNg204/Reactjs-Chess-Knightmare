import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState(null);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const { username, password } = formData;

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        const result = await login(formData);
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-neutral-900 relative overflow-hidden">
            <div 
                className="absolute inset-0 bg-cover bg-center z-0 opacity-40" 
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=2071&auto=format&fit=crop')" }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/80 to-transparent z-0"></div>

            <div className="relative z-10 w-full max-w-md mx-4">
                <div className="bg-neutral-900/60 backdrop-blur-xl border border-amber-500/20 rounded-2xl shadow-2xl shadow-black overflow-hidden">
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-amber-400 to-amber-700 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a1 1 0 011 1v1a1 1 0 01-1 1h-1v1h2a1 1 0 011 1v1a1 1 0 01-1 1h-2v5h3a1 1 0 011 1v2a1 1 0 01-1 1H8a1 1 0 01-1-1v-2a1 1 0 011-1h3v-5H9a1 1 0 01-1-1v-1a1 1 0 011-1h2V9H9a1 1 0 01-1-1V7a1 1 0 011-1h1V5.73A2 2 0 019 4a2 2 0 013-2z" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-serif font-bold text-white tracking-wide">Welcome Back</h2>
                            <p className="text-neutral-400 text-sm mt-2">Enter the arena of kings</p>
                        </div>

                        <form onSubmit={onSubmit} className="space-y-6">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-amber-500 uppercase tracking-wider ml-1">Username</label>
                                <input
                                    type="username"
                                    name="username"
                                    value={username}
                                    onChange={onChange}
                                    placeholder="Grandmaster"
                                    required
                                    className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder-neutral-500 transition duration-200 outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-amber-500 uppercase tracking-wider ml-1">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={password}
                                    onChange={onChange}
                                    placeholder="••••••••"
                                    required
                                    className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder-neutral-500 transition duration-200 outline-none"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold rounded-lg shadow-lg shadow-amber-900/50 transform transition hover:-translate-y-0.5 duration-200"
                            >
                                Resume Game
                            </button>
                        </form>

                        {error && (
                            <div className="mt-4 p-3 bg-red-900/20 border border-red-500/50 rounded-lg">
                                <p className="text-red-400 text-sm text-center">{error}</p>
                            </div>
                        )}

                        <p className="mt-8 text-center text-neutral-400 text-sm">
                            New to Chess Knightmare?{' '}
                            <Link to="/register" className="text-amber-500 hover:text-amber-400 font-semibold transition-colors">
                                Create an Account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;