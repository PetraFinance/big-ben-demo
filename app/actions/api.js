import fetch from 'isomorphic-fetch';
import moment from 'moment';
import { RRule, RRuleSet, rrulestr } from 'rrule';
import { isEmpty } from '../helpers/objects';
require('moment-recur');

// ===============================================
// The Google Calendar API Suite
// ===============================================

export const REQUEST_GOOGLE_CALENDAR = Symbol('REQUEST_GOOGLE_CALENDAR');
function requestGoogleCalendar() {
  return {
    type: REQUEST_GOOGLE_CALENDAR,
  };
}

export const RECEIVE_GOOGLE_CALENDAR = Symbol('RECEIVE_GOOGLE_CALENDAR');
function receiveGoogleCalendar() {
  return {
    type: RECEIVE_GOOGLE_CALENDAR,
  };
}

export const RECEIVE_GOOGLE_CALENDAR_PROFILE = Symbol('RECEIVE_GOOGLE_CALENDAR_PROFILE');
function receiveGoogleCalendarProfile(profile) {
  return {
    type: RECEIVE_GOOGLE_CALENDAR_PROFILE,
    profile,
  }
}

export const RECEIVE_GOOGLE_CALENDAR_LIST_ENTRY = Symbol('RECEIVE_GOOGLE_CALENDAR_LIST_ENTRY');
function receiveGoogleCalendarListEntry(id, entry) {
  return {
    type: RECEIVE_GOOGLE_CALENDAR_LIST_ENTRY,
    id,
    entry,
  }
}

// This can be split up into separate methods at some point
// It's a fat one right now because of time crunch
export function fetchGoogleCalendar() {
  return dispatch => {
    dispatch(requestGoogleCalendar);

    // request the Google user profile
    fetch(`https://api.cal.trypetra.com/me`, {
      method: 'GET',
      credentials: 'same-origin',
    })
    .then(response => response.json())
    .then(profile => dispatch(receiveGoogleCalendarProfile(profile)));

    fetch('https://api.cal.trypetra.com/', {
      method: 'GET',
      credentials: 'same-origin',
    })
    .then(response => response.json())
    .then(json => {
      // request the Google calendars
      for (const calendarListEntry of json.items) {
        // get the calendar information
        const calendarListEntryId = calendarListEntry.id;
        const visible = true;
        const color = calendarListEntry.backgroundColor;
        const name = calendarListEntry.summary;
        // fetch the events for the calendar
        fetch(`https://api.cal.trypetra.com/${calendarListEntryId}`, {
          method: 'GET',
          credentials: 'same-origin',
        })
        .then(response => response.json())
        .then(calendarListEntryEvents => {
          const eventEntries = calendarListEntryEvents.items;
          const eventsMap = {};
          console.log(calendarListEntryEvents);
          for (const eventObj of eventEntries) {
            const id = eventObj.id;
            const name = eventObj.summary;
            const location = eventObj.location;
            const start = moment(eventObj.start.dateTime);
            const end = moment(eventObj.end.dateTime);
            const isAllDayEvent = false;
            const packagedEvent = {
              id,
              name,
              location,
              start,
              end,
              isAllDayEvent,
              calendarId: calendarListEntryId,
              calendarGroup: 'Google',
            }
            eventsMap[id] = packagedEvent;
          }
          const packagedCalendarListEntry = {
            highlight: color,
            color,
            name,
            eventsMap,
            visible,
          };
          if (!isEmpty(eventsMap)) {
            dispatch(receiveGoogleCalendarListEntry(calendarListEntryId, packagedCalendarListEntry));
          }
        });
      }
    })
    .then(() => {
      dispatch(receiveGoogleCalendar());
    });
  }
}
