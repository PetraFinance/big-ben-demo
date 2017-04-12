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
  const startDate = eventObj.start.clone();
  const endDate = eventObj.end.clone();
  const startOfDay = startDate.clone().hours(0).minutes(0).seconds(0);

  multiplier = startDate.day();
  offset = '2px';
  style = [TIME_COLUMN_WIDTH, multiplier.toString() + ' * ' + DAY_COLUMN_WIDTH, offset];
  const left = wrapInCalc(style);

  multiplier = startDate.diff(startOfDay, 'minutes') / 30;
  offset = '1px';
  style = [convertToPx(HALF_HOUR_HEIGHT * multiplier), offset];
  const top = wrapInCalc(style);

  multiplier = endDate.diff(startDate, 'minutes') / 30;
  if (multiplier < 1) { multiplier = 1; }
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
  const TIME_COLUMN_WIDTH = '70px';
  const EVENT_EDITOR_WIDTH = '300px';
  const DAY_COLUMN_WIDTH = '((100% - 70px) / 7)';

  const eventPosition = getEventPosition(eventObj);
  const top = eventPosition.top;
  const day = eventObj.start.format('dddd');

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

  const editorPosition = {
    top,
    left,
  };
  return editorPosition;
}
