import React from 'react';
import CalendarList from '../containers/CalendarList';
import CalendarControls from '../containers/CalendarControls';
import DatePicker from '../containers/DatePicker';
import Calendar from '../containers/Calendar';
import Login from './Login';

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    this.props.fetchGoogleCalendar();

    const userLoggedIn = this.props.userLoggedIn;
    const app = (
      <div className="app-container">
        <div className="side-panel">
          <div className="side-panel-header" />
          <DatePicker />
          <CalendarList />
        </div>
        <div className="calendar-panel">
          <CalendarControls />
          <Calendar />
        </div>
      </div>
    );
    const loginPage = (<Login />);

    if (userLoggedIn) {
      return app;
    }
    return loginPage;
  }
}
