import { useState, useEffect } from 'react';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import api from '../../services/api';

const ProjectModal = ({ isOpen, onClose, onSuccess, project = null }) => {
    const [formData, setFormData] = useState({
        title: project?.title || '',
        key: project?.key || '',
        description: project?.description || '',
        status: project?.status || 'Planning',
        teamMembers: project?.teamMembers?.map(m => m._id || m) || [],
    });
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchUsers();
            // Reset form when opening
            setFormData({
                title: project?.title || '',
                key: project?.key || '',
                description: project?.description || '',
                status: project?.status || 'Planning',
                teamMembers: project?.teamMembers?.map(m => m._id || m) || [],
            });
        }
    }, [isOpen, project]);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/auth/users');
            setUsers(response.data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleTeamMembersChange = (e) => {
        const options = e.target.options;
        const selected = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selected.push(options[i].value);
            }
        }
        setFormData({ ...formData, teamMembers: selected });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (project) {
                await api.put(`/projects/${project._id}`, formData);
            } else {
                await api.post('/projects', formData);
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error saving project:', error);
            alert(error.response?.data?.message || 'Failed to save project');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={project ? 'Edit Project' : 'Create New Project'}>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-dark-300 mb-2 font-medium">
                        Project Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="input"
                        placeholder="E.g., Mobile App Redesign"
                        required
                    />
                </div>

                <div>
                    <label className="block text-dark-300 mb-2 font-medium">
                        Project Key <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="key"
                        value={formData.key}
                        onChange={handleChange}
                        className="input"
                        placeholder="E.g., MAR (2-5 characters)"
                        maxLength="5"
                        required
                    />
                    <p className="text-dark-400 text-sm mt-1">Short code for the project (e.g., ECP, MAD)</p>
                </div>

                <div>
                    <label className="block text-dark-300 mb-2 font-medium">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="input"
                        rows="4"
                        placeholder="Describe your project..."
                    />
                </div>

                <div>
                    <label className="block text-dark-300 mb-2 font-medium">Status</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="input"
                    >
                        <option value="Planning">Planning</option>
                        <option value="Active">Active</option>
                        <option value="On Hold">On Hold</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>

                <div>
                    <label className="block text-dark-300 mb-2 font-medium">
                        Team Members <span className="text-red-500">*</span>
                    </label>
                    <select
                        multiple
                        name="teamMembers"
                        value={formData.teamMembers}
                        onChange={handleTeamMembersChange}
                        className="input min-h-[120px]"
                        required
                    >
                        {users.map((user) => (
                            <option key={user._id} value={user._id}>
                                {user.name} ({user.role})
                            </option>
                        ))}
                    </select>
                    <p className="text-dark-400 text-sm mt-1">
                        Hold Ctrl (Windows) or Cmd (Mac) to select multiple members
                    </p>
                </div>

                <div className="flex gap-4 justify-end">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" loading={loading}>
                        {project ? 'Update' : 'Create'} Project
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default ProjectModal;
