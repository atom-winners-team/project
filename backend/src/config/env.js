export const readRequiredString = (name) => {
    const value = process.env[name];

    if (value === undefined || value.trim().length === 0) {
        throw new Error(`${name} is required`);
    }

    return value;
};