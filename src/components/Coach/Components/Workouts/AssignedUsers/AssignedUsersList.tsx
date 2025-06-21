import React, { useCallback, useState } from 'react';
import { UserProfile } from '../../../../../store/userStore';
import './AssignedUsersList.style.scss';

interface Props {
  assignedUsers: UserProfile[];
  onRemove: (userId: number) => void;
}

const AssignedUsersList: React.FC<Props> = ({ assignedUsers, onRemove }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggleOpen = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    const handleRemove = (userId: number) => () => {
        onRemove(userId);
    };

    if (!assignedUsers.length) {return null;}

    return (
        <div className={`assigned-users-list ${isOpen ? 'open' : 'closed'}`}>
            <h4
                className={isOpen ? 'open' : ''}
                onClick={handleToggleOpen}
                title="Кликните, чтобы открыть/закрыть список"
            >
                {`Назначено ${assignedUsers.length > 0 ? ` (${assignedUsers.length})` : ''}`}
            </h4>
            <ul>
                {assignedUsers.map(user => (
                    <li key={user.id} className="assigned-user-item">
                        <span>{user.name || user.email || `Пользователь #${user.id}`}</span>
                        <button onClick={handleRemove(user.id)} title="Удалить назначение">
              ×
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AssignedUsersList;
