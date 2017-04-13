import React from 'react';
import moment from 'frozen-moment';
import _ from 'lodash';
import { togglePointerEvents, genUniqueIdentifier, genObjectId } from '../../helpers/html';
import { isEmpty } from '../../helpers/objects';
import { genTimesOfDay, computeTimeFromInt, getWeekStartDate, isSameWeek, isSameDay } from '../../helpers/time';
import { getEventPosition } from '../../helpers/position';
import Editor from '../../containers/Editor';
import WeekEvent from '../events/WeekEvent';

export default class CalendarWeekView extends React.Component {

  constructor(props) {
    super(props);

    this.handleCalClick = this.handleCalClick.bind(this);
    this.handleCalMouseUp = this.handleCalMouseUp.bind(this);
    this.handleCalMouseEnter = this.handleCalMouseEnter.bind(this);
    this.shouldEndDrag = this.shouldEndDrag.bind(this);
    this.shouldEndResize = this.shouldEndResize.bind(this);

    this.handleEventResize = this.handleEventResize.bind(this);
    this.handleEventClick = this.handleEventClick.bind(this);
    this.handleEventDrag = this.handleEventDrag.bind(this);
  }

  componentDidMount() {
    const calendar = document.getElementById('main-calendar-week');
    const earliestEvent = document.getElementById('calendar-week-scroll-anchor');
    if (earliestEvent) {
      calendar.scrollTop = earliestEvent.offsetTop - 35;
    }
  }

  handleEventResize(eventObj, evt) {
    evt.preventDefault();
    togglePointerEvents(this.props.eventsMap, false);
    this.props.setResizeObj(eventObj);
    this.props.editorOff();
  }

  handleEventDrag(eventObj, evt) {
    evt.preventDefault();
    togglePointerEvents(this.props.eventsMap, false);
    this.props.setDraggedObj(eventObj);
    this.props.editorOff();
  }

  handleEventClick(eventObj) {
    this.props.editorOn(eventObj);
  }

  handleCalMouseEnter(date) {
    // handle the logic if an event is being resized
    date = date.freeze();
    const resizeObj = this.props.resizeObj;
    if (!isEmpty(resizeObj)) {
      // event must be on the same day
      const start = resizeObj.start;
      const year = start.year();
      const month = start.month();
      const day = start.day();
      const end = date.year(year).month(month).day(day).add(30, 'minutes');
      const updates = { end };
      const updatedEventObj = Object.assign({}, resizeObj, updates);
      this.props.setResizeObj(updatedEventObj);
      this.props.updateEvent(updatedEventObj);
    }
    // handle the logic if an event is being dragged
    const draggedObj = this.props.draggedObj;
    if (!isEmpty(draggedObj)) {
      const eventLength = draggedObj.end.diff(draggedObj.start, 'minutes');
      const end = date.add(eventLength, 'minutes');
      const updates = {
        start: date.thaw(),
        end,
      }
      const updatedEventObj = Object.assign({}, draggedObj, updates);
      this.props.setResizeObj(updatedEventObj);
      this.props.updateEvent(updatedEventObj);
    }
  }

  handleCalClick(date) {
    if (!isEmpty(this.props.editorObj)) {
      this.props.editorOff();
      return;
    }
    if (!isEmpty(this.props.draggedObj)) {
      this.props.setDraggedObj({});
      return;
    }
    if (!isEmpty(this.props.resizeObj)) {
      this.props.setResizeObj({});
      return;
    }

    // create a new event
    const defaultCalendarList = this.props.eventsMap['Petra'].calendarList;
    const defaultCalendar = defaultCalendarList['You'];
    const eventIds = Object.keys(defaultCalendar.eventsMap);

    const id = (parseInt(eventIds[eventIds.length - 1]) + 1).toString();
    const name = 'New Event';
    const calendarGroup = 'Petra';
    const calendarId = 'You';
    const location = 'Dwinelle 140';
    const start = date;
    const end = date.clone().add(30, 'minutes');
    const isAllDayEvent = false;
    const eventObj = {
      id,
      name,
      calendarGroup,
      calendarId,
      location,
      start,
      end,
      isAllDayEvent,
    };
    this.props.addEvent(eventObj);
    this.props.editorOn(eventObj);
  }

  handleCalMouseUp() {
    this.shouldEndDrag();
    this.shouldEndResize();
  }

  // checks if an element should be dropped on MouseUp event
  shouldEndDrag() {
    const draggedObj = this.props.draggedObj;
    if (!isEmpty(draggedObj)) {
      this.props.setDraggedObj({});
      togglePointerEvents(this.props.eventsMap, true);
    }
  }

