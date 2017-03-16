import React from 'react'
import { genTimeMap } from './helpers';

export const genSmartCells = (createEvent, checkDropElement) => {
  const days = [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ];
  const times = genTimeMap();
  const hours = times.filter(timeObj => !timeObj.time.includes(":30"));
  const rows = hours.map((timeObj, i) => {
    const hours_jsx = days.map((day, i) => (
      <div
        key={i}
        className="item"
        onClick={() => createEvent(day, timeObj.value)}
        onMouseUp={() => checkDropElement(day, timeObj.value)}
      >
      </div>
    ));
    const half_hours_jsx = days.map((day, i) => (
      <div
        key={i}
        className="item"
        onClick={() => createEvent(day, timeObj.value + 0.5)}
        onMouseUp={() => checkDropElement(day, timeObj.value + 0.5)}
      >
      </div>
    ));
    return (
      <div key={i}>
        <div className="row">
          <div className="time">
            <span>{timeObj.time}</span>
          </div>
          {hours_jsx}
        </div>
        <div className="row half-hour">
          <div className="time"></div>
          {half_hours_jsx}
        </div>
      </div>
    );
  });
  return rows;
}
