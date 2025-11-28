import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import { FaChessKing, FaCheck, FaTimes } from 'react-icons/fa';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [acceptTerms, setAcceptTerms] = useState(false); // New state for checkbox
    const [error, setError] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const { username, email, password, confirmPassword } = formData;

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Validation: Check Terms
        if (!acceptTerms) {
            setError("You must accept the War Room Protocols (Terms & Conditions).");
            return;
        }

        // Validation: Check Passwords
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        const { confirmPassword: _, ...registerData } = formData;

        const result = await register(registerData);
        if (result.success) {
            setShowSuccessModal(true);
        } else {
            setError(result.message);
        }
    };

    const handleProceed = () => {
        setShowSuccessModal(false);
        navigate('/login');
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-neutral-900 relative overflow-hidden">
            {/* Background Assets */}
            <div 
                className="absolute inset-0 bg-cover bg-center z-0 opacity-40" 
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1586165368502-1bad197a6461?q=80&w=2158&auto=format&fit=crop')" }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/80 to-transparent z-0"></div>

            {/* Custom Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/90 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="relative w-full max-w-sm mx-4 bg-neutral-900 border border-amber-500/30 rounded-xl shadow-[0_0_50px_rgba(245,158,11,0.2)] p-1">
                        <div className="bg-neutral-900/50 rounded-lg p-8 flex flex-col items-center text-center">
                            
                            <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/50 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                                <FaChessKing className="text-3xl text-amber-500" />
                            </div>

                            <h3 className="text-2xl font-serif font-bold text-white mb-2">Account Forged</h3>
                            <p className="text-neutral-400 text-sm mb-8">
                                Welcome, Strategist. Your seat at the table is reserved. Prepare your forces.
                            </p>

                            <button
                                onClick={handleProceed}
                                className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold rounded-lg shadow-lg shadow-amber-900/40 transform transition hover:-translate-y-0.5 duration-200 flex items-center justify-center gap-2"
                            >
                                <FaCheck className="text-sm" />
                                Enter the War Room
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Registration Form */}
            <div className={`relative z-10 w-full max-w-md mx-4 transition-all duration-500 ${showSuccessModal ? 'blur-sm scale-95 pointer-events-none' : ''}`}>
                <div className="bg-neutral-900/60 backdrop-blur-xl border border-amber-500/20 rounded-2xl shadow-2xl shadow-black overflow-hidden">
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-serif font-bold text-white tracking-wide">Begin Your Legacy</h2>
                            <p className="text-neutral-400 text-sm mt-2">Join the elite circle of strategists</p>
                        </div>

                        <form onSubmit={onSubmit} className="space-y-5">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-amber-500 uppercase tracking-wider ml-1">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={username}
                                    onChange={onChange}
                                    placeholder="Choose your title"
                                    required
                                    className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder-neutral-500 transition duration-200 outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-amber-500 uppercase tracking-wider ml-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={onChange}
                                    placeholder="email@example.com"
                                    required
                                    className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder-neutral-500 transition duration-200 outline-none"
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="space-y-1 w-1/2">
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
                                <div className="space-y-1 w-1/2">
                                    <label className="text-xs font-medium text-amber-500 uppercase tracking-wider ml-1">Confirm</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={confirmPassword}
                                        onChange={onChange}
                                        placeholder="••••••••"
                                        required
                                        className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder-neutral-500 transition duration-200 outline-none"
                                    />
                                </div>
                            </div>

                            {/* Terms and Conditions Checkbox */}
                            <div className="flex items-center gap-3 pt-2">
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        checked={acceptTerms}
                                        onChange={(e) => setAcceptTerms(e.target.checked)}
                                        className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-neutral-600 bg-neutral-800 transition-all checked:border-amber-500 checked:bg-amber-500 hover:border-amber-400 focus:ring-2 focus:ring-amber-500/50 focus:outline-none"
                                    />
                                    <FaCheck className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] text-white opacity-0 peer-checked:opacity-100" />
                                </div>
                                <label htmlFor="terms" className="text-xs text-neutral-400 select-none cursor-pointer">
                                    I accept the <span className="text-amber-500 hover:text-amber-400 underline decoration-amber-500/30 transition-colors">War Room Protocols & Terms</span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold rounded-lg shadow-lg shadow-amber-900/50 transform transition hover:-translate-y-0.5 duration-200 mt-2"
                            >
                                Register Account
                            </button>
                        </form>

                        {error && (
                            <div className="mt-4 p-3 bg-red-900/20 border border-red-500/50 rounded-lg flex items-center gap-2 justify-center animate-in fade-in slide-in-from-top-2">
                                <FaTimes className="text-red-400 flex-shrink-0" />
                                <p className="text-red-400 text-sm">{error}</p>
                            </div>
                        )}

                        <p className="mt-8 text-center text-neutral-400 text-sm">
                            Already a member?{' '}
                            <Link to="/login" className="text-amber-500 hover:text-amber-400 font-semibold transition-colors">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;