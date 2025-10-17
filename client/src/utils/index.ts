export const trimText = (str: string, length = 40, tail = "...") => {
  if (str.length > length) {
    return str.substring(0, length - tail.length) + tail;
  } else {
    return str;
  }
};

export const dateFormatter = (date: any) => {
  return new Date(date).toLocaleString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};
