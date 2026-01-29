import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/Layout/DashboardLayout';
import api from '../services/api';
import Loader from '../components/UI/Loader';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [projectsRes, ticketsRes] = await Promise.all([
                api.get('/projects'),
                api.get('/tickets'),
            ]);

            const projects = projectsRes.data;
            const tickets = ticketsRes.data;

            setStats({
                totalProjects: projects.length,
                totalTickets: tickets.length,
                todoTickets: tickets.filter(t => t.status === 'To Do').length,
                inProgressTickets: tickets.filter(t => t.status === 'In Progress').length,
                doneTickets: tickets.filter(t => t.status === 'Done').length,
                recentTickets: tickets.slice(0, 5),
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <Loader fullPage />
            </DashboardLayout>
        );
    }

    const priorityColors = {
        Low: 'bg-green-500',
        Medium: 'bg-yellow-500',
        High: 'bg-red-500',
    };

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-4xl font-bold text-dark-50 mb-2">Dashboard</h1>
                    <p className="text-dark-400">Overview of your projects and tickets</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="card bg-gradient-to-br from-primary-600 to-primary-700 border-primary-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-primary-100 text-sm">Total Projects</p>
                                <p className="text-4xl font-bold text-white mt-2">{stats?.totalProjects || 0}</p>
                            </div>
                            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-gradient-to-br from-blue-600 to-blue-700 border-blue-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm">To Do</p>
                                <p className="text-4xl font-bold text-white mt-2">{stats?.todoTickets || 0}</p>
                            </div>
                            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-gradient-to-br from-yellow-600 to-yellow-700 border-yellow-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-yellow-100 text-sm">In Progress</p>
                                <p className="text-4xl font-bold text-white mt-2">{stats?.inProgressTickets || 0}</p>
                            </div>
                            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-gradient-to-br from-green-600 to-green-700 border-green-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm">Completed</p>
                                <p className="text-4xl font-bold text-white mt-2">{stats?.doneTickets || 0}</p>
                            </div>
                            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="card">
                    <h2 className="text-2xl font-bold text-dark-50 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link to="/projects" className="btn-primary text-center">
                            View All Projects
                        </Link>
                        <Link to="/create-ticket" className="btn-secondary text-center">
                            Create New Ticket
                        </Link>
                        <Link to="/profile" className="btn-secondary text-center">
                            View Profile
                        </Link>
                    </div>
                </div>

                {/* Recent Tickets */}
                <div className="card">
                    <h2 className="text-2xl font-bold text-dark-50 mb-4">Recent Tickets</h2>
                    {stats?.recentTickets?.length > 0 ? (
                        <div className="space-y-3">
                            {stats.recentTickets.map((ticket) => (
                                <div key={ticket._id} className="flex items-center justify-between p-4 bg-dark-700 rounded-lg hover:bg-dark-600 transition-all">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className={`w-2 h-12 ${priorityColors[ticket.priority]} rounded-full`}></div>
                                        <div className="flex-1">
                                            <h3 className="text-dark-50 font-medium">{ticket.title}</h3>
                                            <p className="text-dark-400 text-sm">{ticket.projectId?.title || 'No Project'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="px-3 py-1 bg-dark-800 rounded text-dark-300 text-sm">
                                            {ticket.status}
                                        </span>
                                        <span className={`px-3 py-1 ${priorityColors[ticket.priority]} text-white rounded text-sm`}>
                                            {ticket.priority}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-dark-400 text-center py-8">No tickets yet. Create your first ticket!</p>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
