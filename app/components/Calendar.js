import React from 'react';
import moment from 'moment';
import Editor from '../containers/Editor';
import Event from '../components/Event';
import { togglePointerEvents, genUniqueIdentifier } from '../helpers/html';
import { isEmpty } from '../helpers/objects';
import { genTimesList, computeTimeFromInt, getWeekStartDate, sameWeek } from '../helpers/time';

export default class Calendar extends React.Component {

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

  handleCalMouseEnter(day, date, startValue) {
    const resizeObj = this.props.resizeObj;
    if (!isEmpty(resizeObj)) {
      const endValue = startValue + 0.5;
      const updatedStartValue = resizeObj.startValue;
      if (endValue < startValue) {
        return;
      }
      const eventObj = {
        id: resizeObj.id,
        day: resizeObj.day,
        date: resizeObj.date,
        name: resizeObj.name,
        category: resizeObj.category,
        location: resizeObj.location,
        calendar: resizeObj.calendar,
        startTime: resizeObj.startTime,
        endTime: computeTimeFromInt(endValue),
        startValue: updatedStartValue,
        endValue,
      };
      this.props.updateEvent(eventObj);
    }
    const draggedObj = this.props.draggedObj;
    if (!isEmpty(draggedObj)) {
      const endValue = startValue + Math.abs(draggedObj.startValue - draggedObj.endValue);
      const eventObj = {
        id: draggedObj.id,
        name: draggedObj.name,
        category: draggedObj.category,
        location: draggedObj.location,
        calendar: draggedObj.calendar,
        startTime: computeTimeFromInt(startValue),
        endTime: computeTimeFromInt(endValue),
        startValue,
        endValue,
        day,
        date,
      };
      this.props.updateEvent(eventObj);
    }
  }

  handleCalClick(day, date, startValue) {
    if (this.props.editorObj.id !== '-1') {
      this.props.editorOff();
      return;
    }
    // create a new event
    const endValue = startValue + 0.5;
    const startTime = computeTimeFromInt(startValue);
    const endTime = computeTimeFromInt(endValue);
    const name = 'New Event';
    const category = 'Google';
    const calendar = 'Innovative Design';
    const location = 'Dwinelle 140';
    const numEvents = Object.keys(this.props.eventsMap);
    const id = (parseInt(numEvents[numEvents.length - 1]) + 1).toString();
    const eventObj = {
      id,
      name,
      day,
      date,
      category,
      calendar,
      location,
      startTime,
      endTime,
      startValue,
      endValue,
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
    const plugins = ['Trello', 'Todoist'];
    const integrations = plugins.map((plugin, i) => (
      <div className="row" key={genUniqueIdentifier([i, plugin])}>
        <div className="plugin">
          <span>{plugin}</span>
        </div>
        <div className="item" />
        <div className="item" />
        <div className="item" />
        <div className="item" />
        <div className="item" />
        <div className="item" />
        <div className="item" />
      </div>
    ));

    let activeDate = this.props.activeDate.clone();
    const activeDay = activeDate.format('dddd');
    let dateObj = getWeekStartDate(activeDate);

    const momentDateObjects = [];
    const formattedDateObjects = [];

    for (let i = 0; i < 7; i += 1) {
      const formatted = dateObj.format('ddd M/D');
      formattedDateObjects.push(formatted);
      momentDateObjects.push(dateObj);
      dateObj = dateObj.clone().add(1, 'days');
    }

    const days = moment.weekdays();
    const rowHeaders = days.map((day, i) => {
      let className = 'item';
      if (day === activeDay) {
        className = 'item active';
      }
      const date = formattedDateObjects[i];
      return (
        <div
          onClick={() => this.props.setActiveDate(momentDateObjects[i])}
          className={className}
          key={genUniqueIdentifier([date, i])}
        >
          <span>{date}</span>
        </div>
      );
    });

    const times = genTimesList();
    const hours = times.filter(timeObj => !timeObj.time.includes(':30'));
    const calendarRows = hours.map((timeObj) => {
      const wholeHours = days.map((day, i) => {
        let className = 'item';
        if (day === activeDay) {
          className = 'item active';
        }
        const momentObj = momentDateObjects[i];
        return (
          <div
            key={genUniqueIdentifier([day, timeObj.value, i])}
            className={className}
            onMouseEnter={() => this.handleCalMouseEnter(day, momentObj, timeObj.value)}
            onMouseUp={() => this.handleCalMouseUp()}
            onClick={() => this.handleCalClick(day, momentObj, timeObj.value)}
          />
        );
      });
      const halfHours = days.map((day, i) => {
        let className = 'item';
        if (day === activeDay) {
          className = 'item active';
        }
        const momentObj = momentDateObjects[i];
        return (
          <div
            key={genUniqueIdentifier([day, timeObj.value + 0.5, i])}
            className={className}
            onMouseEnter={() => this.handleCalMouseEnter(day, momentObj, timeObj.value + 0.5)}
            onMouseUp={() => this.handleCalMouseUp()}
            onClick={() => this.handleCalClick(day, momentObj, timeObj.value + 0.5)}
          />
        );
      });
      return (
        <div key={genUniqueIdentifier([timeObj.value, timeObj.value + 0.5])}>
          <div className="row">
            <div className="time">
              <span>{timeObj.time}</span>
            </div>
            {wholeHours}
          </div>
          <div className="row half-hour">
            <div className="time" />
            {halfHours}
          </div>
        </div>
      );
    });

    activeDate = this.props.activeDate.clone();

    const eventsMap = this.props.eventsMap;
    const idList = Object.keys(eventsMap);
    const eventsList = [];

    for (const id of idList) {
      const eventObj = eventsMap[id];
      const eventDate = eventObj.date;
      if (!sameWeek(eventDate, activeDate)) {
        continue;
      }
      eventsList.push(eventObj);
    }

    const eventEntries = eventsList.map((eventObj) => {
      const calendarMap = this.props.calendarMap;
      console.log(calendarMap);
      console.log(eventObj);
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
        <Event
          key={genUniqueIdentifier([eventObj.id, eventObj.name])}
          calendarMap={calendarMap}
          handleEventClick={this.handleEventClick}
          handleEventDrag={this.handleEventDrag}
          handleEventResize={this.handleEventResize}
          eventObj={eventObj}
        />
      );
    });

    const weekViewMode = (
      <div className="calendar-container-week" >
        <div className="column-headers">
          <div className="time" />
          {rowHeaders}
        </div>
        <div className="all-day-events">
          <div className="time">
            <span>ALL DAY</span>
          </div>
          <div className="item" />
          <div className="item" />
          <div className="item" />
          <div className="item" />
          <div className="item" />
          <div className="item" />
          <div className="item" />
        </div>
        <div
          className="main-calendar"
        >
          {calendarRows}
          {eventEntries}
          <Editor />
        </div>
        <div className="integrations-calendar">
          {integrations}
        </div>
      </div>
    );

    const monthViewMode = (
      <div className="calendar-container-month">
        <p>Coming soon.</p>
      </div>
    );

    return (
      <div style={{'height': '100%', 'width': '100%'}}>
        { this.props.calendarViewMode === "week" ? weekViewMode : monthViewMode }
      </div>
    );
  }
}

Calendar.propTypes = {
  calendarMap: React.PropTypes.object.isRequired,
  activeDate: React.PropTypes.object.isRequired,
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
