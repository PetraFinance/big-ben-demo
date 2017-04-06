import { connect } from 'react-redux';
import { toggleCalendarVisibility, editorOff } from '../actions/calendar';
import CalendarList from '../components/CalendarList';

const mapStateToProps = (state) => {
  const cpState = state.calendar.toJS();
  const calendarMap = cpState.calendarMap;
  return {
    calendarMap,
  };
};

const mapDispatchToProps = (dispatch) => ({
  toggleCalendarVisibility: (category, calendar) => {
    dispatch(toggleCalendarVisibility(category, calendar));
  },
  editorOff: () => {
    dispatch(editorOff());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CalendarList);
