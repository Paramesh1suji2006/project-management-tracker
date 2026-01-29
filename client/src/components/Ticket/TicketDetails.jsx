import { useState, useEffect } from 'react';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import CommentList from '../Comment/CommentList';
import CommentForm from '../Comment/CommentForm';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const TicketDetails = ({ isOpen, onClose, ticket, onUpdate, onDelete }) => {
    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        if (ticket && isOpen) {
            fetchComments();
        }
    }, [ticket, isOpen]);

    const fetchComments = async () => {
        if (!ticket) return;
        setLoadingComments(true);
        try {
            const { data } = await api.get(`/comments?ticketId=${ticket._id}`);
            setComments(data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setLoadingComments(false);
        }
    };

    const handleCommentAdded = () => {
        fetchComments();
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this ticket?')) {
            try {
                await api.delete(`/tickets/${ticket._id}`);
                onDelete();
                onClose();
            } catch (error) {
                alert(error.response?.data?.message || 'Failed to delete ticket');
            }
        }
    };

    const canDelete = ['Admin', 'Manager'].includes(user?.role) || ticket?.createdBy?._id === user?._id;

    const priorityColors = {
        Low: 'bg-green-600',
        Medium: 'bg-yellow-600',
        High: 'bg-red-600',
    };

    const statusColors = {
        'To Do': 'bg-blue-600',
        'In Progress': 'bg-yellow-600',
        'Done': 'bg-green-600',
    };

    if (!ticket) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Ticket Details" size="large">
            <div className="space-y-6">
                {/* Ticket Info */}
                <div>
                    <h2 className="text-2xl font-bold text-dark-50 mb-4">{ticket.title}</h2>

                    <div className="flex items-center gap-3 mb-4">
                        <span className={`px-3 py-1 rounded text-white text-sm ${priorityColors[ticket.priority]}`}>
                            {ticket.priority}
                        </span>
                        <span className={`px-3 py-1 rounded text-white text-sm ${statusColors[ticket.status]}`}>
                            {ticket.status}
                        </span>
                    </div>

                    {ticket.description && (
                        <div className="bg-dark-700 rounded-lg p-4 mb-4">
                            <p className="text-dark-300">{ticket.description}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 bg-dark-700 rounded-lg p-4">
                        <div>
                            <p className="text-dark-400 text-sm">Assignee</p>
                            <p className="text-dark-50 font-medium">
                                {ticket.assignee?.name || 'Unassigned'}
                            </p>
                        </div>
                        <div>
                            <p className="text-dark-400 text-sm">Created By</p>
                            <p className="text-dark-50 font-medium">{ticket.createdBy?.name}</p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <Button variant="primary" onClick={() => onUpdate(ticket)} className="flex-1">
                        Edit Ticket
                    </Button>
                    {canDelete && (
                        <Button variant="danger" onClick={handleDelete}>
                            Delete
                        </Button>
                    )}
                </div>

                {/* Comments Section */}
                <div className="border-t border-dark-700 pt-6">
                    <h3 className="text-xl font-bold text-dark-50 mb-4">Comments</h3>
                    <CommentForm ticketId={ticket._id} onCommentAdded={handleCommentAdded} />
                    <CommentList comments={comments} loading={loadingComments} />
                </div>
            </div>
        </Modal>
    );
};

export default TicketDetails;
