import { useState, useEffect } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import ProjectCard from '../components/Project/ProjectCard';
import ProjectModal from '../components/Project/ProjectModal';
import Button from '../components/UI/Button';
import Loader from '../components/UI/Loader';
import Toast from '../components/UI/Toast';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [toast, setToast] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const { data } = await api.get('/projects');
            setProjects(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching projects:', error);
            setToast({ message: 'Failed to fetch projects', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (project) => {
        setEditingProject(project);
        setIsModalOpen(true);
    };

    const handleDelete = async (project) => {
        if (!window.confirm(`Are you sure you want to delete "${project.title}"?`)) {
            return;
        }

        try {
            await api.delete(`/projects/${project._id}`);
            setToast({ message: 'Project deleted successfully', type: 'success' });
            fetchProjects();
        } catch (error) {
            setToast({
                message: error.response?.data?.message || 'Failed to delete project',
                type: 'error'
            });
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setEditingProject(null);
    };

    const handleSuccess = () => {
        setToast({
            message: `Project ${editingProject ? 'updated' : 'created'} successfully`,
            type: 'success'
        });
        fetchProjects();
    };

    const canCreateProject = ['Admin', 'Manager'].includes(user?.role);

    if (loading) {
        return (
            <DashboardLayout>
                <Loader fullPage />
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-dark-50 mb-2">Projects</h1>
                        <p className="text-dark-400">Manage your team projects</p>
                    </div>
                    {canCreateProject && (
                        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                            <span className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Create Project
                            </span>
                        </Button>
                    )}
                </div>

                {projects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <ProjectCard
                                key={project._id}
                                project={project}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="card text-center py-12">
                        <div className="w-20 h-20 bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-dark-50 mb-2">No Projects Yet</h3>
                        <p className="text-dark-400 mb-6">
                            {canCreateProject
                                ? 'Create your first project to get started!'
                                : 'No projects available. Contact your admin to create projects.'}
                        </p>
                        {canCreateProject && (
                            <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                                Create Your First Project
                            </Button>
                        )}
                    </div>
                )}
            </div>

            <ProjectModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onSuccess={handleSuccess}
                project={editingProject}
            />
        </DashboardLayout>
    );
};

export default Projects;
