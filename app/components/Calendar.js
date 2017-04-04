import React from 'react'
import Editor from '../containers/editor'
import Event from '../components/event';

import { togglePointerEvents, generateObjectKey } from '../helpers/html';
import { isEmpty } from '../helpers/objects';
import { getEventPosition } from '../helpers/position';
import { genTimesList, computeTimeFromValue, getWeekStartFromDate, getWeekEndFromDate } from '../helpers/time';

import $ from "jquery"
import moment from 'moment'

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
      startValue = resizeObj.startValue;
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
        endTime: computeTimeFromValue(endValue),
        startValue,
        endValue,
      };
      this.props.updateEvent(eventObj);
    }
    const draggedObj = this.props.draggedObj;
    if (!isEmpty(draggedObj)) {
      const endValue = startValue + Math.abs(draggedObj.startValue - draggedObj.endValue);
      const endTime = computeTimeFromValue(endValue);
      const eventObj = {
        id: draggedObj.id,
        name: draggedObj.name,
        category: draggedObj.category,
        location: draggedObj.location,
        calendar: draggedObj.calendar,
        startTime: computeTimeFromValue(startValue),
        endTime: computeTimeFromValue(endValue),
        startValue,
        endValue,
        day,
        date,
      };
      this.props.updateEvent(eventObj);
    }
  }

  handleCalClick(day, date, startValue) {
    if (this.props.editorObj.id !== -1) {
      this.props.editorOff();
      return;
    }
    // create a new event
    const endValue = startValue + 0.5;
    const startTime = computeTimeFromValue(startValue);
    const endTime = computeTimeFromValue(endValue);
    const name = "New Event";
    const category = "Google";
    const calendar = "Innovative Design";
    const location = "Dwinelle 140";
    const id = this.props.nextAvaliableId;
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
  }

  handleCalMouseUp(day, startValue) {
    this.shouldEndDrag(day, startValue);
    this.shouldEndResize();
  }

  // checks if an element should be dropped on MouseUp event
  shouldEndDrag(day, startValue) {
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

  render () {
    const plugins = [ "Trello", "Todoist" ];
    const integrations = plugins.map((plugin, i) => (
      <div className="row" key={generateObjectKey([i, plugin])}>
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

    const activeDate = this.props.activeDate;
    const activeDay = activeDate.clone().format('dddd');
    let dateObj = getWeekStartFromDate(activeDate);

    const momentDateObjects = [];
    const formattedDateObjects = [];

    for (let i=0; i < 7; i++) {
      let formatted = dateObj.format('MM/DD');
      if (formatted[0] === '0') {
        formatted = formatted.slice(1);
      }
      formattedDateObjects.push(formatted);
      momentDateObjects.push(dateObj);
      dateObj = dateObj.clone().add(1, 'days');
    }

    const days = moment.weekdays();
    const rowHeaders = days.map((day, i) => {
      let className = "item";
      if (day === activeDay) {
        className = "item active";
      }
      const date = formattedDateObjects[i];
      const abbr = day.slice(0, 3) + ' ' + date;
      return (
        <div className={className} key={generateObjectKey([ date ])}>
          <span>{abbr}</span>
        </div>
      );
    });

    const times = genTimesList();
    const hours = times.filter(timeObj => !timeObj.time.includes(":30"));
    console.log(activeDay);
    console.log(days);
    const calendarRows = hours.map((timeObj, i) => {
      const whole_hours_jsx = days.map((day, i) => {
        let className = "item";
        if (day === activeDay) {
          className = "item active";
        }
        return (
          <div
            key={generateObjectKey([day, timeObj.value])}
            className={className}
            onMouseEnter={() => this.handleCalMouseEnter(day, momentDateObjects[i], timeObj.value)}
            onMouseUp={() => this.handleCalMouseUp(day, timeObj.value)}
            onClick={() => this.handleCalClick(day, momentDateObjects[i], timeObj.value)}
          />
        );
      });
      const half_hours_jsx = days.map((day, i) => {
        let className = "item";
        if (day === activeDay) {
          className = "item active";
        }
        return (
          <div
            key={generateObjectKey([day, timeObj.value + 0.5])}
            className={className}
            onMouseEnter={() => this.handleCalMouseEnter(day, momentDateObjects[i], timeObj.value + 0.5)}
            onMouseUp={() => this.handleCalMouseUp(day, timeObj.value + 0.5)}
            onClick={() => this.handleCalClick(day, momentDateObjects[i], timeObj.value + 0.5)}
          />
        );
      });
      return (
        <div key={generateObjectKey([timeObj.value, timeObj.value + 0.5])}>
          <div className="row">
            <div className="time">
              <span>{timeObj.time}</span>
            </div>
            {whole_hours_jsx}
          </div>
          <div className="row half-hour">
            <div className="time" />
            {half_hours_jsx}
          </div>
        </div>
      );
    });

    const calendarMap = this.props.calendarMap;
    const eventsMap = this.props.eventsMap;
    const packagedEvents = Object.entries(eventsMap);

    const filteredPackagedEvents = packagedEvents.filter((packagedEvent) => {
      const eventObj = packagedEvent[1];
      const activeDate = this.props.activeDate;
      const eventDate = eventObj.date;
      const weekStart = getWeekStartFromDate(activeDate);
      const weekEnd =  getWeekEndFromDate(activeDate);
      const inBetween = eventDate.clone().isBetween(weekStart, weekEnd, null, '[]');
      return inBetween;
    });

    const eventEntries = filteredPackagedEvents.map((packagedEvent) => {
      const eventObj = packagedEvent[1];
      return (
        <Event
          key={generateObjectKey([eventObj.id, eventObj.name])}
          calendarMap={this.props.calendarMap}
          handleEventClick={this.handleEventClick}
          handleEventDrag={this.handleEventDrag}
          handleEventResize={this.handleEventResize}
          eventObj={eventObj}
        />
      );
    });

    return (
      <div className="calendar-container">
        <div className="column-headers">
          <div className="time"></div>
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
        <div id="main-calendar" className="main-calendar">
          {calendarRows}
          {eventEntries}
          <Editor />
        </div>
        <div className="integrations-calendar">
          {integrations}
        </div>
      </div>
    );
  }
}
