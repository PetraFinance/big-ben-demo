import moment from 'moment';
import { connect } from 'react-redux';
import { setSelectedDate, editorOff, toggleCalendarMode } from '../actions/calendar';
import CalendarControls from '../components/CalendarControls';

const mapStateToProps = (state) => {
  const cpState = state.calendar.toJS();
  const selectedDate = cpState.selectedDate.clone();
  const calendarViewMode = cpState.calendarViewMode;
  return {
    selectedDate,
    calendarViewMode,
  };
};

const mapDispatchToProps = (dispatch) => ({
  setSelectedDate: (date) => {
    dispatch(setSelectedDate(date));
  },
  editorOff: () => {
    dispatch(editorOff());
  },
  toggleCalendarMode: () => {
    dispatch(toggleCalendarMode());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CalendarControls);
