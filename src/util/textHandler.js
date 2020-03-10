export const splitTextToLines = text => {
  if (''===text || null==text) return null
  const lines = text.split('\n');
    const isAllEmpty = lines.every((val) => !val);
    if (isAllEmpty) {
        // This is to avoid added an extra new line in the UI.
        if (lines.length === 2) {
            return [];
        }
        lines.pop();
        return lines;
    }
    const lastLine = lines[lines.length - 1];
    const firstLine = lines[0];
    // Remove the first and last element if they are new line character. This is
    // to avoid addition of extra new line in the UI.
    if (!lastLine) {
        lines.pop();
    }
    if (!firstLine) {
        lines.shift();
    }
    return lines;
}