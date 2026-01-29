import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/UI/Button';
import Toast from '../components/UI/Toast';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Developer',
    });
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await register(formData.name, formData.email, formData.password, formData.role);
            setToast({ message: 'Account created successfully!', type: 'success' });
            setTimeout(() => navigate('/dashboard'), 1000);
        } catch (error) {
            setToast({
                message: error.response?.data?.message || 'Registration failed',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-dark-900 via-secondary-900 to-dark-900 flex items-center justify-center p-4">
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <div className="card max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-secondary-400 to-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-dark-50 mb-2">Create Account</h1>
                    <p className="text-dark-400">Join ProjectFlow today</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-dark-300 mb-2 font-medium">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="input"
                            placeholder="John Doe"
                            required
                        />
                    </div>

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

                    <div>
                        <label className="block text-dark-300 mb-2 font-medium">Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="input"
                        >
                            <option value="Developer">Developer</option>
                            <option value="Manager">Manager</option>
                            <option value="Admin">Admin</option>
                            <option value="Viewer">Viewer</option>
                        </select>
                    </div>

                    <Button type="submit" variant="primary" className="w-full" loading={loading}>
                        Create Account
                    </Button>
                </form>

                <div className="mt-6 text-center text-dark-400">
                    Already have an account?{' '}
                    <Link to="/login" className="text-secondary-400 hover:text-secondary-300 font-medium">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
