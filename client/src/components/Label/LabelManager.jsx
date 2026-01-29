import { useState, useEffect } from 'react';
import { labelAPI } from '../../services/api';
import Button from '../UI/Button';
import Modal from '../UI/Modal';

const LabelManager = ({ projectId }) => {
    const [labels, setLabels] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLabel, setEditingLabel] = useState(null);
    const [formData, setFormData] = useState({ name: '', color: '#3b82f6', description: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (projectId) {
            fetchLabels();
        }
    }, [projectId]);

    const fetchLabels = async () => {
        try {
            const response = await labelAPI.getAll(projectId);
            setLabels(response.data || []);
        } catch (error) {
            console.error('Error fetching labels:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (editingLabel) {
                await labelAPI.update(editingLabel._id, formData);
            } else {
                await labelAPI.create({ ...formData, projectId });
            }
            fetchLabels();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving label:', error);
            alert(error.response?.data?.message || 'Failed to save label');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (labelId) => {
        if (!confirm('Are you sure you want to delete this label? It will be removed from all tickets.')) return;

        try {
            await labelAPI.delete(labelId);
            fetchLabels();
        } catch (error) {
            console.error('Error deleting label:', error);
            alert('Failed to delete label');
        }
    };

    const handleEdit = (label) => {
        setEditingLabel(label);
        setFormData({
            name: label.name,
            color: label.color,
            description: label.description || '',
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingLabel(null);
        setFormData({ name: '', color: '#3b82f6', description: '' });
    };

    const colorPresets = [
        '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
        '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16'
    ];

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-dark-50">Project Labels</h3>
                <Button onClick={() => setIsModalOpen(true)}>
                    + New Label
                </Button>
            </div>

            <div className="grid gap-3">
                {labels.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <p>No labels yet. Create your first label to organize tickets!</p>
                    </div>
                ) : (
                    labels.map((label) => (
                        <div
                            key={label._id}
                            className="flex items-center justify-between p-4 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <span
                                    className="px-4 py-2 rounded-full text-white font-medium"
                                    style={{ backgroundColor: label.color }}
                                >
                                    {label.name}
                                </span>
                                {label.description && (
                                    <span className="text-sm text-gray-400">{label.description}</span>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(label)}
                                    className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                                    title="Edit"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => handleDelete(label._id)}
                                    className="p-2 text-red-400 hover:text-red-300 transition-colors"
                                    title="Delete"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingLabel ? 'Edit Label' : 'Create Label'}
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-dark-300 mb-2 font-medium">Label Name *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="input"
                            placeholder="E.g., Bug, Feature, Enhancement"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-dark-300 mb-2 font-medium">Description</label>
                        <input
                            type="text"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="input"
                            placeholder="Optional description"
                        />
                    </div>

                    <div>
                        <label className="block text-dark-300 mb-3 font-medium">Color</label>
                        <div className="flex gap-3 mb-3">
                            {colorPresets.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, color })}
                                    className={`w-10 h-10 rounded-full transition-transform ${formData.color === color ? 'ring-4 ring-offset-2 ring-offset-gray-900 scale-110' : ''
                                        }`}
                                    style={{ backgroundColor: color, ringColor: color }}
                                />
                            ))}
                        </div>
                        <input
                            type="color"
                            value={formData.color}
                            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                            className="w-full h-12 rounded-lg cursor-pointer"
                        />
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-dark-600 rounded-lg">
                        <span className="text-dark-300">Preview:</span>
                        <span
                            className="px-4 py-2 rounded-full text-white font-medium"
                            style={{ backgroundColor: formData.color }}
                        >
                            {formData.name || 'Label Name'}
                        </span>
                    </div>

                    <div className="flex gap-4 justify-end pt-4 border-t border-gray-700">
                        <Button type="button" variant="secondary" onClick={handleCloseModal}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" loading={loading}>
                            {editingLabel ? 'Update' : 'Create'} Label
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default LabelManager;
