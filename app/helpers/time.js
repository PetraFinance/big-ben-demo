import moment from 'moment';

export const getWeekStartFromDate = (date) => {
  const dow = date.day();
  const startDate = date.clone().subtract(dow, 'days');
  return startDate;
};

export const getWeekEndFromDate = (date) => {
  let dow = date.day();
  // 6 because a week is 0-indexed
  dow = 6 - dow;
  const endDate = date.clone().add(dow, 'days');
  return endDate;
};

export const isDateBetween = (start, end, date) => {
  return date.isBetween(start, end, 'month', '[]') &&
  date.isBetween(start, end, 'day', '[]') &&
  date.isBetween(start, end, 'year', '[]');
};

export const isNotSameDay = (a, b) => {
  return !a.isSame(b, 'day') || !a.isSame(b, 'month') || !a.isSame(b, 'year');
}

export const isToday = (a) => {
  const today = moment();
  return a.isSame(today, 'day') && a.isSame(today, 'month') && a.isSame(today, 'year');
}

export const genTimesList = () => {
  const list = [];
  for (let i = 7; i <= 17; i += 0.5) {
    const time = computeTimeFromValue(i);
    const nextValue = i + 0.5;
    const nextTime = computeTimeFromValue(nextValue);
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

export const computeTimeFromValue = (timeValue) => {
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
