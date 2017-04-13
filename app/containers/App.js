import { connect } from 'react-redux';
import { fetchGoogleCalendar } from '../actions/api';
import App from '../components/App';

const mapStateToProps = (state) => {
  const userLoggedIn = state.calendar.get('userLoggedIn');
  return {
    userLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchGoogleCalendar: () => {
    dispatch(fetchGoogleCalendar());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
