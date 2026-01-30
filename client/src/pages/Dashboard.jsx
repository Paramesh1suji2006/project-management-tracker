import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import DashboardLayout from '../components/Layout/DashboardLayout';
import api from '../services/api';
import Loader from '../components/UI/Loader';
import Toast from '../components/UI/Toast';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [projectsRes, ticketsRes] = await Promise.all([
                api.get('/projects').catch(err => {
                    console.error('Projects load specific error:', err);
                    return { data: [] };
                }),
                api.get('/tickets').catch(err => {
                    console.error('Tickets load specific error:', err);
                    return { data: [] };
                }),
            ]);

            // Ensure data is always an array
            const projects = Array.isArray(projectsRes.data) ? projectsRes.data : [];
            const tickets = Array.isArray(ticketsRes.data) ? ticketsRes.data : [];

            setStats({
                totalProjects: projects.length,
                totalTickets: tickets.length,
                todoTickets: tickets.filter(t => t?.status === 'To Do').length,
                inProgressTickets: tickets.filter(t => t?.status === 'In Progress').length,
                doneTickets: tickets.filter(t => t?.status === 'Done').length,
                recentTickets: tickets.slice(0, 5),
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
            // Set default empty stats on error
            setStats({
                totalProjects: 0,
                totalTickets: 0,
                todoTickets: 0,
                inProgressTickets: 0,
                doneTickets: 0,
                recentTickets: [],
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDragEnd = async (result) => {
        if (!result.destination) return;

        const { draggableId, destination } = result;
        const statusMap = {
            'todo': 'To Do',
            'in-progress': 'In Progress',
            'done': 'Done',
        };

        const newStatus = statusMap[destination.droppableId];

        try {
            await api.put(`/tickets/${draggableId}/status`, { status: newStatus });
            setToast({ message: 'Ticket status updated!', type: 'success' });
            fetchStats(); // Refresh data
        } catch (error) {
            console.error('Error updating ticket:', error);
            setToast({ message: 'Failed to update ticket status', type: 'error' });
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

    // Group tickets by status for drag and drop
    const ticketsByStatus = {
        'To Do': stats?.recentTickets?.filter(t => t.status === 'To Do') || [],
        'In Progress': stats?.recentTickets?.filter(t => t.status === 'In Progress') || [],
        'Done': stats?.recentTickets?.filter(t => t.status === 'Done') || [],
    };

    return (
        <DashboardLayout>
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

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

                {/* Recent Tickets with Drag & Drop */}
                <div className="card">
                    <h2 className="text-2xl font-bold text-dark-50 mb-4">Recent Tickets (Drag to Change Status)</h2>
                    {stats?.recentTickets?.length > 0 ? (
                        <DragDropContext onDragEnd={handleDragEnd}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* To Do Column */}
                                <div>
                                    <h3 className="text-lg font-semibold text-blue-400 mb-3">To Do</h3>
                                    <Droppable droppableId="todo">
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                className={`space-y-2 min-h-[100px] p-2 rounded-lg ${snapshot.isDraggingOver ? 'bg-blue-900/20' : 'bg-dark-800/50'
                                                    }`}
                                            >
                                                {ticketsByStatus['To Do'].map((ticket, index) => (
                                                    <Draggable key={ticket._id} draggableId={ticket._id} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className={`p-3 bg-dark-700 rounded-lg hover:bg-dark-600 transition-all cursor-move ${snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-500' : ''
                                                                    }`}
                                                            >
                                                                <div className="flex items-start gap-2">
                                                                    <div className={`w-1 h-full ${priorityColors[ticket.priority]} rounded-full`}></div>
                                                                    <div className="flex-1">
                                                                        <h4 className="text-dark-50 font-medium text-sm">{ticket.title}</h4>
                                                                        <p className="text-dark-400 text-xs mt-1">{ticket.projectId?.title || 'No Project'}</p>
                                                                        <span className={`inline-block mt-2 px-2 py-1 ${priorityColors[ticket.priority]} text-white rounded text-xs`}>
                                                                            {ticket.priority}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                                {ticketsByStatus['To Do'].length === 0 && (
                                                    <p className="text-dark-500 text-sm text-center py-4">No tickets</p>
                                                )}
                                            </div>
                                        )}
                                    </Droppable>
                                </div>

                                {/* In Progress Column */}
                                <div>
                                    <h3 className="text-lg font-semibold text-yellow-400 mb-3">In Progress</h3>
                                    <Droppable droppableId="in-progress">
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                className={`space-y-2 min-h-[100px] p-2 rounded-lg ${snapshot.isDraggingOver ? 'bg-yellow-900/20' : 'bg-dark-800/50'
                                                    }`}
                                            >
                                                {ticketsByStatus['In Progress'].map((ticket, index) => (
                                                    <Draggable key={ticket._id} draggableId={ticket._id} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className={`p-3 bg-dark-700 rounded-lg hover:bg-dark-600 transition-all cursor-move ${snapshot.isDragging ? 'shadow-lg ring-2 ring-yellow-500' : ''
                                                                    }`}
                                                            >
                                                                <div className="flex items-start gap-2">
                                                                    <div className={`w-1 h-full ${priorityColors[ticket.priority]} rounded-full`}></div>
                                                                    <div className="flex-1">
                                                                        <h4 className="text-dark-50 font-medium text-sm">{ticket.title}</h4>
                                                                        <p className="text-dark-400 text-xs mt-1">{ticket.projectId?.title || 'No Project'}</p>
                                                                        <span className={`inline-block mt-2 px-2 py-1 ${priorityColors[ticket.priority]} text-white rounded text-xs`}>
                                                                            {ticket.priority}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                                {ticketsByStatus['In Progress'].length === 0 && (
                                                    <p className="text-dark-500 text-sm text-center py-4">No tickets</p>
                                                )}
                                            </div>
                                        )}
                                    </Droppable>
                                </div>

                                {/* Done Column */}
                                <div>
                                    <h3 className="text-lg font-semibold text-green-400 mb-3">Done</h3>
                                    <Droppable droppableId="done">
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                className={`space-y-2 min-h-[100px] p-2 rounded-lg ${snapshot.isDraggingOver ? 'bg-green-900/20' : 'bg-dark-800/50'
                                                    }`}
                                            >
                                                {ticketsByStatus['Done'].map((ticket, index) => (
                                                    <Draggable key={ticket._id} draggableId={ticket._id} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className={`p-3 bg-dark-700 rounded-lg hover:bg-dark-600 transition-all cursor-move ${snapshot.isDragging ? 'shadow-lg ring-2 ring-green-500' : ''
                                                                    }`}
                                                            >
                                                                <div className="flex items-start gap-2">
                                                                    <div className={`w-1 h-full ${priorityColors[ticket.priority]} rounded-full`}></div>
                                                                    <div className="flex-1">
                                                                        <h4 className="text-dark-50 font-medium text-sm">{ticket.title}</h4>
                                                                        <p className="text-dark-400 text-xs mt-1">{ticket.projectId?.title || 'No Project'}</p>
                                                                        <span className={`inline-block mt-2 px-2 py-1 ${priorityColors[ticket.priority]} text-white rounded text-xs`}>
                                                                            {ticket.priority}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                                {ticketsByStatus['Done'].length === 0 && (
                                                    <p className="text-dark-500 text-sm text-center py-4">No tickets</p>
                                                )}
                                            </div>
                                        )}
                                    </Droppable>
                                </div>
                            </div>
                        </DragDropContext>
                    ) : (
                        <p className="text-dark-400 text-center py-8">No tickets yet. Create your first ticket!</p>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
