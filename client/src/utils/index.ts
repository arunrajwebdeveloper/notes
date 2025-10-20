export const trimText = (str: string, length = 40, tail = "...") => {
  if (str.length > length) {
    return str.substring(0, length - tail.length) + tail;
  } else {
    return str;
  }
};
