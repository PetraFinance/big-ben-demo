import moment from 'moment';
import { connect } from 'react-redux';
import { addEvent, updateEvent, editorOn, editorOff, setResizeObj, setDraggedObj, setSelectedDate } from '../actions/calendar';
import Calendar from '../components/Calendar';

const mapStateToProps = (state) => {
  const cpState = state.calendar.toJS();
  const eventsMap = cpState.eventsMap;
  const selectedDate = cpState.selectedDate.clone();
  const editorObj = cpState.editorObj;
  const draggedObj = cpState.draggedObj;
  const resizeObj = cpState.resizeObj;
  const calendarViewMode = cpState.calendarViewMode;
  return {
    resizeObj,
    draggedObj,
    editorObj,
    eventsMap,
    selectedDate,
    calendarViewMode,
  };
};

const mapDispatchToProps = (dispatch) => ({
  setSelectedDate: (date) => {
    dispatch(setSelectedDate(date));
  },
  addEvent: (eventObj) => {
    dispatch(addEvent(eventObj));
  },
  updateEvent: (eventObj) => {
    dispatch(updateEvent(eventObj));
  },
  setResizeObj: (eventObj) => {
    dispatch(setResizeObj(eventObj));
  },
  setDraggedObj: (eventObj) => {
    dispatch(setDraggedObj(eventObj));
  },
  editorOn: (eventObj) => {
    dispatch(editorOn(eventObj));
  },
  editorOff: () => {
    dispatch(editorOff());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Calendar);
