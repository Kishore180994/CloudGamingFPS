/**
 * Author: Chandra Kishore Danduri
 *
 * Converts a camelCase string into a normal string with spaces between words.
 *
 * @param {string} camelCaseString - The camelCase string to be converted.
 * @returns {string} normalString - The converted string.
 *
 * This function uses a regular expression to identify words in the camelCase string,
 * considering uppercase letters as the start of a new word. After splitting the string
 * into words, it capitalizes the first and last word and joins all the words into a single
 * string with spaces between them. If the string doesn't match the camelCase pattern,
 * it is returned as it is.
 */
export function convertCamelCaseToNormalString(
  camelCaseString: string
): string {
  // Use a regular expression to split the string into words
  const words = camelCaseString.match(
    /^[a-z]+|[A-Z][a-z]+|[A-Z]+(?=[A-Z][a-z]|\b)/g
  );

  let normalString = camelCaseString;
  if (words) {
    const lastWordIndex = words.length - 1;
    const lastWord = words[lastWordIndex];
    words[lastWordIndex] =
      lastWord.slice(0, 1).toUpperCase() + lastWord.slice(1).toLowerCase();
    const firstWord = words[0];
    words[0] =
      firstWord.slice(0, 1).toUpperCase() + firstWord.slice(1).toLowerCase();
    normalString = words.join(" ");
  }

  return normalString;
}
