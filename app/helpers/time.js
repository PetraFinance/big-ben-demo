import moment from 'moment';

/**
 * Checks if two dates are in the same week
 * param {momentObj} a
 * param {momentObj} b
 * return {boolean} true if happen in the same week
 */
export const sameWeek = (a, b) => {
  const start = getWeekStartDate(b);
  const end  = getWeekEndDate(b);
  return a.isBetween(start, end, 'month', '[]') &&
  a.isBetween(start, end, 'day', '[]') &&
  a.isBetween(start, end, 'year', '[]');
};

/**
 * Gets the first day of the week (Sunday) given a date
 * param {momentObj} date
 * return {momentObj} first day of the week
 */
export const getWeekStartDate = (date) => {
  const dow = date.day();
  const startDate = date.clone().subtract(dow, 'days');
  return startDate;
};

/**
 * Gets the last day of the week (Saturday) given a date
 * param {momentObj} date
 * return {momentObj} last day of the week
 */
const getWeekEndDate = (date) => {
  let dow = date.day();
  dow = 6 - dow;
  const endDate = date.clone().add(dow, 'days');
  return endDate;
};


/**
 * Checks if two events happen on the same day at the same time
 * param {eventObj} a
 * param {eventObj} b
 * return {boolean} true if same day and time, else false
 */
export const isSameDayAndTime = (a, b) => {
  const sameDay = isSameDay(a.date, b.date);
  const x1 = a.startValue;
  const x2 = a.endValue;
  const y1 = b.startValue;
  const y2 = b.endValue;
  const sameTime = (x1 <= y2 && y1 <= x2);
  return sameTime && sameDay;
}

/**
 * Checks if two dates are the same day, time is disregarded
 * param {momentObj} a
 * param {momentObj} b
 * return {boolean} true if the same day
 */
export const isSameDay = (a, b) => {
  return a.isSame(b, 'day') && a.isSame(b, 'month') && a.isSame(b, 'year');
}

/**
 * Checks if the date passed in is today
 * param {momentObj} a
 * return {boolean} true if the date is today
 */
export const isToday = (a) => {
  const today = moment();
  return isSameDay(a, today);
}

/**
 * Creates a list of different times during the day
 * return {list[string]} list of times of the day as strings
 */
export const genTimesOfDay = () => {
  const list = [];
  for (let i = 0; i <= 23; i += 0.5) {
    const time = computeTimeFromInt(i);
    const nextValue = i + 0.5;
    const nextTime = computeTimeFromInt(nextValue);
    const timeObj = {
      time,
      value: i,
      nextTime,
      nextValue,
    }
    list.push(timeObj);
  }
  return list;
};

/**
 * Parses an integer and gives the corresponding time of day
 * return {String} the time of day
 */
export const computeTimeFromInt = (timeValue) => {
  let suffix;
  if (timeValue < 12) {
    suffix = ' AM';
  } else {
    suffix = ' PM';
  }
  if (timeValue !== 12) {
    timeValue = timeValue % 12;
  }
  if (timeValue === 0) {
    timeValue = 12;
  }
  if (timeValue === 0.5) {
    timeValue = 12.5;
  }
  let timeString = timeValue.toString();
  if (timeString.includes('.5')) {
    timeString = timeString.replace('.5', ':30');
  }
  return timeString + suffix;
};
