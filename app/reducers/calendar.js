import * as ActionType from '../actions/calendar';
import Immutable from 'immutable';

// an eventsObj uses its id for as its key in the eventsMap, but also keeps the value stored internally

const defaultState = Immutable.fromJS({
  nextAvaliableId: 1,
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
      day: "Mon",
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
                  .set('nextAvaliableId', id + 1);
    case ActionType.UPDATE_EVENT:
      return state.setIn(['eventsMap', action.eventObj.id], action.eventObj);
    default:
      return state;
  }
}
