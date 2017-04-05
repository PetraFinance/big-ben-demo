import React from 'react'
import CalendarsList from '../components/CalendarsList'
import CalendarControls from './CalendarControls'
import DatePicker from './DatePicker'
import Calendar from './Calendar'

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
