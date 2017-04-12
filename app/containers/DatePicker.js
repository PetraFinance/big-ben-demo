import moment from 'moment';
import { connect } from 'react-redux';
import { setSelectedDate, editorOff } from '../actions/calendar';
import DatePicker from '../components/DatePicker';

const mapStateToProps = (state) => {
  const cpState = state.calendar.toJS();
  const selectedDate = cpState.selectedDate.clone();
  return {
    selectedDate,
  };
};

const mapDispatchToProps = (dispatch) => ({
  setSelectedDate: (date) => {
    dispatch(setSelectedDate(date));
  },
  editorOff: () => {
    dispatch(editorOff());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(DatePicker);
