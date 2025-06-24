// utils/formatters.js

export const maskSensitiveData = (value = '') => {
  if (!value || typeof value !== 'string' || value.length < 4) return '****';
  return `${value.slice(0, 2)}****${value.slice(-2)}`;
};
