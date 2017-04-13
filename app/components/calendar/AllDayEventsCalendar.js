import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import { genUniqueIdentifier } from '../../helpers/html';
import { getEventPosition } from '../../helpers/position';
import { isSameWeek } from '../../helpers/time';
import AllDayEvent from '../events/AllDayEvent';

export default class AllDayEventsCalendar extends React.Component {

  render() {
    const eventsMap = this.props.eventsMap;
    const selectedDate = this.props.selectedDate;

    const calendarGroups = Object.keys(eventsMap);
    // iterate over the different calender groups
    let visibleAllDayEvents = calendarGroups.map(group => {
      const calendars = Object.keys(eventsMap[group].calendarList);
      const visibleCalendarLists = calendars.filter(calendar => eventsMap[group].calendarList[calendar].visible);
      // iterate over the visible calendar lists in the group
      return visibleCalendarLists.map(calendar => {
        const calendarEventsMap = eventsMap[group].calendarList[calendar].eventsMap;
        const eventIds = Object.keys(calendarEventsMap);
        const eventsList = eventIds.map(id => calendarEventsMap[id]);
        return eventsList.filter(event => event.isAllDayEvent && isSameWeek(event.start, selectedDate));
      });
    });
    visibleAllDayEvents = _.flattenDeep(visibleAllDayEvents);

    const weekdays = moment.weekdays();
    const eventsList = [];
    let mostEvents = 1;
    for (const day of weekdays) {
      const currentDayEvents = visibleAllDayEvents.filter((eventObj) => (
        eventObj.start.format('dddd') === day
      )).map((eventObj) => (
        <AllDayEvent
          key={genUniqueIdentifier([eventObj.id, eventObj.name])}
          calendarMap={calendarMap}
          eventObj={eventObj}
        />
      ));
      const numEvents = currentDayEvents.length;
      if (numEvents > mostEvents) {
        mostEvents = numEvents;
      }
      eventsList.push(currentDayEvents);
    }

    const height = (35 * mostEvents).toString() + 'px';
    const style = { height: height };

    const allDayEventsRow = eventsList.map((eventObjs, i) => (
      <div style={style} key={'all-' + i} className="all-day-item">
        {eventObjs}
      </div>
    ));

    return (
      <div className="all-day-events">
        <div style={style} className="row-label time-column">
          <span>ALL DAY</span>
        </div>
        {allDayEventsRow}
      </div>
    );
  }
}
