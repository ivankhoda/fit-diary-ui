// Components/InfoTabs/InfoTabs.tsx
import React, { useCallback, useState } from 'react';
import './InfoTabs.style.scss';

export interface TabOption {
  text: string;
  linkTo?: string;
  subOptions?: TabOption[];
}

interface InfoTabsProps {
  options: TabOption[];
  descriptions: Record<string, string>;
}

const InfoTabs: React.FC<InfoTabsProps> = ({ options, descriptions }) => {
    const [selectedTab, setSelectedTab] = useState<string | null>(null);
    console.log(options, descriptions);
    const handleTabClick = useCallback((text: string) => {
        setSelectedTab(text);
    },[]);

    const tabClickHandlers = React.useRef<Record<string, () => void>>({});

    const getTabClickHandler = (text: string) => {
        if (!tabClickHandlers.current[text]) {
            tabClickHandlers.current[text] = () => handleTabClick(text);
        }
        return tabClickHandlers.current[text];
    };

    const renderTabs = (opts: TabOption[], level = 0) => opts.map(({ text, subOptions }) => (
        <div key={text} className={`info-tab level-${level}`}>
            <button
                className={`info-tab__button ${selectedTab === text ? 'active' : ''}`}
                onClick={getTabClickHandler(text)}
            >
                {text}
            </button>
            {subOptions && <div className="info-tab__sub">{renderTabs(subOptions, level + 1)}</div>}
        </div>
    ));

    return (
        <div className="info-tabs">
            <div className="info-tabs__sidebar">
                {renderTabs(options)}
            </div>
            <div className="info-tabs__content">
                {selectedTab && descriptions[selectedTab]
                    ? <p>{descriptions[selectedTab]}</p>
                    : <p>Выберите раздел, чтобы увидеть описание</p>
                }
            </div>
        </div>
    );
};

export default InfoTabs;
