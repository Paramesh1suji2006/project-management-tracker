import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/UI/Button';
import Toast from '../components/UI/Toast';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login(formData.email, formData.password);
            setToast({ message: 'Login successful!', type: 'success' });
            setTimeout(() => navigate('/dashboard'), 1000);
        } catch (error) {
            setToast({
                message: error.response?.data?.message || 'Login failed. Please check your credentials.',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-dark-900 via-primary-900 to-dark-900 flex items-center justify-center p-4">
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <div className="card max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-dark-50 mb-2">Welcome Back</h1>
                    <p className="text-dark-400">Sign in to your ProjectFlow account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-dark-300 mb-2 font-medium">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="input"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-dark-300 mb-2 font-medium">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="input"
                            placeholder="••••••••"
                            minLength="6"
                            required
                        />
                    </div>

                    <Button type="submit" variant="primary" className="w-full" loading={loading}>
                        Sign In
                    </Button>
                </form>

                <div className="mt-6 text-center text-dark-400">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium">
                        Sign up
                    </Link>
                </div>

                <div className="mt-4 p-4 bg-dark-700 rounded-lg border border-dark-600">
                    <p className="text-dark-300 text-sm font-medium mb-2">Test Accounts:</p>
                    <div className="space-y-1 text-xs text-dark-400">
                        <p>Admin: admin@example.com / password123</p>
                        <p>Manager: manager@example.com / password123</p>
                        <p>Developer: dev1@example.com / password123</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
