import * as ActionType from '../actions/calendar';
import Immutable from 'immutable';
import moment from 'moment';

const defaultState = Immutable.fromJS({
  activeDate: moment(),
  draggedObj: {},
  resizeObj: {},
  editorObj: {
    id: -1,
  },
  nextAvaliableId: 2,
  eventsMap: {
    0: {
      id: 0,
      name: 'Innod Meeting',
      category: 'Google',
      calendar: 'Innovative Design',
      location: 'Dwinelle 140',
      startTime: '8 AM',
      endTime: '10 AM',
      startValue: 8,
      endValue: 10,
      day: 'Wednesday',
      date: moment('2017-04-14'),
    },
    1: {
      id: 1,
      name: 'Innod Meeting',
      category: 'Google',
      calendar: 'Innovative Design',
      location: 'Dwinelle 140',
      startTime: '9 AM',
      endTime: '1 PM',
      startValue: 9,
      endValue: 13,
      day: 'Wednesday',
      date: moment(),
    },
  },
  calendarMap: {
    'Innovative Design': {
      color: '#009688',
      accent: '#008A7D',
    },
    'IEEE': {
      color: '#F44336',
      accent: '#E03D31',
    },
    'School': {
      color: '#03A9F4',
      accent: '#029BE0',
    },
    'Events I\'m Attending': {
      color: '#39579A',
      accent: '#39579A',
    },
  },
});

export default function (state = defaultState, action) {
  let editorObj;
  switch (action.type) {
    case ActionType.ADD_EVENT:
      const id = state.get('nextAvaliableId');
      const event = Immutable.Map([[id, Immutable.Map(action.eventObj)]]);
      editorObj = Immutable.fromJS({ id: id });
      return state.mergeIn(['eventsMap'], event)
                  .set('nextAvaliableId', id + 1)
                  .set('editorObj', editorObj);
    case ActionType.UPDATE_EVENT:
      return state.setIn(['eventsMap', action.eventObj.id], Immutable.Map(action.eventObj));
    case ActionType.EDITOR_ON:
      editorObj = Immutable.fromJS({ id: action.id });
      return state.set('editorObj', editorObj);
    case ActionType.EDITOR_OFF:
      editorObj = Immutable.fromJS({ id: -1 });
      return state.set('editorObj', editorObj);
    case ActionType.SET_ACTIVE_DATE:
      return state.set('activeDate', action.date);
    case ActionType.SET_DRAGGED_OBJ:
      return state.set('draggedObj', Immutable.Map(action.eventObj));
    case ActionType.SET_RESIZE_OBJ:
      return state.set('resizeObj', Immutable.Map(action.eventObj));
    default:
      return state;
  }
}
