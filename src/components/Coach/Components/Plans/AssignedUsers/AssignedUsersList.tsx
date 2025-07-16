// AssignedUsersList.tsx
import React, { useCallback, useState } from 'react';
import { UserProfile } from '../../../../../store/userStore';
import './AssignedUsersList.style.scss';
import AssignedUserCard from './AssignedUserCard';

interface Props {
  assignedUsers: UserProfile[];
  onRemove: (userId: number) => void;
  open?: boolean;
  planId?: number;
}

const AssignedUsersList: React.FC<Props> = ({ assignedUsers, onRemove, open, planId }) => {
    const [isOpen, setIsOpen] = useState(open || false);

    const handleToggleOpen = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    if (!assignedUsers.length) {return null;}

    return (
        <div className={`assigned-users-list ${isOpen ? 'open' : 'closed'}`}>
            <h4 className={isOpen ? 'open' : ''} onClick={handleToggleOpen} title="Кликните, чтобы открыть/закрыть список">
                {`Назначено ${assignedUsers.length > 0 ? ` (${assignedUsers.length})` : ''}`}
            </h4>
            {isOpen && (
                <ul>
                    {assignedUsers.map(user => (
                        <AssignedUserCard key={user.id} user={user} onRemove={onRemove} planId={planId}/>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AssignedUsersList;
