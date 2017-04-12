import React from 'react';
import { genObjectId } from '../../helpers/html';

export default class AllDayEvent extends React.Component {
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

    return (
      <div
        id={genObjectId(eventObj)}
        className="all-day-event-entry"
        style={color}
      >
        <div className="content-wrapper">
          <div className="sidebar" style={accent} />
          <div className="content">
            <div className="title">
              {eventObj.name}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AllDayEvent.propTypes = {
  calendarMap: React.PropTypes.object.isRequired,
  eventObj: React.PropTypes.object.isRequired,
};
