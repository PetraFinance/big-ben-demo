import moment from 'moment';

const convertToPercent = (integer) => {
  return integer.toString() + '%';
}

const convertToPx = (integer) => {
  return integer.toString() + 'px';
}

const wrapInCalc = (args) => {
  return 'calc(' + args.join(' + ') + ')';
}

const makeNegative = (value) => {
  return '-' + value;
}  // Calculate the top position


export const getEventPosition = (eventObj) => {
  const TIME_COLUMN_WIDTH = '70px';
  const DAY_COLUMN_WIDTH = '((100% - 70px) / 7)';
  const HALF_HOUR_HEIGHT = 36;

  let style;
  let offset;
  let multiplier;

  const day = eventObj.date.format('dddd');
  multiplier = moment.weekdays().indexOf(day);
  offset = '2px';
  style = [TIME_COLUMN_WIDTH, multiplier.toString() + ' * ' + DAY_COLUMN_WIDTH, offset];
  const left = wrapInCalc(style);

  const halfHourHeight = 36;
  const calendarStartValue = 0;
  const startValue = eventObj.startValue;
  offset = '1px';
  multiplier = Math.abs(calendarStartValue - startValue) * 2;
  style = [convertToPx(HALF_HOUR_HEIGHT * multiplier), offset];
  const top = wrapInCalc(style);

  const endValue = eventObj.endValue;
  multiplier = Math.abs(endValue - startValue) * 2;
  if (multiplier < 1) {
    multiplier = 1;
  }
  offset = '-1px';
  style = [convertToPx(HALF_HOUR_HEIGHT * multiplier), offset];
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
  const day = eventObj.date.format('dddd');

  const height = '215px';
  const TIME_COLUMN_WIDTH = '70px';
  const EVENT_EDITOR_WIDTH = '300px';
  const DAY_COLUMN_WIDTH = '((100% - 70px) / 7)';

  let left = '0px';
  switch (day) {
    case 'Sunday':
      left = wrapInCalc([TIME_COLUMN_WIDTH, '1 * ' + DAY_COLUMN_WIDTH]);
      break;
    case 'Monday':
      left = wrapInCalc([TIME_COLUMN_WIDTH, '2 * ' + DAY_COLUMN_WIDTH]);
      break;
    case 'Tuesday':
      left = wrapInCalc([TIME_COLUMN_WIDTH, '3 * ' + DAY_COLUMN_WIDTH]);
      break;
    case 'Wednesday':
      left = wrapInCalc([TIME_COLUMN_WIDTH, '4 * ' + DAY_COLUMN_WIDTH]);
      break;
    case 'Thursday':
      left = wrapInCalc(['99.5%', makeNegative(EVENT_EDITOR_WIDTH), '-3 * ' + DAY_COLUMN_WIDTH]);
      break;
    case 'Friday':
      left = wrapInCalc(['99.5%', makeNegative(EVENT_EDITOR_WIDTH), '-2 * ' + DAY_COLUMN_WIDTH]);
      break;
    case 'Saturday':
      left = wrapInCalc(['99.5%', makeNegative(EVENT_EDITOR_WIDTH), '-1 * ' + DAY_COLUMN_WIDTH]);
      break;
  }

  let top = eventPosition.top;
  const eventHeight = eventPosition.height.match(/calc\((.*)\)/)[1];
  if (eventObj.startValue > 15) {
    top = top.replace(')', ' - ' + height + ' + ' + eventHeight + ' )');
  }

  const editorPosition = {
    top,
    left,
    height,
  };
  return editorPosition;
}
