export const ADD_EVENT = Symbol('ADD_EVENT');
export function addEvent(eventObj) {
  return {
    type: ADD_EVENT,
    eventObj,
  };
}

export const UPDATE_EVENT = Symbol('UPDATE_EVENT');
export function updateEvent(eventObj) {
  return {
    type: UPDATE_EVENT,
    eventObj,
  };
}

export const EDITOR_ON = Symbol('EDITOR_ON');
export function editorOn(eventObj) {
  return {
    type: EDITOR_ON,
    eventObj,
  };
}

export const EDITOR_OFF = Symbol('EDITOR_OFF');
export function editorOff() {
  return {
    type: EDITOR_OFF,
  };
}

export const SET_SELECTED_DATE = Symbol('SET_SELECTED_DATE');
export function setSelectedDate(date) {
  return {
    type: SET_SELECTED_DATE,
    date,
  };
}

export const SET_RESIZE_OBJ = Symbol('SET_RESIZE_OBJ');
export function setResizeObj(eventObj) {
  return {
    type: SET_RESIZE_OBJ,
    eventObj,
  };
}

export const SET_DRAGGED_OBJ = Symbol('SET_DRAGGED_OBJ');
export function setDraggedObj(eventObj) {
  return {
    type: SET_DRAGGED_OBJ,
    eventObj,
  };
}

export const TOGGLE_CALENDAR_VISIBILITY = Symbol('TOGGLE_CALENDAR_VISIBILITY');
export function toggleCalendarVisibility(calendarGroup, calendarId) {
  return {
    type: TOGGLE_CALENDAR_VISIBILITY,
    calendarGroup,
    calendarId,
  }
}

export const TOGGLE_CALENDAR_MODE = Symbol('TOGGLE_CALENDAR_MODE');
export function toggleCalendarMode() {
  return {
    type: TOGGLE_CALENDAR_MODE,
  }
}
