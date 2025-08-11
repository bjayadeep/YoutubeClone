export const generateRandomString = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export const generateRandomName = () => {
    const names = ["Alice", "Bob", "Charlie", "David", "Eve", "Frank", "Grace", "Heidi", "Ivan", "Judy"];
    return names[Math.floor(Math.random() * names.length)];
}

export const generateRandomMessage = () => {
    const messages = [
        "Great video!", "Awesome content!", "Learning a lot!", "Subscribed!",
        "Keep up the good work!", "Interesting points!", "Mind blown!",
        "Hello everyone!", "What's up?", "Nice one!"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
}
