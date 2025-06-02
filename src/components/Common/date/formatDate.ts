
export const formatDate = (dateStr: string | Date | null): string => {
    if (!dateStr) {return '';}

    const date = new Date(dateStr);
    return date.toISOString().split('T')[0];
};
