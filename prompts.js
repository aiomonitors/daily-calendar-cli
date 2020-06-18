/* eslint-disable no-await-in-loop */
const {
    Select,
    Toggle,
    Form,
} = require('enquirer');
const helpers = require('./helpers');

const addItemPrompt = async (choice, remainingTime) => {
    let answer;
    answer = await new Toggle({
        // eslint-disable-next-line no-useless-escape
        message: `Would you like to add an event to tomorrow\'s ${choice} schedule? (${remainingTime} minutes available to allocate.)`,
        enabled: 'Yes',
        disabled: 'Nope',
    }).run();

    return answer;
};

const addItemForm = async () => {
    const answers = await new Form({
        name: 'event',
        message: 'Please fill in the information for the event',
        choices: [
            { name: 'name', message: 'Name', initial: 'Work on code' },
            { name: 'time', message: 'Time (minutes)', initial: '15' },
        ],
    }).run();
    return answers;
};

const setup = async (choiceName) => {
    const calendarID = 'primary';
    let baseDate = helpers.getTomorrowDate();
    if (+new Date().getHours() <= 20) {
        baseDate = helpers.getStartOfDay();
    }
    const items = helpers.getDefaultItems('default.json', choiceName.toLowerCase(), calendarID);

    const {
        mainTaskStart,
        mainTaskName,
        mainTaskTotalMinutes,
        morningWorkoutTime,
        morningWorkoutStart,
    } = helpers.getDefaultInfo('default.json', choiceName.toLowerCase());
    let totalMinutes = mainTaskTotalMinutes;

    const morningWorkout = await new Select({
        name: 'Workout',
        message: 'What kind of workout do you want to do tomorrow morning?',
        choices: ['Home Workout', 'Run', 'Bike'],
    }).run();

    // Add morning workout to the routine
    items.push(helpers.constructEvent(morningWorkout, calendarID, baseDate, morningWorkoutStart, morningWorkoutTime));

    let shouldAddItem = await addItemPrompt(choiceName, totalMinutes);
    /* Keeps track of the time of the day we are at for work */
    let currentTime = helpers.getTomorrowDate();
    const startHours = mainTaskStart.split(':')[0];
    const startMinutes = mainTaskStart.split(':')[1];
    currentTime = helpers.addTimeToDate(currentTime, startHours, startMinutes);

    if (shouldAddItem) {
        do {
            try {
                const {
                    name,
                    time,
                } = await addItemForm();
                if (+time <= totalMinutes) {
                    const startTime = helpers.getFormattedTime(currentTime);
                    items.push(helpers.constructEvent(
                        name,
                        calendarID,
                        baseDate,
                        startTime,
                        +time,
                    ));
                    // Update current time to reflect the end time of the last event
                    currentTime = helpers.addTimeToDate(currentTime, 0, +time);
                    totalMinutes -= +time;

                    // eslint-disable-next-line no-await-in-loop
                    shouldAddItem = await addItemPrompt(choiceName, totalMinutes);
                } else break;
            } catch (err) {
                break;
            }
        }
        while (totalMinutes > 0 && shouldAddItem);

        if (totalMinutes > 0) {
            items.push(helpers.constructEvent(
                'Work',
                calendarID,
                baseDate,
                helpers.getFormattedTime(currentTime),
                totalMinutes,
            ));
        }
    } else {
        items.push(helpers.constructEvent(mainTaskName, calendarID, baseDate, mainTaskStart, totalMinutes));
    }
    return items;
};

const mainPrompt = async () => {
    const answer = await new Select({
        name: 'choice',
        message: 'What kind of day would you like to have tomorrow?',
        choices: ['Work', 'Leisure'],
    }).run();
    const items = await setup(answer);
    return items; 
}

module.exports = {
    mainPrompt,
};
