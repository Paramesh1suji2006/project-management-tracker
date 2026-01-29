import { useState, useEffect } from 'react';
import { activityAPI } from '../../services/api';

const ActivityTimeline = ({ ticketId, projectId, limit = 20 }) => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchActivities();
    }, [ticketId, projectId]);

    const fetchActivities = async () => {
        setLoading(true);
        try {
            const params = { limit };
            if (ticketId) params.ticketId = ticketId;
            if (projectId) params.projectId = projectId;

            const response = await activityAPI.getActivities(params);
            setActivities(response.data || []);
        } catch (error) {
            console.error('Error fetching activities:', error);
        } finally {
            setLoading(false);
        }
    };

    const getActivityIcon = (action) => {
        const icons = {
            created: '✨',
            updated: '✏️',
            deleted: '🗑️',
            commented: '💬',
            assigned: '👤',
            'status-changed': '🔄',
            'priority-changed': '⚡',
        };
        return icons[action] || '📝';
    };

    const getActivityColor = (action) => {
        const colors = {
            created: 'bg-green-500',
            updated: 'bg-blue-500',
            deleted: 'bg-red-500',
            commented: 'bg-purple-500',
            assigned: 'bg-yellow-500',
            'status-changed': 'bg-cyan-500',
        };
        return colors[action] || 'bg-gray-500';
    };

    const formatTime = (date) => {
        const now = new Date();
        const activityDate = new Date(date);
        const diffMs = now - activityDate;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return activityDate.toLocaleDateString();
    };

    const renderChanges = (changes) => {
        if (!changes || typeof changes !== 'object') return null;

        return (
            <div className="mt-2 space-y-1">
                {Object.entries(changes).map(([field, change]) => (
                    <div key={field} className="text-sm text-gray-400">
                        <span className="font-medium text-gray-300 capitalize">{field}:</span>{' '}
                        {change.old && (
                            <span className="line-through text-red-400">{change.old}</span>
                        )}
                        {change.old && change.new && ' → '}
                        {change.new && (
                            <span className="text-green-400">{change.new}</span>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (activities.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-lg font-medium">No activity yet</p>
                <p className="text-sm mt-1">Changes will appear here</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-dark-50 mb-4">Activity Timeline</h3>

            <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-700"></div>

                {/* Activities */}
                <div className="space-y-6">
                    {activities.map((activity, index) => (
                        <div key={activity._id || index} className="relative flex gap-4">
                            {/* Icon */}
                            <div className={`flex-shrink-0 w-12 h-12 rounded-full ${getActivityColor(activity.action)} flex items-center justify-center text-2xl z-10`}>
                                {getActivityIcon(activity.action)}
                            </div>

                            {/* Content */}
                            <div className="flex-1 bg-dark-700 rounded-lg p-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <p className="text-dark-100 font-medium">
                                            <span className="text-blue-400">{activity.user?.username || 'Unknown'}</span>
                                            {' '}
                                            <span className="text-gray-400">{activity.action}</span>
                                            {' '}
                                            {activity.ticketId?.title && (
                                                <span className="text-dark-200">"{activity.ticketId.title}"</span>
                                            )}
                                        </p>
                                        {activity.description && (
                                            <p className="text-sm text-gray-400 mt-1">
                                                {activity.description}
                                            </p>
                                        )}
                                        {activity.changes && renderChanges(activity.changes)}
                                    </div>
                                    <span className="text-xs text-gray-500 ml-4">
                                        {formatTime(activity.createdAt)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ActivityTimeline;
