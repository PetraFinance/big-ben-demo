import React from 'react'
import DatePicker from './datepicker';
import AllCalendarsList from './tags';
import CalendarControls from './calendarControls';
import Calendar from './calendar';

export default class Index extends React.Component {
  render () {
    return (
      <div className="app-container">
        <div className="side-panel">
          <div className="spacer">
          </div>
          <DatePicker />
          <div className="calendar-list-container">
            <AllCalendarsList />
          </div>
        </div>
        <div className="calendar-panel">
          <CalendarControls />
          <Calendar />
        </div>
      </div>
    )
  }
}
