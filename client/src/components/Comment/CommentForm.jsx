import { useState } from 'react';
import Button from '../UI/Button';
import api from '../../services/api';

const CommentForm = ({ ticketId, onCommentAdded }) => {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        setLoading(true);
        try {
            await api.post('/comments', { ticketId, text });
            setText('');
            onCommentAdded();
        } catch (error) {
            console.error('Error adding comment:', error);
            alert('Failed to add comment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6">
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="input mb-3"
                rows="3"
                placeholder="Add a comment..."
                required
            />
            <Button type="submit" variant="primary" loading={loading} disabled={!text.trim()}>
                Add Comment
            </Button>
        </form>
    );
};

export default CommentForm;
