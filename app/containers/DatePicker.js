import { connect } from 'react-redux'
import { setActiveDate } from '../actions/calendar'
import DatePicker from '../components/DatePicker'

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
});

export default connect(mapStateToProps, mapDispatchToProps)(DatePicker);
