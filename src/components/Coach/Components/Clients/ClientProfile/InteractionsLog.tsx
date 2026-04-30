import React from 'react';

export interface InteractionItem {
  date: string;
  text: string;
}

interface InteractionsLogProps {
  interactions: InteractionItem[];
  onAddNote?: () => void;
}

const InteractionsLog: React.FC<InteractionsLogProps> = ({ interactions, onAddNote }) => (
    <div className="interactions-log">
        <h3>Последние взаимодействия</h3>
        <ul>
            {interactions.map((i, idx) => (
                <li key={idx}>
                    <span className="interactions-log__date">{i.date}</span> — <span className="interactions-log__text">{i.text}</span>
                </li>
            ))}
        </ul>
        <button className="interactions-log__add-note" onClick={onAddNote}>Добавить заметку</button>
    </div>
);

export default InteractionsLog;
