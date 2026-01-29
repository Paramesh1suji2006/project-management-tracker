import { useState, useEffect } from 'react';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import api, { labelAPI, timeLogAPI } from '../../services/api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const EnhancedTicketModal = ({ isOpen, onClose, onSuccess, projectId, ticket = null, users = [], labels = [] }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'Medium',
        assignee: '',
        type: 'Task',
        status: 'To Do',
        labels: [],
        dueDate: null,
        estimatedHours: '',
        storyPoints: 0,
        parentTicket: '',
        epicId: '',
    });
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('details');

    useEffect(() => {
        if (ticket) {
            setFormData({
                title: ticket.title || '',
                description: ticket.description || '',
                priority: ticket.priority || 'Medium',
                assignee: ticket.assignee?._id || '',
                type: ticket.type || 'Task',
                status: ticket.status || 'To Do',
                labels: ticket.labels?.map(l => l._id) || [],
                dueDate: ticket.dueDate ? new Date(ticket.dueDate) : null,
                estimatedHours: ticket.estimatedHours || '',
                storyPoints: ticket.storyPoints || 0,
                parentTicket: ticket.parentTicket?._id || '',
                epicId: ticket.epicId?._id || '',
            });
        } else {
            setFormData({
                title: '',
                description: '',
                priority: 'Medium',
                assignee: '',
                type: 'Task',
                status: 'To Do',
                labels: [],
                dueDate: null,
                estimatedHours: '',
                storyPoints: 0,
                parentTicket: '',
                epicId: '',
            });
        }
    }, [ticket]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLabelToggle = (labelId) => {
        const newLabels = formData.labels.includes(labelId)
            ? formData.labels.filter(id => id !== labelId)
            : [...formData.labels, labelId];
        setFormData({ ...formData, labels: newLabels });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                projectId,
                assignee: formData.assignee || undefined,
                dueDate: formData.dueDate || undefined,
                estimatedHours: formData.estimatedHours ? Number(formData.estimatedHours) : undefined,
                storyPoints: Number(formData.storyPoints),
                parentTicket: formData.parentTicket || undefined,
                epicId: formData.epicId || undefined,
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

    const getTypeIcon = (type) => {
        const icons = {
            Epic: '🎯',
            Story: '📖',
            Task: '✓',
            Bug: '🐛',
            Subtask: '📋',
        };
        return icons[type] || '📝';
    };

    const getTypeColor = (type) => {
        const colors = {
            Epic: 'bg-purple-600',
            Story: 'bg-green-600',
            Task: 'bg-blue-600',
            Bug: 'bg-red-600',
            Subtask: 'bg-gray-600',
        };
        return colors[type] || 'bg-gray-600';
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={ticket ? 'Edit Ticket' : 'Create New Ticket'}
            size="large"
        >
            {/* Tab Navigation */}
            <div className="flex gap-4 border-b border-gray-700 mb-6">
                <button
                    onClick={() => setActiveTab('details')}
                    className={`pb-3 px-2 font-medium transition-colors ${activeTab === 'details'
                            ? 'text-blue-400 border-b-2 border-blue-400'
                            : 'text-gray-400 hover:text-gray-300'
                        }`}
                >
                    Details
                </button>
                <button
                    onClick={() => setActiveTab('planning')}
                    className={`pb-3 px-2 font-medium transition-colors ${activeTab === 'planning'
                            ? 'text-blue-400 border-b-2 border-blue-400'
                            : 'text-gray-400 hover:text-gray-300'
                        }`}
                >
                    Planning
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {activeTab === 'details' && (
                    <>
                        {/* Ticket Type */}
                        <div>
                            <label className="block text-dark-300 mb-2 font-medium">Type</label>
                            <div className="grid grid-cols-5 gap-2">
                                {['Epic', 'Story', 'Task', 'Bug', 'Subtask'].map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type })}
                                        className={`p-3 rounded-lg border-2 transition-all ${formData.type === type
                                                ? `${getTypeColor(type)} border-transparent text-white`
                                                : 'border-gray-700 text-gray-400 hover:border-gray-600'
                                            }`}
                                    >
                                        <div className="text-2xl mb-1">{getTypeIcon(type)}</div>
                                        <div className="text-xs font-medium">{type}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block text-dark-300 mb-2 font-medium">Title *</label>
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

                        {/* Description */}
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

                        {/* Priority & Status */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-dark-300 mb-2 font-medium">Priority</label>
                                <select
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                    className="input"
                                >
                                    <option value="Low">🟢 Low</option>
                                    <option value="Medium">🟡 Medium</option>
                                    <option value="High">🔴 High</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-dark-300 mb-2 font-medium">Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="input"
                                >
                                    <option value="To Do">To Do</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Done">Done</option>
                                </select>
                            </div>
                        </div>

                        {/* Assignee */}
                        <div>
                            <label className="block text-dark-300 mb-2 font-medium">Assignee</label>
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

                        {/* Labels */}
                        <div>
                            <label className="block text-dark-300 mb-3 font-medium">Labels</label>
                            <div className="flex flex-wrap gap-2">
                                {labels.length === 0 ? (
                                    <p className="text-gray-500 text-sm">No labels available. Create labels in project settings.</p>
                                ) : (
                                    labels.map((label) => (
                                        <button
                                            key={label._id}
                                            type="button"
                                            onClick={() => handleLabelToggle(label._id)}
                                            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${formData.labels.includes(label._id)
                                                    ? 'ring-2 ring-offset-2 ring-offset-gray-900'
                                                    : 'opacity-60 hover:opacity-100'
                                                }`}
                                            style={{
                                                backgroundColor: label.color,
                                                color: '#fff',
                                                ringColor: label.color,
                                            }}
                                        >
                                            {formData.labels.includes(label._id) && '✓ '}
                                            {label.name}
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Due Date */}
                        <div>
                            <label className="block text-dark-300 mb-2 font-medium">Due Date</label>
                            <DatePicker
                                selected={formData.dueDate}
                                onChange={(date) => setFormData({ ...formData, dueDate: date })}
                                className="input w-full"
                                dateFormat="MMM dd, yyyy"
                                placeholderText="Select due date"
                                isClearable
                                minDate={new Date()}
                            />
                        </div>
                    </>
                )}

                {activeTab === 'planning' && (
                    <>
                        {/* Story Points */}
                        <div>
                            <label className="block text-dark-300 mb-2 font-medium">Story Points</label>
                            <input
                                type="number"
                                name="storyPoints"
                                value={formData.storyPoints}
                                onChange={handleChange}
                                className="input"
                                min="0"
                                step="0.5"
                                placeholder="Estimation in story points"
                            />
                            <p className="text-xs text-gray-500 mt-1">Used for sprint velocity tracking</p>
                        </div>

                        {/* Estimated Hours */}
                        <div>
                            <label className="block text-dark-300 mb-2 font-medium">Estimated Hours</label>
                            <input
                                type="number"
                                name="estimatedHours"
                                value={formData.estimatedHours}
                                onChange={handleChange}
                                className="input"
                                min="0"
                                step="0.5"
                                placeholder="Time estimate in hours"
                            />
                        </div>

                        {/* Parent Epic (for Stories/Tasks) */}
                        {formData.type !== 'Epic' && (
                            <div>
                                <label className="block text-dark-300 mb-2 font-medium">Parent Epic</label>
                                <select
                                    name="epicId"
                                    value={formData.epicId}
                                    onChange={handleChange}
                                    className="input"
                                >
                                    <option value="">None</option>
                                    {/* TODO: Load epics from project */}
                                </select>
                                <p className="text-xs text-gray-500 mt-1">Link this ticket to an Epic</p>
                            </div>
                        )}

                        {/* Parent Ticket (for Subtasks) */}
                        {formData.type === 'Subtask' && (
                            <div>
                                <label className="block text-dark-300 mb-2 font-medium">Parent Ticket *</label>
                                <select
                                    name="parentTicket"
                                    value={formData.parentTicket}
                                    onChange={handleChange}
                                    className="input"
                                    required
                                >
                                    <option value="">Select parent ticket</option>
                                    {/* TODO: Load tickets from project */}
                                </select>
                            </div>
                        )}
                    </>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 justify-end pt-4 border-t border-gray-700">
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

export default EnhancedTicketModal;
