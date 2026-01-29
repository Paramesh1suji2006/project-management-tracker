import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/Layout/DashboardLayout';

const Profile = () => {
    const { user } = useAuth();

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
        <DashboardLayout>
            <div className="max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold text-dark-50 mb-8">Profile</h1>

                <div className="card">
                    <div className="flex items-center gap-6 mb-8">
                        <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-dark-50">{user?.name}</h2>
                            <p className="text-dark-400">{user?.email}</p>
                            <span className={`inline-block mt-2 px-3 py-1 rounded ${getRoleBadgeColor(user?.role)} text-white text-sm font-medium`}>
                                {user?.role}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-dark-400 text-sm">Full Name</label>
                            <p className="text-dark-50 text-lg font-medium">{user?.name}</p>
                        </div>

                        <div>
                            <label className="text-dark-400 text-sm">Email Address</label>
                            <p className="text-dark-50 text-lg font-medium">{user?.email}</p>
                        </div>

                        <div>
                            <label className="text-dark-400 text-sm">Role</label>
                            <p className="text-dark-50 text-lg font-medium">{user?.role}</p>
                        </div>

                        <div>
                            <label className="text-dark-400 text-sm">User ID</label>
                            <p className="text-dark-400 text-sm font-mono">{user?._id}</p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Profile;
