import React from 'react';
import { t } from 'i18next';
import { PersonalBests as PersonalBestsData } from '../../../../../../store/userStore';
import { ExerciseBenchmarksCard } from './ExerciseBenchmarksCard';
import { mapPersonalBestsToDisplayItems } from './mapPersonalBestsToDisplayItems';

interface PersonalBestsProps {
    isRefreshing?: boolean;
    personalBests: PersonalBestsData;
}

export const PersonalBests: React.FC<PersonalBestsProps> = ({
    isRefreshing = false,
    personalBests,
}) => <ExerciseBenchmarksCard isRefreshing={isRefreshing} items={mapPersonalBestsToDisplayItems(personalBests, t)} />;
