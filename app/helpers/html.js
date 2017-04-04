import React from 'react'
import $ from 'jquery'

// every event has its id number to be its id in the DOM for easy access
export const getEventEntryDOM = (id) => {
  const eventEntryDOM = document.getElementById(id.toString());
  return eventEntryDOM;
}

export const togglePointerEvents = (eventsMap, eventsOn) => {
  let cssValue = 'none';
  if (eventsOn) {
    cssValue = '';
  }
  const indices = Object.keys(eventsMap);
  for (let index of indices) {
    const eventObj = eventsMap[index];
    const id = generateObjectId(eventObj);
    const eventEntryDOM = getEventEntryDOM(id);
    $(eventEntryDOM).css("pointer-events", cssValue);
  }
}

export const generateObjectId = (eventObj) => {
  const params = [eventObj.id, eventObj.startTime, eventObj.endTime, eventObj.day, eventObj.name];
  const noSpaces = params.map(item => item.toString().replace(' ', ''));
  return noSpaces.join('');
};

export const generateObjectKey = (args) => ( args.join(" ") );
