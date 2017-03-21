import React from 'react';
import CalendarsList from '../components/CalendarsList'
import CalendarControls from '../components/CalendarControls'
import DatePicker from '../components/DatePicker'
import Calendar from '../components/Calendar'

function App() {
  return (
    <div className="app-container">
      <div className="side-panel">
        <div className="spacer">
        </div>
        <DatePicker />
        <CalendarsList />
      </div>
      <div className="calendar-panel">
        <CalendarControls />
        <Calendar />
      </div>
    </div>
  );
}

export default App;