  // checks if an alement should end resizing on MouseUp event
  shouldEndResize() {
    const resizeObj = this.props.resizeObj;
    if (!isEmpty(resizeObj)) {
      this.props.setResizeObj({});
      togglePointerEvents(this.props.eventsMap, true);
    }
  }

  render() {

    const selectedDate = this.props.selectedDate.freeze();
    let dateSource = getWeekStartDate(selectedDate).hours(0).minutes(0).seconds(0);
    const calendarRows = [];
    for (let calendarRow = 0; calendarRow < 24; calendarRow += 0.5) {
      const cells = [];
      let time = dateSource.format('h A');
      if (dateSource.minutes() !== 0) {
        time = '';
      }
      const timeCell = (
        <div key={time} className="time-column">
          <span>{time}</span>
        </div>
      );
      cells.push(timeCell);
      for (let dateSourceCopy = dateSource; cells.length < 8; dateSourceCopy = dateSourceCopy.add(1, 'day')) {
        let active = ''
        if (isSameDay(selectedDate, dateSourceCopy)) {
          active = 'active';
        }
        const cell = (
          <div
            key={genUniqueIdentifier([dateSourceCopy.toISOString()])}
            className={"item " + active }
            onMouseEnter={() => this.handleCalMouseEnter(dateSourceCopy.thaw())}
            onMouseUp={() => this.handleCalMouseUp()}
            onClick={() => this.handleCalClick(dateSourceCopy.thaw())}
          />
        )
        cells.push(cell);
      }
      const rowKey = genUniqueIdentifier(['start-', calendarRow, dateSource.toISOString()]);
      const row = ( <div key={rowKey} className="row">{cells}</div> );
      calendarRows.push(row);
      dateSource = dateSource.add(30, 'minutes');
    }

    const eventsMap = this.props.eventsMap;
    const calendarGroups = Object.keys(eventsMap);
    // iterate over the different calender groups
    let visibleEventsList = calendarGroups.map(group => {
      const calendars = Object.keys(eventsMap[group].calendarList);
      const visibleCalendarLists = calendars.filter(calendar => eventsMap[group].calendarList[calendar].visible);
      // iterate over the visible calendar lists in the group
      return visibleCalendarLists.map(calendar => {
        const calendarEventsMap = eventsMap[group].calendarList[calendar].eventsMap;
        const eventIds = Object.keys(calendarEventsMap);
        const eventsList = eventIds.map(id => calendarEventsMap[id]);
        return eventsList.filter(event => !event.isAllDayEvent && isSameWeek(event.start, selectedDate));
      });
    });
    visibleEventsList = _.flattenDeep(visibleEventsList);
    visibleEventsList = _.sortBy(visibleEventsList, [(eventObj) => (parseInt(eventObj.start.format('H')))]);

    const events = visibleEventsList.map((eventObj) => (
      <WeekEvent
        key={genUniqueIdentifier([eventObj.id, eventObj.name])}
        eventsMap={eventsMap}
        handleEventClick={this.handleEventClick}
        handleEventDrag={this.handleEventDrag}
        handleEventResize={this.handleEventResize}
        eventObj={eventObj}
      />
    ));

    if (visibleEventsList.length !== 0) {
      const earliestEvent = visibleEventsList[0];
      const anchorPosition = getEventPosition(earliestEvent);
      const scrollAnchor = (
        <div
          key="anchor"
          id="calendar-week-scroll-anchor"
          className="calendar-week-scroll-anchor"
          style={anchorPosition}
        />
      );
      events.push(scrollAnchor);
    }

    return (
      <div
        id="main-calendar-week"
        className="main-calendar"
      >
        {calendarRows}
        {events}
        <Editor />
      </div>
    );
  }
}

CalendarWeekView.propTypes = {
  selectedDate: React.PropTypes.object.isRequired,
  resizeObj: React.PropTypes.object.isRequired,
  draggedObj: React.PropTypes.object.isRequired,
  editorObj: React.PropTypes.object.isRequired,
  eventsMap: React.PropTypes.object.isRequired,
  editorOn: React.PropTypes.func.isRequired,
  editorOff: React.PropTypes.func.isRequired,
  setDraggedObj: React.PropTypes.func.isRequired,
  updateEvent: React.PropTypes.func.isRequired,
  addEvent: React.PropTypes.func.isRequired,
  setResizeObj: React.PropTypes.func.isRequired,
};
