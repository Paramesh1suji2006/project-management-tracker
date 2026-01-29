import { useState, useEffect } from 'react';
import { sprintAPI } from '../../services/api';
import Button from '../UI/Button';
import SprintModal from './SprintModal';

const SprintList = ({ projectId }) => {
    const [sprints, setSprints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingSprint, setEditingSprint] = useState(null);

    useEffect(() => {
        if (projectId) {
            fetchSprints();
        }
    }, [projectId]);

    const fetchSprints = async () => {
        setLoading(true);
        try {
            const response = await sprintAPI.getAll(projectId);
            setSprints(response.data || []);
        } catch (error) {
            console.error('Error fetching sprints:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStartSprint = async (sprintId) => {
        try {
            await sprintAPI.start(sprintId);
            fetchSprints();
        } catch (error) {
            console.error('Error starting sprint:', error);
            alert('Failed to start sprint');
        }
    };

    const handleCompleteSprint = async (sprintId) => {
        if (!confirm('Are you sure you want to complete this sprint?')) return;

        try {
            await sprintAPI.complete(sprintId);
            fetchSprints();
        } catch (error) {
            console.error('Error completing sprint:', error);
            alert('Failed to complete sprint');
        }
    };

    const handleDelete = async (sprintId) => {
        if (!confirm('Are you sure you want to delete this sprint?')) return;

        try {
            await sprintAPI.delete(sprintId);
            fetchSprints();
        } catch (error) {
            console.error('Error deleting sprint:', error);
            alert('Failed to delete sprint');
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            planning: { color: 'bg-gray-600', text: 'Planning' },
            active: { color: 'bg-green-600', text: 'Active' },
            completed: { color: 'bg-blue-600', text: 'Completed' },
        };
        const badge = badges[status] || { color: 'bg-gray-600', text: status };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${badge.color}`}>
                {badge.text}
            </span>
        );
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const handleEdit = (sprint) => {
        setEditingSprint(sprint);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingSprint(null);
    };

    if (loading) {
        return <div className="text-center py-8 text-gray-500">Loading sprints...</div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-dark-50">Sprints</h2>
                <Button onClick={() => setModalOpen(true)}>
                    + Create Sprint
                </Button>
            </div>

            {sprints.length === 0 ? (
                <div className="text-center py-12 text-gray-500 bg-dark-700 rounded-lg">
                    <div className="text-6xl mb-4">🎯</div>
                    <p className="text-lg font-medium">No sprints yet</p>
                    <p className="text-sm mt-1">Create your first sprint to start planning!</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {sprints.map((sprint) => (
                        <div
                            key={sprint._id}
                            className="bg-dark-700 rounded-lg p-6 hover:bg-dark-600 transition-colors"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-semibold text-dark-50">
                                            {sprint.name}
                                        </h3>
                                        {getStatusBadge(sprint.status)}
                                    </div>

                                    {sprint.goal && (
                                        <p className="text-gray-400 mb-3">{sprint.goal}</p>
                                    )}

                                    <div className="flex items-center gap-6 text-sm text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span>{formatDate(sprint.startDate)} - {formatDate(sprint.endDate)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>{sprint.durationDays} days</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    {sprint.status === 'planning' && (
                                        <>
                                            <Button
                                                variant="primary"
                                                onClick={() => handleStartSprint(sprint._id)}
                                                className="text-sm"
                                            >
                                                Start Sprint
                                            </Button>
                                            <button
                                                onClick={() => handleEdit(sprint)}
                                                className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                                                title="Edit"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                        </>
                                    )}
                                    {sprint.status === 'active' && (
                                        <Button
                                            variant="primary"
                                            onClick={() => handleCompleteSprint(sprint._id)}
                                            className="text-sm"
                                        >
                                            Complete Sprint
                                        </Button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(sprint._id)}
                                        className="p-2 text-red-400 hover:text-red-300 transition-colors"
                                        title="Delete"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <SprintModal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                onSuccess={() => {
                    fetchSprints();
                    handleCloseModal();
                }}
                projectId={projectId}
                sprint={editingSprint}
            />
        </div>
    );
};

export default SprintList;
