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
