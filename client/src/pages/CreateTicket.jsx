import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/Layout/DashboardLayout';
import Button from '../components/UI/Button';
import Toast from '../components/UI/Toast';
import api from '../services/api';

const CreateTicket = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const [formData, setFormData] = useState({
        projectId: '',
        projectName: '',
        title: '',
        description: '',
        type: 'Task',
        priority: 'Medium',
        status: 'To Do',
        assignee: '',
        storyPoints: '',
        estimatedHours: '',
        dueDate: '',
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await api.get('/projects');
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
            setToast({ message: 'Failed to load projects', type: 'error' });
        }
    };

    const fetchProjectUsers = async (projectId) => {
        try {
            const response = await api.get(`/projects/${projectId}`);
            setUsers(response.data.teamMembers || []);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'projectName') {
            // Find the project by title
            const matchedProject = projects.find(p => p.title === value);
            if (matchedProject) {
                setFormData({
                    ...formData,
                    projectName: value,
                    projectId: matchedProject._id
                });
                fetchProjectUsers(matchedProject._id);
            } else {
                setFormData({ ...formData, projectName: value, projectId: '' });
            }
        } else {
            setFormData({ ...formData, [name]: value });

            if (name === 'projectId' && value) {
                fetchProjectUsers(value);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.projectId) {
            setToast({ message: 'Please select a valid project from the list', type: 'error' });
            return;
        }

        if (!formData.title.trim()) {
            setToast({ message: 'Please enter a ticket title', type: 'error' });
            return;
        }

        setLoading(true);

        try {
            const payload = {
                projectId: formData.projectId,
                title: formData.title,
                description: formData.description,
                type: formData.type,
                priority: formData.priority,
                status: formData.status,
                assignee: formData.assignee || undefined,
                storyPoints: formData.storyPoints ? parseInt(formData.storyPoints) : undefined,
                estimatedHours: formData.estimatedHours ? parseFloat(formData.estimatedHours) : undefined,
                dueDate: formData.dueDate || undefined,
            };

            await api.post('/tickets', payload);
            setToast({ message: 'Ticket created successfully!', type: 'success' });

            setTimeout(() => {
                navigate(`/board/${formData.projectId}`);
            }, 1000);
        } catch (error) {
            console.error('Error creating ticket:', error);
            setToast({
                message: error.response?.data?.message || 'Failed to create ticket',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-4xl font-bold text-dark-50 mb-2">Create New Ticket</h1>
                    <p className="text-dark-400">Fill in the details to create a new ticket</p>
                </div>

                <form onSubmit={handleSubmit} className="card space-y-6">
                    {/* Project Input with Autocomplete */}
                    <div>
                        <label className="block text-dark-300 mb-2 font-medium">
                            Project Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="projectName"
                            value={formData.projectName}
                            onChange={handleChange}
                            className="input"
                            placeholder="Enter or select project name"
                            list="projects-list"
                            required
                        />
                        <datalist id="projects-list">
                            {projects.map((project) => (
                                <option key={project._id} value={project.title} data-id={project._id} />
                            ))}
                        </datalist>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-dark-300 mb-2 font-medium">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="input"
                            placeholder="E.g., Fix login authentication bug"
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
                            rows="5"
                            placeholder="Provide detailed information about the ticket..."
                        />
                    </div>

                    {/* Type and Priority Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-dark-300 mb-2 font-medium">Type</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="input"
                            >
                                <option value="Task">Task</option>
                                <option value="Bug">Bug</option>
                                <option value="Story">Story</option>
                                <option value="Epic">Epic</option>
                                <option value="Subtask">Subtask</option>
                            </select>
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
                    </div>

                    {/* Status and Assignee Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                        <div>
                            <label className="block text-dark-300 mb-2 font-medium">Assignee</label>
                            <select
                                name="assignee"
                                value={formData.assignee}
                                onChange={handleChange}
                                className="input"
                                disabled={!formData.projectId}
                            >
                                <option value="">Unassigned</option>
                                {users.map((user) => (
                                    <option key={user._id} value={user._id}>
                                        {user.name} ({user.role})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Story Points and Estimated Hours Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-dark-300 mb-2 font-medium">
                                Story Points
                            </label>
                            <input
                                type="number"
                                name="storyPoints"
                                value={formData.storyPoints}
                                onChange={handleChange}
                                className="input"
                                placeholder="E.g., 5"
                                min="0"
                            />
                        </div>

                        <div>
                            <label className="block text-dark-300 mb-2 font-medium">
                                Estimated Hours
                            </label>
                            <input
                                type="number"
                                name="estimatedHours"
                                value={formData.estimatedHours}
                                onChange={handleChange}
                                className="input"
                                placeholder="E.g., 8"
                                min="0"
                                step="0.5"
                            />
                        </div>
                    </div>

                    {/* Due Date */}
                    <div>
                        <label className="block text-dark-300 mb-2 font-medium">Due Date</label>
                        <input
                            type="date"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleChange}
                            className="input"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 justify-end pt-4 border-t border-dark-700">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => navigate('/dashboard')}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            loading={loading}
                        >
                            Create Ticket
                        </Button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default CreateTicket;
