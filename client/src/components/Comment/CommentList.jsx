import Loader from '../UI/Loader';

const CommentList = ({ comments, loading }) => {
    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <Loader size="small" />
            </div>
        );
    }

    if (comments.length === 0) {
        return (
            <p className="text-dark-400 text-center py-8">No comments yet. Be the first to comment!</p>
        );
    }

    return (
        <div className="space-y-4 mt-6">
            {comments.map((comment) => (
                <div key={comment._id} className="bg-dark-700 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                            {comment.userId?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-dark-50 font-medium">{comment.userId?.name}</span>
                                <span className="text-dark-400 text-xs">
                                    {new Date(comment.createdAt).toLocaleString()}
                                </span>
                            </div>
                            <p className="text-dark-300">{comment.text}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CommentList;
