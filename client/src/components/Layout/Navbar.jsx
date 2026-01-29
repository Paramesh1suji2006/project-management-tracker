import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import NotificationCenter from '../Notification/NotificationCenter';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getRoleBadgeColor = (role) => {
        const colors = {
            Admin: 'bg-red-500',
            Manager: 'bg-purple-500',
            Developer: 'bg-blue-500',
            Viewer: 'bg-gray-500',
        };
        return colors[role] || 'bg-gray-500';
    };

    return (
        <nav className="bg-dark-800 border-b border-dark-700 px-6 py-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-dark-50">
                        Welcome back, {user?.name}!
                    </h2>
                    <p className="text-dark-400 text-sm">
                        Manage your projects and track progress
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 px-4 py-2 bg-dark-700 rounded-lg">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="text-dark-50 font-medium">{user?.name}</p>
                            <span className={`text-xs px-2 py-1 rounded ${getRoleBadgeColor(user?.role)} text-white`}>
                                {user?.role}
                            </span>
                        </div>
                    </div>

                    {/* Notification Center */}
                    <NotificationCenter />

                    <button
                        onClick={handleLogout}
                        className="p-2 text-dark-400 hover:text-red-400 hover:bg-dark-700 rounded-lg transition-all"
                        title="Logout"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
