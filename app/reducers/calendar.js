import * as ActionType from '../actions/calendar';
import * as APIActionType from '../actions/api';
import Immutable from 'immutable';
import moment from 'moment';

const defaultState = Immutable.fromJS({
  selectedDate: moment(),
  calendarViewMode: 'week',
  draggedObj: {},
  resizeObj: {},
  editorObj: {},
  eventsMap: {
    'Petra': {
      calendarList: {
        'You': {
          name: 'You',
          color: '#03A9F4',
          highlight: '#029BE0',
          visible: true,
          eventsMap: {
            '0': {
              id: '0',
              calendarId: 'You',
              calendarGroup: 'Petra',
              name: 'Innod Meeting',
              location: '140 Dwinelle Hall',
              start: moment('2017-04-13 09:00'),
              end: moment('2017-04-13 11:30'),
              allDayEvent: false,
            }
          },
        },
      },
    },
    'Google': {
      calendarList: {},
      profile: {},
      isFetching: false,
    },
  },
  userLoggedIn: false,
});

export default function (state = defaultState, action) {
  let editorObj;
  let eventObj;
  let id;
  let path;
  let calendarGroup;
  let calendarId;
  console.log(state.toJS());

  switch (action.type) {
    case APIActionType.REQUEST_GOOGLE_CALENDAR:
      return state.setIn(['eventsMap', 'Google', 'isFetching'], true);
    case APIActionType.RECEIVE_GOOGLE_CALENDAR:
      return state.setIn(['eventsMap', 'Google', 'isFetching'], false)
                  .set('userLoggedIn', true);
    case APIActionType.RECEIVE_GOOGLE_CALENDAR_PROFILE:
      return state.setIn(['eventsMap', 'Google', 'profile'], action.profile);
    case APIActionType.RECEIVE_GOOGLE_CALENDAR_LIST_ENTRY:
      return state.setIn(['eventsMap', 'Google', 'calendarList', action.id], Immutable.fromJS(action.entry));

    case ActionType.ADD_EVENT:
      eventObj = action.eventObj;
      id = eventObj.id;
      path = ['eventsMap', 'Petra', 'calendarList', 'You', 'eventsMap', id];
      return state.mergeIn(path, Immutable.fromJS(eventObj));
    case ActionType.UPDATE_EVENT:
      eventObj = action.eventObj;
      id = eventObj.id;
      calendarGroup = eventObj.calendarGroup;
      calendarId = eventObj.calendarId;
      path = ['eventsMap', calendarGroup, 'calendarList', calendarId, 'eventsMap', id]
      return state.setIn(path, Immutable.fromJS(eventObj));
    case ActionType.EDITOR_ON:
      editorObj = Immutable.fromJS(action.eventObj);
      return state.set('editorObj', editorObj);
    case ActionType.EDITOR_OFF:
      return state.set('editorObj', Immutable.fromJS({}));
    case ActionType.SET_SELECTED_DATE:
      return state.set('selectedDate', action.date);
    case ActionType.SET_DRAGGED_OBJ:
      return state.set('draggedObj', Immutable.Map(action.eventObj));
    case ActionType.SET_RESIZE_OBJ:
      return state.set('resizeObj', Immutable.Map(action.eventObj));
    case ActionType.TOGGLE_CALENDAR_VISIBILITY:
      calendarGroup = action.calendarGroup;
      calendarId = action.calendarId;
      console.log(calendarId);
      path = ['eventsMap', calendarGroup, 'calendarList', calendarId, 'visible'];
      const visible = state.getIn(path);
      return state.setIn(path, !visible);
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
