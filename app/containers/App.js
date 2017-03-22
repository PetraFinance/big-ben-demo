import React from 'react'
import CalendarsList from '../components/CalendarsList'
import CalendarControls from '../components/CalendarControls'
import Calendar from './Calendar'

function App() {
  return (
    <div className="app-container">
      <div className="side-panel">
        <div className="spacer">
        </div>
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
