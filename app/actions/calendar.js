export const ADD_EVENT = Symbol('ADD_EVENT');
export function addEvent(eventObj) {
  return {
    type: ADD_EVENT,
    eventObj
  };
}

export const UPDATE_EVENT = Symbol('UPDATE_EVENT');
export function updateEvent(eventObj) {
  return {
    type: UPDATE_EVENT,
    eventObj
  };
}

export const EDITOR_ON = Symbol('EDITOR_ON');
export function editorOn(id) {
  return {
    type: EDITOR_ON,
    id
  };
}

export const EDITOR_OFF = Symbol('EDITOR_OFF');
export function editorOff() {
  return {
    type: EDITOR_OFF,
  };
}
