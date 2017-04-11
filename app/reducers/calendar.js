import * as ActionType from '../actions/calendar';
import Immutable from 'immutable';
import moment from 'moment';

// the startTime and endTime keys in eventObjs are slightly redundant,
// can be removed at some point
const defaultState = Immutable.fromJS({
  activeDate: moment(),
  calendarViewMode: "week",
  draggedObj: {},
  resizeObj: {},
  editorObj: {
    id: '-1',
  },
  eventsMap: {
    '0': {
      id: '0',
      name: 'Innod Meeting',
      category: 'Google',
      calendar: 'School',
      location: 'Dwinelle 140',
      startTime: '8 AM',
      endTime: '10 AM',
      startValue: 8,
      endValue: 10,
      allDay: false,
      date: moment('2017-04-15'),
    },
    '1': {
      id: '1',
      name: 'Innod Meeting',
      category: 'Google',
      calendar: 'Innovative Design',
      location: 'Dwinelle 140',
      startTime: '9 AM',
      endTime: '1 PM',
      startValue: 9,
      endValue: 13,
      allDay: false,
      date: moment(),
    },
    '2': {
      id: '2',
      name: 'IEEE Meeting',
      category: 'Google',
      calendar: 'IEEE',
      location: 'Dwinelle 140',
      startTime: '2 PM',
      endTime: '3 PM',
      startValue: 14,
      endValue: 15,
      allDay: true,
      date: moment(),
    },
    '3': {
      id: '3',
      name: 'Random',
      category: 'Google',
      calendar: 'School',
      location: 'Dwinelle 140',
      startTime: '2 PM',
      endTime: '3 PM',
      startValue: 14,
      endValue: 15,
      allDay: true,
      date: moment(),
    },
    '4': {
      id: '4',
      name: 'Random',
      category: 'Google',
      calendar: 'School',
      location: 'Dwinelle 140',
      startTime: '2 PM',
      endTime: '3 PM',
      startValue: 14,
      endValue: 15,
      allDay: true,
      date: moment(),
    },
  },
  calendarMap: {
    'Google': {
      'Innovative Design': {
        color: '#009688',
        accent: '#008A7D',
        visible: true,
      },
      'IEEE': {
        color: '#F44336',
        accent: '#E03D31',
        visible: true,
      },
      'School': {
        color: '#03A9F4',
        accent: '#029BE0',
        visible: true,
      },
    },
    'Facebook': {
      "Events I'm Attending": {
        color: '#39579A',
        accent: '#39579A',
        visible: true,
      },
    },
  },
});

export default function (state = defaultState, action) {
  let editorObj;
  switch (action.type) {
    case ActionType.ADD_EVENT:
      const eventObj = action.eventObj;
      const id = eventObj.id;
      const event = Immutable.Map([[id, Immutable.Map(eventObj)]]);
      console.log(event.toJS());
      return state.mergeIn(['eventsMap'], event);
    case ActionType.UPDATE_EVENT:
      return state.setIn(['eventsMap', action.eventObj.id], Immutable.Map(action.eventObj));
    case ActionType.EDITOR_ON:
      editorObj = Immutable.fromJS({ id: action.id });
      return state.set('editorObj', editorObj);
    case ActionType.EDITOR_OFF:
      editorObj = Immutable.fromJS({ id: '-1' });
      return state.set('editorObj', editorObj);
    case ActionType.SET_ACTIVE_DATE:
      return state.set('activeDate', action.date);
    case ActionType.SET_DRAGGED_OBJ:
      return state.set('draggedObj', Immutable.Map(action.eventObj));
    case ActionType.SET_RESIZE_OBJ:
      return state.set('resizeObj', Immutable.Map(action.eventObj));
    case ActionType.TOGGLE_CALENDAR_VISIBILITY:
      const visible = state.getIn(['calendarMap', action.category, action.calendar, 'visible']);
      return state.setIn(['calendarMap', action.category, action.calendar, 'visible'], !visible);
    case ActionType.TOGGLE_CALENDAR_MODE:
      const viewMode = state.get('calendarViewMode');
      let updatedViewMode = "week";
      if (viewMode === updatedViewMode) {
        updatedViewMode = "month";
      }
      return state.set('calendarViewMode', updatedViewMode);
    default:
      return state;
  }
}
