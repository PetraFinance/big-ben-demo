import { connect } from 'react-redux';
import { setActiveDate, editorOff } from '../actions/calendar';
import CalendarControls from '../components/CalendarControls';

const mapStateToProps = (state) => {
  const cpState = state.calendar.toJS();
  const activeDate = cpState.activeDate;
  const calendarViewType = cpState.calendarViewType;
  return {
    activeDate,
    calendarViewType,
  };
};

const mapDispatchToProps = (dispatch) => ({
  setActiveDate: (date) => {
    dispatch(setActiveDate(date));
  },
  editorOff: () => {
    dispatch(editorOff());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CalendarControls);
