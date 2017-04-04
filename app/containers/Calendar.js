import { connect } from 'react-redux'
import { addEvent, updateEvent, editorOn, editorOff, setResizeObj, setDraggedObj } from '../actions/calendar'
import Calendar from '../components/Calendar'

const mapStateToProps = (state) => {
  const cpState = state.calendar.toJS();
  const calendarMap = cpState.calendarMap;
  const eventsMap = cpState.eventsMap;
  const activeDate = cpState.activeDate;
  const editorObj = cpState.editorObj;
  const draggedObj = cpState.draggedObj;
  const resizeObj = cpState.resizeObj;
  const nextAvaliableId = cpState.nextAvaliableId;
  return {
    resizeObj,
    draggedObj,
    editorObj,
    calendarMap,
    eventsMap,
    nextAvaliableId,
    activeDate,
  };
};

const mapDispatchToProps = (dispatch) => ({
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
  editorOn: (id) => {
    dispatch(editorOn(id));
  },
  editorOff: () => {
    dispatch(editorOff());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Calendar);
