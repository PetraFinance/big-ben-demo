import React from 'react'

export const genEvents = (events, handleDragBehavior) => {
  let eventsList = [];
  for (let eventObj of events) {
    const day = eventObj.day;
    const length = Math.abs(eventObj.endValue - eventObj.startValue) * 10;
    const start = eventObj.startTime.replace(":", "").replace(" ", "");
    const key = eventObj.id;
    const className = 'event-entry start-' + start + ' ' + day + ' ' + 'length-' + length.toString();

    const eventjsx = (
      <div
        key={key}
        draggable="true"
        className={className}
        onDragStart={() => handleDragBehavior(eventObj)}
      >
        <div className="sidebar">
        </div>
        <div className="content">
          <div className="title">
            {eventObj.name}
          </div>
        </div>
      </div>
    );
    eventsList.push(eventjsx);
  }
  return eventsList;
}
