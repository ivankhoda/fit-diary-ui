
import React from 'react';
import './SmallControlPanel.style.scss';
import HomeScreen from '../HomeScreen/HomeScreen';
import BackButton from '../BackButton/BackButton';

const SmallControlPanel: React.FC = () => (
    <div className="small-control-panel">
        <HomeScreen />
        <BackButton />
    </div>
);

export default SmallControlPanel;
