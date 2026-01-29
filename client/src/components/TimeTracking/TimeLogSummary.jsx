import { useState, useEffect } from 'react';
import { timeLogAPI } from '../../services/api';

const TimeLogSummary = ({ ticketId }) => {
    const [timeLogs, setTimeLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalHours, setTotalHours] = useState(0);

    useEffect(() => {
        if (ticketId) {
            fetchTimeLogs();
        }
    }, [ticketId]);

    const fetchTimeLogs = async () => {
        setLoading(true);
        try {
            const response = await timeLogAPI.getLogs({ ticketId });
            const logs = response.data || [];
            setTimeLogs(logs);
            setTotalHours(logs.reduce((sum, log) => sum + (log.hoursLogged || 0), 0));
        } catch (error) {
            console.error('Error fetching time logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getActivityIcon = (type) => {
        const icons = {
            Development: '💻',
            Testing: '🧪',
            'Bug Fix': '🐛',
            'Code Review': '👀',
            Documentation: '📝',
            Meeting: '👥',
            Research: '🔍',
        };
        return icons[type] || '📋';
    };

    if (loading) {
        return <div className="text-center py-4 text-gray-500">Loading time logs...</div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-dark-50">Time Tracking</h4>
                <div className="px-4 py-2 bg-blue-600 rounded-lg">
                    <span className="text-sm text-white font-medium">
                        Total: {totalHours.toFixed(2)}h
                    </span>
                </div>
            </div>

            {timeLogs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <p>No time logged yet</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {timeLogs.map((log) => (
                        <div
                            key={log._id}
                            className="flex items-start gap-3 p-3 bg-dark-700 rounded-lg"
                        >
                            <span className="text-2xl">{getActivityIcon(log.activityType)}</span>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-400">{log.activityType}</span>
                                    <span className="text-sm font-medium text-blue-400">
                                        {log.hoursLogged}h
                                    </span>
                                </div>
                                {log.description && (
                                    <p className="text-sm text-dark-200 mt-1">{log.description}</p>
                                )}
                                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                    <span>{log.user?.username || 'Unknown'}</span>
                                    <span>•</span>
                                    <span>{formatDate(log.date)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TimeLogSummary;
