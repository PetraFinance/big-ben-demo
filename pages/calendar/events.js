import React from 'react'

export const genEvents = (events, handleDragBehavior) => {
  let eventsList = [];
  for (let event of events) {
    const day = event.day;
    const length = Math.abs(event.endValue - event.startValue) * 10;
    const start = event.startTime.replace(":", "").replace(" ", "");
    const className = 'event-entry start-' + start + ' ' + day + ' ' + 'length-' + length.toString();
    const key = event.id;
    const eventjsx = (
      <div
        key={key}
        draggable="true"
        className={className}
        onDragStart={() => handleDragBehavior(event)}
      >
        <div className="sidebar">
        </div>
        <div className="content">
          <div className="title">
            {event.name}
          </div>
        </div>
      </div>
    );
    eventsList.push(eventjsx);
  }
  return eventsList;
}
