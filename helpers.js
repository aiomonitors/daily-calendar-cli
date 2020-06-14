const fs = require('fs');

const checkMinutesValid = async (toCheck, remainingTime) => toCheck <= remainingTime;

const formatDate = (date) => `${date.toISOString().split('.')[0]}Z`;

const getTomorrowDate = () => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(startOfToday);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
};

const addTimeToDate = (
    date,
    hours,
    minutes,
) => new Date(date.getTime() + (hours * 60 * 60000) + (minutes * 60000));

const getStartAndEnd = (date, startTime, duration) => {
    const startHours = startTime.split(':')[0];
    const startMinutes = startTime.split(':')[1];

    const start = addTimeToDate(date, +startHours, +startMinutes);
    const end = addTimeToDate(start, 0, duration);
    return {
        start,
        end,
    };
};

const constructEvent = (name, calendarId, baseDate, startTime, duration) => {
    const evTimes = getStartAndEnd(baseDate, startTime, duration);
    return {
        calendarId,
        summary: name,
        start: {
            dateTime: formatDate(evTimes.start),
        },
        end: {
            dateTime: formatDate(evTimes.end),
        },
    };
};

const getDefaultItems = (fileName, dayType, calendarId) => {
    const exists = fs.existsSync(fileName);
    if (exists) {
        const fileData = JSON.parse(fs.readFileSync(fileName, 'utf8'));
        if (Object.keys(fileData).includes(dayType)) {
            const dayTypeData = fileData[dayType];
            const events = [];
            const baseDate = getTomorrowDate();

            for (let i = 0; i < dayTypeData.length; i += 1) {
                const {
                    name,
                    start,
                    duration,
                } = dayTypeData[i];
                events.push(constructEvent(name, calendarId, baseDate, start, duration));
            }

            return events;
        }
            throw new Error('Invalid day type provided');
    }
        throw new Error('File was not found');
};

module.exports = {
    checkMinutesValid,
    getTomorrowDate,
    addTimeToDate,
    formatDate,
    getDefaultItems,
};