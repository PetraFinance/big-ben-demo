import React from 'react'
import moment from 'moment'

const convertToPercent = (integer) => {
  return integer.toString() + '%';
}

const convertToPx = (integer) => {
  return integer.toString() + 'px';
}

const wrapInCalc = (args) => {
  return 'calc(' + args.join(' + ') + ')';
}

export const getEventPosition = (eventObj) => {
  let style;
  let offset;
  let multiplier;
  // Calculate the left position
  const day_column_width_percent = 13;
  const time_column_width_percent = '9% ';
  const day = eventObj.day;
  multiplier = moment.weekdays().indexOf(day);
  offset = '2px';
  if (day === "Sunday" || day === "Tuesday") {
    offset = '1px';
  }

  style = [time_column_width_percent, convertToPercent(multiplier * day_column_width_percent), offset];
  const left = wrapInCalc(style);

  // Calculate the top position
  const half_hour_height = 36;
  const calendarStartValue = 7; // currently starts at 7AM
  const startValue = eventObj.startValue;
  offset = '1px';
  multiplier = Math.abs(calendarStartValue - startValue) * 2;

  style = [convertToPx(half_hour_height * multiplier), offset];
  const top = wrapInCalc(style);

  // Calculate height
  const endValue = eventObj.endValue;
  multiplier = Math.abs(endValue - startValue) * 2;
  if (multiplier < 1) {
    multiplier = 1;
  }
  offset = '-1px';

  style = [convertToPx(half_hour_height * multiplier), offset];
  const height = wrapInCalc(style);

  const eventPosition = {
    height,
    top,
    left,
  }
  return eventPosition;
}

export const getEditorPosition = (eventObj) => {
  const eventPosition = getEventPosition(eventObj);
  const height = '215px';
  const day = eventObj.day;

  let left;
  switch(day) {
    case "Sunday":
      left = convertToPercent(23);
      break;
    case "Monday":
      left = convertToPercent(36);
      break;
    case "Tuesday":
      left = convertToPercent(49);
      break;
    case "Wednesday":
      left = convertToPercent(62);
      break;
    case "Thursday":
      left = convertToPercent(42);
      break;
    case "Friday":
      left = convertToPercent(55);
      break;
    case "Saturday":
      left = convertToPercent(68);
      break;
  }

  let top = eventPosition.top;
  let eventHeight = eventPosition.height.match(/calc\((.*)\)/)[1];
  if (eventObj.startValue > 15) {
    top = top.replace(")", " - " + height + " + " + eventHeight + " )");
  }

  const editorPosition = {
    top,
    left,
    height,
  }
  return editorPosition;
}
