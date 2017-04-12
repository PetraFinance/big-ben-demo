import $ from 'jquery';

/**
 * Given an eventObj, gets the HTML if it exists DOM
 * param {eventObj} eventObj
 * return {html} the HTML representation of eventObj
 */
export const getEventEntryDOM = (eventObj) => {
  const id = genObjectId(eventObj);
  const eventEntryDOM = document.getElementById(id);
  return eventEntryDOM;
};

/**
 * Joins a set of arguments
 * param {array} args
 * return {string} the arguments concatenated with no spaces
 */
export const genUniqueIdentifier = (args) => (args.join(''));

/**
 * Creates a unique identifer for an eventObj
 * param {array} eventObj
 * return {string} the uid for the eventObj
 */
export const genObjectId = (eventObj) => {
  const params = [eventObj.id, eventObj.start.toISOString(), eventObj.end.toISOString()];
  const noSpaces = params.map(item => item.replace(' ', ''));
  return genUniqueIdentifier(noSpaces);
};

/**
 * Used to override the month style in the datepicker
 * Uses a "modified" class to tell whether to modify the DOM or not
 */
export const formatDatePickerMonth = (monthDOM) => {
  const content = monthDOM.innerHTML;
  if (content.includes('modified')) {
    return content;
  }
  let re;
  let date;
  let month;
  let year;
  let reactId = "";
  if (content.includes('reactid')) {
    re = /<strong (.*)>(.*)<\/strong>/;
    reactId = content.match(re)[1];
    date = content.match(re)[2];
    month = date.split(' ')[0];
    year = date.split(' ')[1];
  } else {
    re = />(.*)<\/strong>/;
    date = content.match(re)[1];
    month = date.split(' ')[0];
    year = date.split(' ')[1];
  }
  const updatedHTML = '<strong ' + reactId + ' class="modified">' + month + ' </strong>' + year;
  return updatedHTML;
};


/**
 * Toggles pointer events CSS for all events
 * param {array[eventObj]} eventsMap
 * param {boolean} eventsOn
 */
export const togglePointerEvents = (eventsMap, eventsOn) => {
  let cssValue = 'none';
  if (eventsOn) {
    cssValue = '';
  }
  const indices = Object.keys(eventsMap);
  for (const index of indices) {
    const eventObj = eventsMap[index];
    const eventEntryDOM = getEventEntryDOM(eventObj);
    $(eventEntryDOM).css("pointer-events", cssValue);
  }
};
