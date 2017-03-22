import { connect } from 'react-redux';
import { addEvent, updateEvent } from '../actions/calendar'
import Calendar from '../components/Calendar'

const mapStateToProps = (state) => {
  const cpState = state.calendar.toJS();
  const calendarMap = cpState.calendarMap;
  const eventsMap = cpState.eventsMap;
  const nextAvaliableId = cpState.nextAvaliableId;
  return {
    calendarMap,
    eventsMap,
    nextAvaliableId,
  };
};

const mapDispatchToProps = (dispatch) => ({
  addEvent: (eventObj) => {
    dispatch(addEvent(eventObj));
  },
  updateEvent: (eventObj) => {
    dispatch(updateEvent(eventObj));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Calendar);
