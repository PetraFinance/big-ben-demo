import React from 'react';
import { getEventPosition } from '../../helpers/position';
import { genObjectId } from '../../helpers/html';

export default class WeekEvent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const eventObj = this.props.eventObj;
    const calendarMap = this.props.calendarMap;

    const startTime = eventObj.startTime;
    const endTime = eventObj.endTime;
    const length = Math.abs(eventObj.endValue - eventObj.startValue) * 10;
    const category = eventObj.category;
    const calendar = eventObj.calendar;

    const color = { backgroundColor: calendarMap[category][calendar].color };
    const accent = { backgroundColor: calendarMap[category][calendar].accent };
    const eventEntryStyle = Object.assign(
      getEventPosition(eventObj),
      color,
    );

    const timeInfo = (
      <div className="start-end-times">
        {startTime.replace(' ', '').toLowerCase()}-{endTime.replace(' ', '').toLowerCase()}
      </div>
    );
    const locationInfo = (
      <div className="location">
        {eventObj.location}
      </div>
    );

    return (
      <div
        id={genObjectId(eventObj)}
        className="event-entry"
        style={eventEntryStyle}
      >
        <div
          className="content-wrapper"
          draggable="true"
          onDragStart={(evt) => this.props.handleEventDrag(eventObj, evt)}
          onClick={() => this.props.handleEventClick(eventObj)}
        >
          <div
            className="sidebar"
            style={accent}
          >
          </div>
          <div className="content">
            <div className="title">
              {eventObj.name}
            </div>
            { length > 5 ? timeInfo : (<div />)}
            { length > 5 ? locationInfo : (<div />)}
          </div>
        </div>
        <div
          className="resizer"
          draggable="true"
          onMouseDown={(evt) => this.props.handleEventResize(eventObj, evt)}
        >
          <div
            className="sidebar"
            style={accent}
          />
          <div
            className="filler"
            style={color}
          />
        </div>
      </div>
    );
  }
}

WeekEvent.propTypes = {
  calendarMap: React.PropTypes.object.isRequired,
  eventObj: React.PropTypes.object.isRequired,
  handleEventDrag: React.PropTypes.func.isRequired,
  handleEventClick: React.PropTypes.func.isRequired,
  handleEventResize: React.PropTypes.func.isRequired,
};
