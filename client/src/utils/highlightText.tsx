export const highlightText = (text: string, search: string) => {
  if (!search) {
    return text;
  }

  // Escape special characters in the search term for use in a RegExp
  const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Global, case-insensitive regex
  const regex = new RegExp(`(${escapedSearch})`, "gi");

  // Split the string by the regex match
  const parts = text.split(regex);

  // Map the parts, highlighting the matched groups (which are captured by the parentheses in the regex)
  return parts.map((part: any, index: number) => {
    // Check if the part matches the search term (case-insensitive check)
    if (part.toLowerCase() === search.toLowerCase()) {
      return (
        <span key={index} className="bg-yellow-300 px-0.5 rounded-xs">
          {part}
        </span>
      );
    }
    return part;
  });
};
