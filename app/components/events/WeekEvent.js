import React from 'react';
import { getEventPosition } from '../../helpers/position';
import { genObjectId } from '../../helpers/html';

export default class WeekEvent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const calendarMap = this.props.calendarMap;
    const eventObj = this.props.eventObj;

    const start = eventObj.start;
    const end = eventObj.end;
    const lengthInMinutes = end.diff(start, 'minutes');

    const category = eventObj.category;
    const calendar = eventObj.calendar;

    const color = { backgroundColor: calendarMap[category][calendar].color };
    const accent = { backgroundColor: calendarMap[category][calendar].accent };
    const eventEntryStyle = Object.assign(getEventPosition(eventObj), color);

    const timeInfo = (
      <div className="start-end-times">
        {start.format('h:mma-') + end.format('h:mma')}
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
            { lengthInMinutes > 30 ? timeInfo : (<div />)}
            { lengthInMinutes > 30 ? locationInfo : (<div />)}
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
