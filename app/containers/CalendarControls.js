import { connect } from 'react-redux'
import { setActiveDate, editorOff } from '../actions/calendar'
import CalendarControls from '../components/CalendarControls'

const mapStateToProps = (state) => {
  const cpState = state.calendar.toJS();
  const activeDate = cpState.activeDate;
  return {
    activeDate,
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
