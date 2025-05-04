export const formatAmount = (amount: number) => (amount / 100).toFixed(2);

export const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};