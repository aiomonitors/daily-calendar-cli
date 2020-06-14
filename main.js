const { 
    Select,
    Toggle
} = require('enquirer');
const helpers = require('./helpers');

const mainPrompt = async () => {
    let answer = await new Select({
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
}

const workSetup = async () => {
    const choiceName = 'Work';
    let totalMinutes = 3600;
    let shouldAddItem = await addItemPrompt(choiceName, totalMinutes);
    do {
        console.log('Adding item');
        shouldAddItem = await addItemPrompt(choiceName, totalMinutes);
    }
    while (shouldAddItem);
};

const lesiureSetup = async () => {
    console.log('Setting up lesiure function');
};

const choiceDict = {
    'Work' : workSetup,
    'Leisure' : lesiureSetup
};

(async () => {
    let choice = await mainPrompt();
    if (Object.keys(choiceDict).includes(choice)) {
        let choiceSetup = choiceDict[choice];
        choiceSetup();
    };
})();