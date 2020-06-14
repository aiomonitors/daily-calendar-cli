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

const getDefaultWorkItems = (calendarId) => {
    const currentTime = getTomorrowDate();
    const items = [];
    let evStart = addTimeToDate(currentTime, 9, 30);
    let evEnd = addTimeToDate(evStart, 0, 15);
    items.push({
        calendarId,
        summary: 'Be back home',
        start: {
            dateTime: formatDate(evStart),
        },
        end: {
            dateTime: formatDate(evEnd),
        },
    });
    evStart = addTimeToDate(currentTime, 9, 45);
    evEnd = addTimeToDate(evStart, 0, 45);
    items.push({
        calendarId,
        summary: 'Sort through notifications',
        start: {
            dateTime: formatDate(evStart),
        },
        end: {
            dateTime: formatDate(evEnd),
        },
    });
    evStart = addTimeToDate(currentTime, 10, 30);
    evEnd = addTimeToDate(evStart, 0, 30);
    items.push({
        calendarId,
        summary: 'Eat breakfast [Log out of Snapchat]',
        start: {
            dateTime: formatDate(evStart),
        },
        end: {
            dateTime: formatDate(evEnd),
        },
    });
    return items;
};

module.exports = {
    checkMinutesValid,
    getTomorrowDate,
    addTimeToDate,
    formatDate,
    getDefaultWorkItems,
};
