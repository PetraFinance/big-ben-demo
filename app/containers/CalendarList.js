import { connect } from 'react-redux';
import { toggleCalendarVisibility, editorOff } from '../actions/calendar';
import CalendarList from '../components/CalendarList';

const mapStateToProps = (state) => {
  const cpState = state.calendar.toJS();
  const eventsMap = cpState.eventsMap;
  return {
    eventsMap,
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
