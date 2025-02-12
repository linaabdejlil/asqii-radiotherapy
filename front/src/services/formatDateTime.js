export default function formatDateTime(date, type) {
  const currentDate = new Date();
  const inputDate = new Date(date);

  const timeOptions = {
    hour12: true,
    hour: "2-digit",
    minute: "2-digit",
  };
  const time = inputDate.toLocaleTimeString("en-US", timeOptions);

  if (
    inputDate.getFullYear() === currentDate.getFullYear() &&
    inputDate.getMonth() === currentDate.getMonth() &&
    inputDate.getDate() === currentDate.getDate()
  ) {
    return time;
  } else if (
    inputDate.getFullYear() === currentDate.getFullYear() &&
    inputDate.getMonth() === currentDate.getMonth() &&
    inputDate.getDate() >= currentDate.getDate() - currentDate.getDay()
  ) {
    const day = inputDate.toLocaleDateString("en-US", { weekday: "long" });
    return `${type ? time : ""} ${day}`;
  } else if (inputDate.getFullYear() === currentDate.getFullYear()) {
    const day = inputDate.getDate();
    const month = inputDate.toLocaleDateString("en-US", { month: "long" });
    return `${type ? time : ""} ${day} ${month}`;
  } else {
    const day = inputDate.getDate();
    const month = inputDate.toLocaleDateString("en-US", { month: "long" });
    const year = inputDate.getFullYear();
    return `${type ? time : ""} ${day} ${month} ${year}`;
  }
}
