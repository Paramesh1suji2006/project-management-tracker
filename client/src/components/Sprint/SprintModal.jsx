import { useState } from 'react';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import DatePicker from 'react-datepicker';
import { sprintAPI } from '../../services/api';
import 'react-datepicker/dist/react-datepicker.css';

const SprintModal = ({ isOpen, onClose, onSuccess, projectId, sprint = null }) => {
    const [formData, setFormData] = useState({
        name: sprint?.name || '',
        goal: sprint?.goal || '',
        startDate: sprint?.startDate ? new Date(sprint.startDate) : null,
        endDate: sprint?.endDate ? new Date(sprint.endDate) : null,
    });
    const [loading, setLoading] = useState(false);

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
                startDate: formData.startDate?.toISOString(),
                endDate: formData.endDate?.toISOString(),
            };

            if (sprint) {
                await sprintAPI.update(sprint._id, payload);
            } else {
                await sprintAPI.create(payload);
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error saving sprint:', error);
            alert(error.response?.data?.message || 'Failed to save sprint');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={sprint ? 'Edit Sprint' : 'Create New Sprint'}
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-dark-300 mb-2 font-medium">Sprint Name *</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="input"
                        placeholder="E.g., Sprint 1, Q1 2024"
                        required
                    />
                </div>

                <div>
                    <label className="block text-dark-300 mb-2 font-medium">Sprint Goal</label>
                    <textarea
                        name="goal"
                        value={formData.goal}
                        onChange={handleChange}
                        className="input"
                        rows="3"
                        placeholder="What do you want to accomplish in this sprint?"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-dark-300 mb-2 font-medium">Start Date *</label>
                        <DatePicker
                            selected={formData.startDate}
                            onChange={(date) => setFormData({ ...formData, startDate: date })}
                            className="input w-full"
                            dateFormat="MMM dd, yyyy"
                            placeholderText="Select start date"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-dark-300 mb-2 font-medium">End Date *</label>
                        <DatePicker
                            selected={formData.endDate}
                            onChange={(date) => setFormData({ ...formData, endDate: date })}
                            className="input w-full"
                            dateFormat="MMM dd, yyyy"
                            placeholderText="Select end date"
                            minDate={formData.startDate || new Date()}
                            required
                        />
                    </div>
                </div>

                <div className="flex gap-4 justify-end pt-4 border-t border-gray-700">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" loading={loading}>
                        {sprint ? 'Update' : 'Create'} Sprint
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default SprintModal;
