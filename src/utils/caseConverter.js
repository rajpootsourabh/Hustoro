/**
 * Converts snake_case to camelCase.
 */
export function toCamelCase(str) {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Recursively converts all object keys from snake_case to camelCase.
 */

export function convertKeysToCamel(obj) {
  if (Array.isArray(obj)) {
    return obj.map(convertKeysToCamel);
  } else if (obj !== null && typeof obj === "object") {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      const camelKey = toCamelCase(key);
      acc[camelKey] = convertKeysToCamel(value);
      return acc;
    }, {});
  }
  return obj;
}


export function toTitleCase(str) {
  return str?.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}
