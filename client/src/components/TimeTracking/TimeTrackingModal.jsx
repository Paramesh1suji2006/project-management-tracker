import { useState } from 'react';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import DatePicker from 'react-datepicker';
import { timeLogAPI } from '../../services/api';

const TimeTrackingModal = ({ isOpen, onClose, ticketId, onSuccess }) => {
    const [formData, setFormData] = useState({
        hoursLogged: '',
        date: new Date(),
        description: '',
        activityType: 'Development',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await timeLogAPI.logTime({
                ticketId,
                hoursLogged: Number(formData.hoursLogged),
                date: formData.date.toISOString(),
                description: formData.description,
                activityType: formData.activityType,
            });

            if (onSuccess) onSuccess();
            onClose();
            setFormData({
                hoursLogged: '',
                date: new Date(),
                description: '',
                activityType: 'Development',
            });
        } catch (error) {
            console.error('Error logging time:', error);
            alert(error.response?.data?.message || 'Failed to log time');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Log Time">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-dark-300 mb-2 font-medium">Hours Worked *</label>
                    <input
                        type="number"
                        value={formData.hoursLogged}
                        onChange={(e) => setFormData({ ...formData, hoursLogged: e.target.value })}
                        className="input"
                        placeholder="E.g., 2.5"
                        step="0.25"
                        min="0.25"
                        max="24"
                        required
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter hours in decimal format (e.g., 2.5 for 2h 30m)</p>
                </div>

                <div>
                    <label className="block text-dark-300 mb-2 font-medium">Date *</label>
                    <DatePicker
                        selected={formData.date}
                        onChange={(date) => setFormData({ ...formData, date })}
                        className="input w-full"
                        dateFormat="MMM dd, yyyy"
                        maxDate={new Date()}
                        required
                    />
                </div>

                <div>
                    <label className="block text-dark-300 mb-2 font-medium">Activity Type *</label>
                    <select
                        value={formData.activityType}
                        onChange={(e) => setFormData({ ...formData, activityType: e.target.value })}
                        className="input"
                        required
                    >
                        <option value="Development">💻 Development</option>
                        <option value="Testing">🧪 Testing</option>
                        <option value="Bug Fix">🐛 Bug Fix</option>
                        <option value="Code Review">👀 Code Review</option>
                        <option value="Documentation">📝 Documentation</option>
                        <option value="Meeting">👥 Meeting</option>
                        <option value="Research">🔍 Research</option>
                        <option value="Other">📋 Other</option>
                    </select>
                </div>

                <div>
                    <label className="block text-dark-300 mb-2 font-medium">Description</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="input"
                        rows="3"
                        placeholder="What did you work on?"
                    />
                </div>

                <div className="flex gap-4 justify-end pt-4 border-t border-gray-700">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" loading={loading}>
                        Log Time
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default TimeTrackingModal;
