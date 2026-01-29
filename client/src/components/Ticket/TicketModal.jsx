import { useState, useEffect } from 'react';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import api from '../../services/api';

const TicketModal = ({ isOpen, onClose, onSuccess, projectId, ticket = null, users = [] }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'Medium',
        assignee: '',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (ticket) {
            setFormData({
                title: ticket.title || '',
                description: ticket.description || '',
                priority: ticket.priority || 'Medium',
                assignee: ticket.assignee?._id || '',
            });
        } else {
            setFormData({
                title: '',
                description: '',
                priority: 'Medium',
                assignee: '',
            });
        }
    }, [ticket]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                projectId,
                assignee: formData.assignee || undefined,
            };

            if (ticket) {
                await api.put(`/tickets/${ticket._id}`, payload);
            } else {
                await api.post('/tickets', payload);
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error saving ticket:', error);
            alert(error.response?.data?.message || 'Failed to save ticket');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={ticket ? 'Edit Ticket' : 'Create New Ticket'}>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-dark-300 mb-2 font-medium">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="input"
                        placeholder="E.g., Fix login bug"
                        required
                    />
                </div>

                <div>
                    <label className="block text-dark-300 mb-2 font-medium">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="input"
                        rows="4"
                        placeholder="Describe the issue or task..."
                    />
                </div>

                <div>
                    <label className="block text-dark-300 mb-2 font-medium">Priority</label>
                    <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="input"
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>

                <div>
                    <label className="block text-dark-300 mb-2 font-medium">Assignee (Optional)</label>
                    <select
                        name="assignee"
                        value={formData.assignee}
                        onChange={handleChange}
                        className="input"
                    >
                        <option value="">Unassigned</option>
                        {users.map((user) => (
                            <option key={user._id} value={user._id}>
                                {user.name} ({user.role})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex gap-4 justify-end">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" loading={loading}>
                        {ticket ? 'Update' : 'Create'} Ticket
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default TicketModal;
