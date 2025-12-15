export const generateCourseCode = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        if (i === 4) code += '-';
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

export const generateUniqueAccessCode = (courseTitle: string): string => {
    const titlePrefix = courseTitle.replace(/[^a-zA-Z0-9]/g, '').substring(0, 3).toUpperCase();
    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${titlePrefix}-${randomSuffix}`;
};
