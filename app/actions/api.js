import fetch from 'whatwg-fetch';

export const REQUEST_GOOGLE_CALENDAR = Symbol('REQUEST_GOOGLE_CALENDAR');
function requestGoogleCalendar() {
  return {
    type: REQUEST_GOOGLE_CALENDAR,
  };
}

export const RECEIVE_GOOGLE_CALENDAR = Symbol('RECEIVE_GOOGLE_CALENDAR');
function receiveGoogleCalendar(data) {
  return {
    type: RECEIVE_GOOGLE_CALENDAR,
    data,
  };
}

export function fetchGoogleCalendar() {
  return dispatch => {
    dispatch(requestGoogleCalendar);
    return fetch('https://api.cal.trypetra.com/me', {
      method: 'GET',
      credentials: 'include',
    })
    .then(response => {
      json = response.json();
      dispatch(receiveGoogleCalendar(json));
    })
    .catch(error => {

    });
  }
}
