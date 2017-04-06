import $ from 'jquery';

export const getEventEntryDOM = (id) => {
  const eventEntryDOM = document.getElementById(id.toString());
  return eventEntryDOM;
};

export const generateObjectId = (eventObj) => {
  const params = [eventObj.id, eventObj.startTime, eventObj.endTime, eventObj.day, eventObj.name];
  const noSpaces = params.map(item => item.toString().replace(' ', ''));
  return noSpaces.join('');
};

export const generateObjectKey = (args) => (args.join(" "));

// The jankiest of methods to make the month bold and the year normal
// Could consider forking the Airbnb react dates and managing own version
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

export const togglePointerEvents = (eventsMap, eventsOn) => {
  let cssValue = 'none';
  if (eventsOn) {
    cssValue = '';
  }
  const indices = Object.keys(eventsMap);
  for (const index of indices) {
    const eventObj = eventsMap[index];
    const id = generateObjectId(eventObj);
    const eventEntryDOM = getEventEntryDOM(id);
    $(eventEntryDOM).css("pointer-events", cssValue);
  }
};
