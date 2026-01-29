import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../UI/Button';

const ProjectCard = ({ project, onEdit, onDelete }) => {
    const { user } = useAuth();
    const canEdit = ['Admin', 'Manager'].includes(user?.role);
    const canDelete = user?.role === 'Admin';

    return (
        <div className="card hover:scale-105 transition-transform">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-dark-50 mb-2">{project.title}</h3>
                    <p className="text-dark-400 text-sm mb-4">
                        {project.description || 'No description provided'}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2 mb-4 flex-wrap">
                {project.teamMembers?.slice(0, 5).map((member, index) => (
                    <div
                        key={member._id}
                        className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        title={member.name}
                    >
                        {member.name?.charAt(0).toUpperCase()}
                    </div>
                ))}
                {project.teamMembers?.length > 5 && (
                    <div className="w-8 h-8 bg-dark-700 rounded-full flex items-center justify-center text-dark-300 text-xs">
                        +{project.teamMembers.length - 5}
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-dark-700">
                <Link to={`/board/${project._id}`} className="btn-primary flex-1 text-center">
                    View Board
                </Link>
                {canEdit && (
                    <button
                        onClick={() => onEdit(project)}
                        className="p-2 text-primary-400 hover:bg-dark-700 rounded transition-all"
                        title="Edit Project"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                )}
                {canDelete && (
                    <button
                        onClick={() => onDelete(project)}
                        className="p-2 text-red-400 hover:bg-dark-700 rounded transition-all"
                        title="Delete Project"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
};

export default ProjectCard;
