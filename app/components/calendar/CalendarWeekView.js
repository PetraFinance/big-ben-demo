import React from 'react';
import moment from 'frozen-moment';
import _ from 'lodash';
import { togglePointerEvents, genUniqueIdentifier, genObjectId } from '../../helpers/html';
import { isEmpty } from '../../helpers/objects';
import { genTimesOfDay, computeTimeFromInt, getWeekStartDate, sameWeek } from '../../helpers/time';
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
    const id = eventObj.id;
    this.props.editorOn(id);
  }

  handleCalMouseEnter(date) {
    // handle the logic if an event is being resized
    const resizeObj = this.props.resizeObj;
    if (!isEmpty(resizeObj)) {
      const updates = { end: date.add(30, 'minutes'), };
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
        start: date,
        end,
      }
      const updatedEventObj = Object.assign({}, draggedObj, updates);
      this.props.setResizeObj(updatedEventObj);
      this.props.updateEvent(updatedEventObj);
    }
  }

  handleCalClick(date) {
    if (this.props.editorObj.id !== '-1') {
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
    const usedEventIds = Object.keys(this.props.eventsMap);
    const id = (parseInt(usedEventIds[usedEventIds.length - 1]) + 1).toString();
    const name = 'New Event';
    const category = 'Google';
    const calendar = 'Innovative Design';
    const location = 'Dwinelle 140';
    const start = date;
    const end = date.clone().add(30, 'minutes');
    const isAllDayEvent = false;
    const eventObj = {
      id,
      name,
      category,
      calendar,
      location,
      start,
      end,
      isAllDayEvent,
    };
    this.props.addEvent(eventObj);
    this.props.editorOn(eventObj.id);
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
        const cell = (
          <div
            key={genUniqueIdentifier([dateSourceCopy.toISOString()])}
            className={"item " + dateSourceCopy.format('h:mm')}
            onMouseEnter={() => this.handleCalMouseEnter(dateSourceCopy)}
            onMouseUp={() => this.handleCalMouseUp()}
            onClick={() => this.handleCalClick(dateSourceCopy)}
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
    const calendarMap = this.props.calendarMap;
    const ids = Object.keys(eventsMap);
    let eventsList = [];
    for (const id of ids) {
      const eventObj = eventsMap[id];
      const eventStartDate = eventObj.start;
      if (!sameWeek(eventStartDate, selectedDate) || eventObj.isAllDayEvent) {
        continue;
      }
      eventsList.push(eventObj);
    }

    eventsList = _.sortBy(eventsList, [(eventObj) => (parseInt(eventObj.start.format('H')))]);

    const events = eventsList.map((eventObj) => {
      const visible = calendarMap[eventObj.category][eventObj.calendar].visible;
      if (!visible) {
        return (
          <div
            key={'hidden-' + eventObj.id}
            className="hidden-event-placeholder"
          />
        );
      }
      return (
        <WeekEvent
          key={genUniqueIdentifier([eventObj.id, eventObj.name])}
          calendarMap={calendarMap}
          handleEventClick={this.handleEventClick}
          handleEventDrag={this.handleEventDrag}
          handleEventResize={this.handleEventResize}
          eventObj={eventObj}
        />
      );
    });

    if (eventsList.length !== 0) {
      const earliestEvent = eventsList[0];
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
  calendarMap: React.PropTypes.object.isRequired,
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
