const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

const checkDate = (date1: Date, date2: Date) => {
  if (date1.getDate() + ' ' + (months[date1.getMonth()]) + ', ' + date1.getFullYear() === date2.getDate() + ' ' + (months[date2.getMonth()]) + ', ' + date2.getFullYear()){
    return true
  }
  return false
}

export const getDate = (unixEpochMs: number) => {
  var d = new Date();
  unixEpochMs -= d.getTimezoneOffset()*60000;
  d = new Date(unixEpochMs);
  var today = new Date();
  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var yesterday = new Date();
  yesterday.setDate(tomorrow.getDate() - 1);
  if(checkDate(d, today)){
    return "Today";
  }
  if(checkDate(d, tomorrow)){
    return "Tomorrow";
  }
  if(checkDate(d, yesterday)){
    return "Yesterday";
  }
  return ((d.getMonth() + 1) + '/' + d.getDate());
}
export const getTime = (unixEpochMs: number) => {
  var d = new Date();
  unixEpochMs -= d.getTimezoneOffset()*60000;
  d = new Date(unixEpochMs);
  return d.toLocaleTimeString(undefined, { timeStyle: "short", hour12: true }).replace("pm", "PM").replace("am", "AM")
}
let shortTimeZone: string;
export const getShortTimezone = (unixEpochMs: number) => {
  if (!shortTimeZone) {
    shortTimeZone = new Date().toLocaleTimeString('en-us', { timeZoneName: "short" }).split(' ')[2];
  }
  var d = new Date();
  return days[d.getDay()] + ' ' + shortTimeZone;
}