import React from 'react'
import Calendar from './calendar';
import AllCalendarsList from './tags';
import CalendarControls from './calendarControls';

export default class Index extends React.Component {
  render () {
    return (
      <div className="app-container">
        <div className="side-panel">
          <div className="spacer">
          </div>
          <Calendar />
          <div className="calendar-list-container">
            <AllCalendarsList />
          </div>
        </div>
        <div className="calendar-panel">
          <CalendarControls />
        </div>
      </div>
    )
  }
}
