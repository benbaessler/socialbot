export const numberToHex = (num: number): string => {
  let hexValue = num.toString(16);

  // Ensure an even number of digits
  if (hexValue.length % 2 !== 0) {
    hexValue = "0" + hexValue;
  }

  return `0x${hexValue}`;
};

export const hexToNumber = (hex: string): string =>
  parseInt(hex, 16).toString();

export const capitalize = (str: string): string =>
  str.replace(/\b\w/g, (char) => char.toUpperCase());
