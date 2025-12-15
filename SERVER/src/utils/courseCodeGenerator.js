const crypto = require('crypto');

function generateCourseCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        if (i === 4) code += '-';
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

function generateUniqueAccessCode(courseTitle) {
    const titlePrefix = courseTitle ? courseTitle.replace(/[^a-zA-Z0-9]/g, '').substring(0, 3).toUpperCase() : "CRS";
    const randomSuffix = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `${titlePrefix}-${randomSuffix}`;
}

module.exports = {
    generateCourseCode,
    generateUniqueAccessCode
};
