import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext } from 'react-beautiful-dnd';
import DashboardLayout from '../components/Layout/DashboardLayout';
import Column from '../components/Board/Column';
import TicketModal from '../components/Ticket/TicketModal';
import TicketDetails from '../components/Ticket/TicketDetails';
import Button from '../components/UI/Button';
import Loader from '../components/UI/Loader';
import Toast from '../components/UI/Toast';
import api from '../services/api';

const Board = () => {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [editingTicket, setEditingTicket] = useState(null);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        fetchData();
    }, [projectId]);

    const fetchData = async () => {
        try {
            const [projectRes, ticketsRes] = await Promise.all([
                api.get(`/projects/${projectId}`),
                api.get(`/tickets?projectId=${projectId}`),
            ]);
            setProject(projectRes.data);
            setTickets(ticketsRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            setToast({ message: 'Failed to load board data', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleDragEnd = async (result) => {
        const { destination, source, draggableId } = result;

        if (!destination || destination.droppableId === source.droppableId) {
            return;
        }

        const statusMap = {
            'to-do': 'To Do',
            'in-progress': 'In Progress',
            'done': 'Done',
        };

        const newStatus = statusMap[destination.droppableId];

        try {
            await api.put(`/tickets/${draggableId}/status`, { status: newStatus });
            setToast({ message: 'Ticket status updated', type: 'success' });
            fetchData();
        } catch (error) {
            console.error('Error updating ticket status:', error);
            setToast({ message: 'Failed to update ticket status', type: 'error' });
        }
    };

    const handleTicketClick = (ticket) => {
        setSelectedTicket(ticket);
        setIsDetailsModalOpen(true);
    };

    const handleUpdateTicket = (ticket) => {
        setEditingTicket(ticket);
        setIsDetailsModalOpen(false);
        setIsCreateModalOpen(true);
    };

    const handleDeleteTicket = () => {
        setToast({ message: 'Ticket deleted successfully', type: 'success' });
        fetchData();
    };

    const handleSuccess = () => {
        setToast({
            message: `Ticket ${editingTicket ? 'updated' : 'created'} successfully`,
            type: 'success'
        });
        setEditingTicket(null);
        fetchData();
    };

    const handleCreateModalClose = () => {
        setIsCreateModalOpen(false);
        setEditingTicket(null);
    };

    const ticketsByStatus = {
        'To Do': tickets.filter((t) => t.status === 'To Do'),
        'In Progress': tickets.filter((t) => t.status === 'In Progress'),
        'Done': tickets.filter((t) => t.status === 'Done'),
    };

    if (loading) {
        return (
            <DashboardLayout>
                <Loader fullPage />
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-dark-50 mb-2">{project?.title}</h1>
                        <p className="text-dark-400">Kanban Board</p>
                    </div>
                    <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
                        <span className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Create Ticket
                        </span>
                    </Button>
                </div>

                <DragDropContext onDragEnd={handleDragEnd}>
                    <div className="flex gap-6 overflow-x-auto pb-4">
                        <Column status="To Do" tickets={ticketsByStatus['To Do']} onTicketClick={handleTicketClick} />
                        <Column status="In Progress" tickets={ticketsByStatus['In Progress']} onTicketClick={handleTicketClick} />
                        <Column status="Done" tickets={ticketsByStatus['Done']} onTicketClick={handleTicketClick} />
                    </div>
                </DragDropContext>
            </div>

            <TicketModal
                isOpen={isCreateModalOpen}
                onClose={handleCreateModalClose}
                onSuccess={handleSuccess}
                projectId={projectId}
                ticket={editingTicket}
                users={project?.teamMembers || []}
            />

            <TicketDetails
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                ticket={selectedTicket}
                onUpdate={handleUpdateTicket}
                onDelete={handleDeleteTicket}
            />
        </DashboardLayout>
    );
};

export default Board;
