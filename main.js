const {
    Select,
    Toggle,
    Form,
} = require('enquirer');
const helpers = require('./helpers');

const mainPrompt = async () => {
    const answer = await new Select({
        name: 'choice',
        message: 'What kind of day would you like to have tomorrow?',
        choices: ['Work', 'Leisure'],
    }).run();
    return answer;
};

const addItemPrompt = async (choice, remainingTime) => {
    let answer;
    if (choice === 'Work') {
        answer = await new Toggle({
            message: `Would you like to add an event to tomorrow\'s work schedule? (${remainingTime} minutes available to allocate.)`,
            enabled: 'Yes',
            disabled: 'Nope',
        }).run();
    }

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

const workSetup = async () => {
    const choiceName = 'Work';
    const calendarID = 'CALENDARIDHERE';
    const tomorrow = helpers.getTomorrowDate();
    const items = helpers.getDefaultItems('default.json', 'work', calendarID);
    const morningWorkout = await new Select({
        name: 'Workout',
        message: 'What kind of workout do you want to do tomorrow morning?',
        choices: ['Home Workout', 'Run', 'Bike'],
    }).run();

    let totalMinutes = 360;

    // Add morning workout to the routine
    items.push(helpers.constructEvent(morningWorkout, calendarID, tomorrow, '09:00', 30));

    let shouldAddItem = await addItemPrompt(choiceName, totalMinutes);
    let currentTime = helpers.getTomorrowDate();
    currentTime = helpers.addTimeToDate(currentTime, 11, 0);

    if (shouldAddItem) {
        do {
            try {
                const {
                    name,
                    time,
                // eslint-disable-next-line no-await-in-loop
                } = await addItemForm();
                if (+time <= totalMinutes) {
                    const startTime = helpers.getFormattedTime(currentTime);
                    items.push(helpers.constructEvent(name,
                        calendarID,
                        tomorrow,
                        startTime,
                        +time));
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
            items.push(helpers.constructEvent('Work',
            calendarID,
            tomorrow,
            helpers.getFormattedTime(currentTime),
            totalMinutes));
        }
    } else {
        items.push(helpers.constructEvent('Work', calendarID, tomorrow, '11:00', 360));
    }
    return items;
};

const lesiureSetup = async () => {
    console.log('Setting up lesiure function');
};

const choiceDict = {
    Work: workSetup,
    Leisure: lesiureSetup,
};

(async () => {
    const choice = await mainPrompt();
    if (Object.keys(choiceDict).includes(choice)) {
        const choiceSetup = choiceDict[choice];
        const items = await choiceSetup();
        console.log(JSON.stringify(items, 0, 3));
    }
})();

module.exports = {
    workSetup,
};
