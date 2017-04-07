import { connect } from 'react-redux';
import { setActiveDate, editorOff, toggleCalendarMode } from '../actions/calendar';
import CalendarControls from '../components/CalendarControls';

const mapStateToProps = (state) => {
  const cpState = state.calendar.toJS();
  const activeDate = cpState.activeDate;
  const calendarViewMode = cpState.calendarViewMode;
  return {
    activeDate,
    calendarViewMode,
  };
};

const mapDispatchToProps = (dispatch) => ({
  setActiveDate: (date) => {
    dispatch(setActiveDate(date));
  },
  editorOff: () => {
    dispatch(editorOff());
  },
  toggleCalendarMode: () => {
    dispatch(toggleCalendarMode());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CalendarControls);
