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
