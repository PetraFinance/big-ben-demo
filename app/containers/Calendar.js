import { connect } from 'react-redux'
import { addEvent, updateEvent, editorOn, editorOff } from '../actions/calendar'
import Calendar from '../components/Calendar'

const mapStateToProps = (state) => {
  const cpState = state.calendar.toJS();
  const calendarMap = cpState.calendarMap;
  const eventsMap = cpState.eventsMap;
  const editor = cpState.editor;
  const nextAvaliableId = cpState.nextAvaliableId;
  return {
    calendarMap,
    eventsMap,
    nextAvaliableId,
    editor,
  };
};

const mapDispatchToProps = (dispatch) => ({
  addEvent: (eventObj) => {
    dispatch(addEvent(eventObj));
  },
  updateEvent: (eventObj) => {
    dispatch(updateEvent(eventObj));
  },
  editorOn: (id) => {
    dispatch(editorOn(id));
  },
  editorOff: () => {
    dispatch(editorOff());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Calendar);
