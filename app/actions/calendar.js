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
export function editorOn(id) {
  return {
    type: EDITOR_ON,
    id,
  };
}

export const EDITOR_OFF = Symbol('EDITOR_OFF');
export function editorOff() {
  return {
    type: EDITOR_OFF,
  };
}

export const SET_ACTIVE_DATE = Symbol('SET_ACTIVE_DATE');
export function setActiveDate(date) {
  return {
    type: SET_ACTIVE_DATE,
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
