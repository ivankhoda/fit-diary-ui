import { CoachApplicationFilter } from '../../../store/coachApplicationsStore';

export const ITEMS_PER_PAGE = 20;

export const coachApplicationStatusOptions: CoachApplicationFilter[] = [
    'all',
    'approved',
    'pending',
    'rejected',
];
