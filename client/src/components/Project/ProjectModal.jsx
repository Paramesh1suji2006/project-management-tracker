import { useState } from 'react';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import api from '../../services/api';

const ProjectModal = ({ isOpen, onClose, onSuccess, project = null }) => {
    const [formData, setFormData] = useState({
        title: project?.title || '',
        description: project?.description || '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
                    <label className="block text-dark-300 mb-2 font-medium">Project Title</label>
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
