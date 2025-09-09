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