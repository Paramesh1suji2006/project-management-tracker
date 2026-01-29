import { Droppable, Draggable } from 'react-beautiful-dnd';
import TicketCard from './TicketCard';

const Column = ({ status, tickets, onTicketClick }) => {
    const columnColors = {
        'To Do': 'from-blue-600 to-blue-700',
        'In Progress': 'from-yellow-600 to-yellow-700',
        'Done': 'from-green-600 to-green-700',
    };

    const columnId = status.replace(' ', '-').toLowerCase();

    return (
        <div className="flex-1 min-w-[300px]">
            <div className={`bg-gradient-to-r ${columnColors[status]} rounded-t-xl p-4`}>
                <h3 className="text-white font-bold text-lg flex items-center justify-between">
                    <span>{status}</span>
                    <span className="bg-white/20 px-2 py-1 rounded text-sm">{tickets.length}</span>
                </h3>
            </div>

            <Droppable droppableId={columnId}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`bg-dark-800 rounded-b-xl p-4 min-h-[500px] transition-colors ${snapshot.isDraggingOver ? 'bg-dark-700' : ''
                            }`}
                    >
                        {tickets.map((ticket, index) => (
                            <Draggable key={ticket._id} draggableId={ticket._id} index={index}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={{
                                            ...provided.draggableProps.style,
                                            opacity: snapshot.isDragging ? 0.8 : 1,
                                        }}
                                    >
                                        <TicketCard ticket={ticket} index={index} onClick={onTicketClick} />
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
};

export default Column;
