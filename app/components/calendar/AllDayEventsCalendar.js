import React from 'react';
import moment from 'moment';
import { genUniqueIdentifier } from '../../helpers/html';
import { getEventPosition } from '../../helpers/position';
import { sameWeek } from '../../helpers/time';
import AllDayEvent from '../events/AllDayEvent';

export default class AllDayEventsCalendar extends React.Component {

  render() {
    const eventsMap = this.props.eventsMap;
    const calendarMap = this.props.calendarMap;
    const selectedDate = this.props.selectedDate;
    const ids = Object.keys(eventsMap);
    let allDayEventsList = [];
    for (let id of ids) {
      const eventObj = eventsMap[id];
      const eventStartDate = eventObj.start;
      if (!sameWeek(eventStartDate, selectedDate) || !eventObj.isAllDayEvent) {
        continue;
      }
      allDayEventsList.push(eventObj);
    }

    const weekdays = moment.weekdays();
    const allDayEventsMap = [];
    let mostEvents = 1;
    let eventCounter = 0;
    for (const day of weekdays) {
      const dayEvents = allDayEventsList.filter((eventObj) => {
        const eventObjDay = eventObj.start.format('dddd');
        return (eventObjDay === day);
      }).map((eventObj) => {
        eventCounter = eventCounter + 1;
        const calendarMap = this.props.calendarMap;
        const visible = calendarMap[eventObj.category][eventObj.calendar].visible;
        if (!visible) {
          return (
            <div
              key={genUniqueIdentifier([eventObj.id, eventObj.name])}
              className="hidden-event-placeholder"
            />
          );
        }
        return (
          <AllDayEvent
            key={genUniqueIdentifier([eventObj.id, eventObj.name])}
            calendarMap={calendarMap}
            eventObj={eventObj}
          />
        );
      });

      if (eventCounter > mostEvents) {
        mostEvents = eventCounter;
      }
      eventCounter = 0;
      allDayEventsMap.push(dayEvents);
    }

    const height = (35 * mostEvents).toString() + 'px';
    const style = { height: height };

    const wrappedDayEvents = allDayEventsMap.map((eventObjs, i) => (
      <div style={style} key={'all-' + i} className="all-day-item">
        {eventObjs}
      </div>
    ));

    return (
      <div className="all-day-events">
        <div style={style} className="row-label time-column">
          <span>ALL DAY</span>
        </div>
        {wrappedDayEvents}
      </div>
    );
  }
}
