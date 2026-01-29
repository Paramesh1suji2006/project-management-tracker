import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { attachmentAPI } from '../../services/api';

const FileUpload = ({ ticketId, onUploadSuccess }) => {
    const [uploading, setUploading] = useState(false);
    const [attachments, setAttachments] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchAttachments = async () => {
        if (!ticketId) return;
        setLoading(true);
        try {
            const response = await attachmentAPI.getAll(ticketId);
            setAttachments(response.data || []);
        } catch (error) {
            console.error('Error fetching attachments:', error);
        } finally {
            setLoading(false);
        }
    };

    useState(() => {
        fetchAttachments();
    }, [ticketId]);

    const onDrop = useCallback(async (acceptedFiles) => {
        setUploading(true);

        try {
            for (const file of acceptedFiles) {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('ticketId', ticketId);

                await attachmentAPI.upload(formData);
            }

            await fetchAttachments();
            if (onUploadSuccess) onUploadSuccess();
        } catch (error) {
            console.error('Error uploading files:', error);
            alert('Failed to upload files');
        } finally {
            setUploading(false);
        }
    }, [ticketId]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'text/plain': ['.txt'],
            'application/zip': ['.zip'],
            'application/x-rar-compressed': ['.rar'],
        },
        maxSize: 10 * 1024 * 1024, // 10MB
    });

    const handleDownload = async (attachment) => {
        try {
            const response = await attachmentAPI.download(attachment._id);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', attachment.originalName);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading file:', error);
            alert('Failed to download file');
        }
    };

    const handleDelete = async (attachmentId) => {
        if (!confirm('Are you sure you want to delete this attachment?')) return;

        try {
            await attachmentAPI.delete(attachmentId);
            fetchAttachments();
        } catch (error) {
            console.error('Error deleting attachment:', error);
            alert('Failed to delete attachment');
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const getFileIcon = (mimetype) => {
        if (mimetype.startsWith('image/')) return '🖼️';
        if (mimetype === 'application/pdf') return '📄';
        if (mimetype.includes('word')) return '📝';
        if (mimetype.includes('zip') || mimetype.includes('rar')) return '🗜️';
        return '📎';
    };

    return (
        <div className="space-y-4">
            {/* Dropzone */}
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${isDragActive
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-700 hover:border-gray-600 bg-dark-700/50'
                    } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
            >
                <input {...getInputProps()} />
                <div className="text-6xl mb-4">📎</div>
                {uploading ? (
                    <p className="text-blue-400 font-medium">Uploading files...</p>
                ) : isDragActive ? (
                    <p className="text-blue-400 font-medium">Drop the files here...</p>
                ) : (
                    <>
                        <p className="text-dark-200 font-medium mb-2">
                            Drag & drop files here, or click to select
                        </p>
                        <p className="text-sm text-gray-500">
                            Supports images, PDFs, documents, and archives (Max 10MB)
                        </p>
                    </>
                )}
            </div>

            {/* Attachments List */}
            {loading ? (
                <div className="text-center py-4 text-gray-500">Loading attachments...</div>
            ) : attachments.length > 0 ? (
                <div className="space-y-2">
                    <h4 className="text-sm font-medium text-dark-300 mb-3">
                        Attachments ({attachments.length})
                    </h4>
                    {attachments.map((attachment) => (
                        <div
                            key={attachment._id}
                            className="flex items-center justify-between p-3 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors"
                        >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <span className="text-2xl">{getFileIcon(attachment.mimetype)}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-dark-100 font-medium truncate">
                                        {attachment.originalName}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {formatFileSize(attachment.size)} • Uploaded by{' '}
                                        {attachment.uploadedBy?.username}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleDownload(attachment)}
                                    className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                                    title="Download"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => handleDelete(attachment._id)}
                                    className="p-2 text-red-400 hover:text-red-300 transition-colors"
                                    title="Delete"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-4 text-gray-500 text-sm">
                    No attachments yet
                </div>
            )}
        </div>
    );
};

export default FileUpload;
