const TicketCard = ({ ticket, index, onClick }) => {
    const priorityColors = {
        Low: 'border-l-green-500',
        Medium: 'border-l-yellow-500',
        High: 'border-l-red-500',
    };

    return (
        <div
            onClick={() => onClick(ticket)}
            className={`bg-dark-700 rounded-lg p-4 mb-3 border-l-4 ${priorityColors[ticket.priority]} cursor-pointer hover:bg-dark-600 transition-all shadow-lg`}
        >
            <h4 className="text-dark-50 font-medium mb-2">{ticket.title}</h4>
            {ticket.description && (
                <p className="text-dark-400 text-sm mb-3 line-clamp-2">{ticket.description}</p>
            )}

            <div className="flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded ${ticket.priority === 'High' ? 'bg-red-600' :
                        ticket.priority === 'Medium' ? 'bg-yellow-600' :
                            'bg-green-600'
                    } text-white`}>
                    {ticket.priority}
                </span>

                {ticket.assignee && (
                    <div
                        className="w-6 h-6 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        title={ticket.assignee?.name}
                    >
                        {ticket.assignee?.name?.charAt(0).toUpperCase()}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TicketCard;
