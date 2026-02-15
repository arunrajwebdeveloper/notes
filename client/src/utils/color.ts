export function getContrastColor(hexColor: string): string {
  // Remove "#" if present
  const hex = hexColor.replace("#", "");

  // Parse R, G, B values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calculate relative luminance (per W3C formula)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // Return #101828 for light colors, white for dark ones
  return brightness > 128 ? "#101828" : "white";
}
