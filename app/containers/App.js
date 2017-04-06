import React from 'react';
import CalendarList from './CalendarList';
import CalendarControls from './CalendarControls';
import DatePicker from './DatePicker';
import Calendar from './Calendar';

function App() {
  return (
    <div className="app-container">
      <div className="side-panel">
        <div className="spacer" />
        <DatePicker />
        <CalendarList />
      </div>
      <div className="calendar-panel">
        <CalendarControls />
        <Calendar />
      </div>
    </div>
  );
}

export default App;
