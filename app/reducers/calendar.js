import * as ActionType from '../actions/calendar';
import * as APIActionType from '../actions/api';
import Immutable from 'immutable';
import moment from 'moment';

const defaultState = Immutable.fromJS({
  selectedDate: moment(),
  calendarViewMode: 'week',
  draggedObj: {},
  resizeObj: {},
  editorObj: { id: '-1' },
  eventsMap: {
    '0': {
      id: '0',
      name: 'Innod Meeting',
      category: 'Google',
      calendar: 'School',
      location: 'Pimental Hall',
      start: moment('2017-04-13 09:00'),
      end: moment('2017-04-13 11:30'),
      isAllDayEvent: false,
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
  googleCalendar: {
    isFetching: false,
    events: {},
  },
  userLoggedIn: false,
});

export default function (state = defaultState, action) {
  let editorObj;
  console.log(state);
  switch (action.type) {

    case APIActionType.REQUEST_GOOGLE_CALENDAR:
      return state.setIn(['googleCalendar', 'isFetching'], true);
    case APIActionType.RECEIVE_GOOGLE_CALENDAR:
      return state.setIn(['googleCalendar', 'isFetching'], false)
                  .setIn(['googleCalendar', 'events'], action.data)
                  .set('userLoggedIn', true);

    case ActionType.ADD_EVENT:
      const eventObj = action.eventObj;
      const id = eventObj.id;
      const event = Immutable.Map([[id, Immutable.Map(eventObj)]]);
      return state.mergeIn(['eventsMap'], event);
    case ActionType.UPDATE_EVENT:
      return state.setIn(['eventsMap', action.eventObj.id], Immutable.Map(action.eventObj));
    case ActionType.EDITOR_ON:
      editorObj = Immutable.fromJS({ id: action.id });
      return state.set('editorObj', editorObj);
    case ActionType.EDITOR_OFF:
      editorObj = Immutable.fromJS({ id: '-1' });
      return state.set('editorObj', editorObj);
    case ActionType.SET_SELECTED_DATE:
      return state.set('selectedDate', action.date);
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
