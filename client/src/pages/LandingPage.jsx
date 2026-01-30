import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-dark-900 via-primary-900 to-dark-900">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-16">
                <nav className="flex justify-between items-center mb-20">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                            ProjectFlow
                        </span>
                    </div>
                    <div className="flex gap-4">
                        <Link to="/login" className="btn-secondary">
                            Login
                        </Link>
                        <Link to="/register" className="btn-primary">
                            Sign Up
                        </Link>
                    </div>
                </nav>

                <div className="text-center max-w-4xl mx-auto mb-16">
                    <h1 className="text-6xl font-bold mb-6 animate-slide-up">
                        <span className="bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-400 bg-clip-text text-transparent">
                            Manage Projects
                        </span>
                        <br />
                        <span className="text-dark-50">Like Never Before</span>
                    </h1>
                    <p className="text-xl text-dark-300 mb-8 animate-fade-in">
                        A powerful project management and bug tracking platform for modern teams.
                        Collaborate, track progress, and deliver faster.
                    </p>
                    <div className="flex gap-4 justify-center animate-slide-up">
                        <Link to="/register" className="btn-primary text-lg px-8 py-3">
                            Get Started Free
                        </Link>
                        <a href="#features" className="btn-secondary text-lg px-8 py-3">
                            Learn More
                        </a>
                    </div>
                </div>

                {/* Features Section */}
                <div id="features" className="grid md:grid-cols-3 gap-8 mt-32">
                    <div className="card hover:scale-105 transition-transform">
                        <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-dark-50 mb-3">Kanban Boards</h3>
                        <p className="text-dark-400">
                            Visualize your workflow with intuitive drag-and-drop Kanban boards.
                            Track progress effortlessly.
                        </p>
                    </div>

                    <div className="card hover:scale-105 transition-transform">
                        <div className="w-14 h-14 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-dark-50 mb-3">Team Collaboration</h3>
                        <p className="text-dark-400">
                            Work together seamlessly. Assign tasks, comment on tickets, and keep everyone aligned.
                        </p>
                    </div>

                    <div className="card hover:scale-105 transition-transform">
                        <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-dark-50 mb-3">Role-Based Access</h3>
                        <p className="text-dark-400">
                            Secure your projects with granular permissions. Admins, Managers, Developers, and Viewers.
                        </p>
                    </div>
                </div>

                {/* Additional Features */}
                <div className="grid md:grid-cols-2 gap-8 mt-12">
                    <div className="card">
                        <h3 className="text-2xl font-bold text-dark-50 mb-3">🎯 Priority Management</h3>
                        <p className="text-dark-400">
                            Set priorities (Low, Medium, High) and filter tickets to focus on what matters most.
                        </p>
                    </div>

                    <div className="card">
                        <h3 className="text-2xl font-bold text-dark-50 mb-3">🔍 Advanced Filtering</h3>
                        <p className="text-dark-400">
                            Search and filter by status, priority, assignee, or keywords to find tickets instantly.
                        </p>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center mt-32 glass rounded-2xl p-12">
                    <h2 className="text-4xl font-bold text-dark-50 mb-4">
                        Ready to Transform Your Workflow?
                    </h2>
                    <p className="text-xl text-dark-300 mb-8">
                        Join thousands of teams already using ProjectFlow to deliver better projects.
                    </p>
                    <Link to="/register" className="btn-primary text-lg px-8 py-3">
                        Get Started Now →
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
