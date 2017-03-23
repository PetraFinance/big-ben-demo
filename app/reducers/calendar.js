import * as ActionType from '../actions/calendar';
import Immutable from 'immutable';
import moment from 'moment';

const defaultState = Immutable.fromJS({
  activeDate: {},
  nextAvaliableId: 1,
  editor: -1,
  eventsMap: {
    0: {
      id: 0,
      name: "Innod Meeting",
      category: "Google",
      calendar: "Innovative Design",
      location: "Dwinelle 140",
      startTime: "7 AM",
      endTime: "9:00 AM",
      startValue: 7,
      endValue: 9,
      day: "Monday",
    },
  },
  calendarMap: {
    "Innovative Design": {
      color: "#009688",
      accent: "#008A7D",
    },
    "IEEE": {
      color: "#F44336",
      accent: "#E03D31",
    },
    "School": {
      color: "#03A9F4",
      accent: "#029BE0",
    },
    "Events I'm Attending": {
      color: "#39579A",
      accent: "#39579A",
    },
  },
});

export default function (state = defaultState, action) {
  switch (action.type) {
    case ActionType.ADD_EVENT:
      const id = state.get('nextAvaliableId');
      const event = Immutable.Map([[id, Immutable.Map(action.eventObj)]]);
      return state.mergeIn(['eventsMap'], event)
                  .set('nextAvaliableId', id + 1)
                  .set('editor', id);
    case ActionType.UPDATE_EVENT:
      return state.setIn(['eventsMap', action.eventObj.id], action.eventObj);
    case ActionType.EDITOR_ON:
      return state.set('editor', action.id);
    case ActionType.EDITOR_OFF:
      return state.set('editor', -1);
    case ActionType.SET_ACTIVE_DATE:
      return state.set('activeDate', action.date);
    default:
      return state;
  }
}
