import { connect } from 'react-redux'
import { updateEvent } from '../actions/calendar'
import Editor from '../components/Editor'

const mapStateToProps = (state) => {
  const cpState = state.calendar.toJS();
  const editorObj = cpState.editorObj;
  const calendarMap = cpState.calendarMap;
  const eventsMap = cpState.eventsMap;
  return {
    editorObj,
    calendarMap,
    eventsMap,
  };
};

const mapDispatchToProps = (dispatch) => ({
  updateEvent: (eventObj) => {
    dispatch(updateEvent(eventObj));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
