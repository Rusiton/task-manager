export const generateRandomString = (length = 16) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }

    return result;
}

export const generateRandomColor = () => {
    const randomInt = () => Math.floor(Math.random() * 256) // Random between 0-255

    let r = randomInt()
    let g = randomInt()
    let b = randomInt()
    
    return `rgb(${r},${g},${b})`;

}

export const getCurrentDateTimeFormatted = (date = null) => {
    let now

    if (date) {
        now = new Date(date)
    } else {
        now = new Date();
    }

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export const addDays = (date, days) => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + days);
    return newDate;
}