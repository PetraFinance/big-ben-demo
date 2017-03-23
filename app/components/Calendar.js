import React from 'react'
import Editor from './editor'
import { genTimeMap, computeTimeFromValue, isEmpty, genSimpleCells, getEventEntryDOM, getMapValues } from '../helpers/helpers'
import { getEventPosition } from '../helpers/position'
import $ from "jquery"
import _ from "lodash"
import moment from 'moment'

export default class Calendar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      resizeObj: {},
      draggedObj: {},
    }
    this.handleCellClick = this.handleCellClick.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);
    this.shouldEventDrop = this.shouldEventDrop.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.startResize = this.startResize.bind(this);
    this.handleEventClick = this.handleEventClick.bind(this);
    this.handleEditorUpdates = this.handleEditorUpdates.bind(this);
  }

  handleEditorUpdates(eventObj) {
    this.props.updateEvent(eventObj);
    // the editor changed the eventsMap, need to update this component
    this.forceUpdate();
  }

  handleMouseEnter(day, startValue, evt) {
    const draggedObj = this.state.draggedObj;
    const resizeObj = this.state.resizeObj;
    if (!isEmpty(resizeObj)) {
      const id = resizeObj.id;
      // the value that this cell represents should be the one the event now ends at
      const endValue = startValue + 0.5;
      startValue = resizeObj.startValue;
      day = resizeObj.day;
      // prevent an event from ending before it starts in case the user drags above the event
      if (endValue < startValue) {
        return;
      }
      const startTime = resizeObj.startTime;
      const endTime = computeTimeFromValue(endValue);
      const name = resizeObj.name;
      const calendar = resizeObj.calendar;
      const category = resizeObj.category;
      const location = resizeObj.location;
      const eventObj = {
        id,
        name,
        category,
        location,
        calendar,
        startTime,
        endTime,
        startValue,
        endValue,
        day
      };
      this.props.updateEvent(eventObj);
    }
    if (!isEmpty(draggedObj)) {
      const id = draggedObj.id;
      const endValue = startValue + Math.abs(draggedObj.startValue - draggedObj.endValue);
      const startTime = computeTimeFromValue(startValue);
      const endTime = computeTimeFromValue(endValue);
      const name = draggedObj.name;
      const calendar = draggedObj.calendar;
      const category = draggedObj.category;
      const location = draggedObj.location;
      const eventObj = {
        id,
        name,
        category,
        location,
        calendar,
        startTime,
        endTime,
        startValue,
        endValue,
        day
      };
      this.props.updateEvent(eventObj);
    }
  }

  startResize(eventObj, evt) {
    evt.preventDefault();
    this.setState({ resizeObj: eventObj }, () => {
      // async disable pointer events on the target
      // allows you to move an event into a cell which it covers
      const numEvents = this.props.nextAvaliableId;
      for (let id=0; id < numEvents; id++) {
        const eventEntryDOM = getEventEntryDOM(id);
        $(eventEntryDOM).css("pointer-events", "none");
      }
    });
    this.props.editorOff();
  }

  handleCellClick(day, startValue) {
    if (this.props.editor !== -1) {
      // turn editor off if clicking outside the editor
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
      category,
      calendar,
      location,
      startTime,
      endTime,
      startValue,
      endValue,
      day
    };
    this.props.addEvent(eventObj);
  }

  handleMouseUp(day, startValue, target) {
    this.shouldEventDrop(day, startValue);
    this.shouldEndResize();
  }

  // checks if an element should be dropped on MouseUp event
  shouldEventDrop(day, startValue) {
    const draggedObj = this.state.draggedObj;
    if (draggedObj) {
      this.setState({ draggedObj: {} }, () => {
        const numEvents = this.props.nextAvaliableId;
        for (let id=0; id < numEvents; id++) {
          const eventEntryDOM = getEventEntryDOM(id);
          $(eventEntryDOM).css("pointer-events", "");
        }
      });
    }
  }

  // checks if an alement should end resizing on MouseUp event
  shouldEndResize() {
    const resizeObj = this.state.resizeObj;
    if (resizeObj) {
      this.setState({ resizeObj: {} }, () => {
        const numEvents = this.props.nextAvaliableId;
        for (let id=0; id < numEvents; id++) {
          const eventEntryDOM = getEventEntryDOM(id);
          $(eventEntryDOM).css("pointer-events", "");
        }
      });
    }
  }

  // Fired on DragStart event, used to set the draggedObj in state
  handleDragStart(eventObj, target, evt) {
    // need to prevent default of sometimes mouse up doesn't fire when the element is dropped
    evt.preventDefault();
    this.setState({ draggedObj: eventObj }, () => {
      // async disable pointer events on the target
      // allows you to move an event into a cell which it covers
      const numEvents = this.props.nextAvaliableId;
      for (let id=0; id < numEvents; id++) {
        const eventEntryDOM = getEventEntryDOM(id);
        $(eventEntryDOM).css("pointer-events", "none");
      }
    });
    // turn the editor off if it's on during a drag
    this.props.editorOff();
  }

  // Turn the editor on by passing it the event id to edit
  handleEventClick(eventObj) {
    this.props.editorOn(eventObj.id);
  }

  render () {
    const plugins = [ "Trello", "Todoist" ];
    const integrations = plugins.map((plugin, i) => (
      <div className="row" key={i}>
        <div className="plugin">
          <span>{plugin}</span>
        </div>
        {genSimpleCells()}
      </div>
    ));

    const activeDate = moment(this.props.activeDate);
    let dateObj = activeDate.clone();
    dateObj.subtract(activeDate.day(), 'days');
    const currentWeekDays = [];
    for (let i=0; i < 7; i++) {
      let formatted = moment(dateObj).format('MM/DD');
      if (formatted[0] === '0') {
        formatted = formatted.slice(1);
      }
      currentWeekDays.push(formatted);
      dateObj.add(1, 'days');
    }

    const days = moment.weekdays();
    const rowHeaders = days.map((day, i) => (
      <div className="item" key={i}><span>{day.slice(0, 3) + ' ' + currentWeekDays[i]}</span></div>
    ));

    const times = genTimeMap();
    const hours = times.filter(timeObj => !timeObj.time.includes(":30"));
    const rows = hours.map((timeObj, i) => {
      const whole_hours_jsx = days.map((day, i) => (
        <div
          key={i}
          className={"item " + day.toString() + ' ' + timeObj.value.toString()}
          onMouseEnter={(evt) => this.handleMouseEnter(day, timeObj.value, evt)}
          onMouseUp={(evt) => this.handleMouseUp(day, timeObj.value, evt.target)}
          onClick={() => this.handleCellClick(day, timeObj.value)}
        >
        </div>
      ));
      const increment = timeObj.value + 0.5;
      const half_hours_jsx = days.map((day, i) => (
        <div
          key={i}
          className={"item " + day.toString() + ' ' + increment.toString()}
          onMouseEnter={(evt) => this.handleMouseEnter(day, increment, evt)}
          onMouseUp={(evt) => this.handleMouseUp(day, increment, evt.target)}
          onClick={() => this.handleCellClick(day, increment)}
        >
        </div>
      ));
      return (
        <div key={i}>
          <div className="row">
            <div className="time">
              <span>{timeObj.time}</span>
            </div>
            {whole_hours_jsx}
          </div>
          <div className="row half-hour">
            <div className="time"></div>
            {half_hours_jsx}
          </div>
        </div>
      );
    });

    const calendarMap = this.props.calendarMap;
    const eventsMap = this.props.eventsMap;
    const packagedEvents = Object.entries(eventsMap);
    const eventsJSX = packagedEvents.map((packagedEvent) => {
      const id = packagedEvent[0];
      const eventObj = packagedEvent[1];
      const startTime = eventObj.startTime;
      const endTime = eventObj.endTime;
      const length = Math.abs(eventObj.endValue - eventObj.startValue) * 10;
      const start = eventObj.startTime.replace(":", "").replace(" ", "");

      const color = { backgroundColor: calendarMap[eventObj.calendar]["color"] };
      const accent = { backgroundColor: calendarMap[eventObj.calendar]["accent"] };
      const eventEntryStyle = Object.assign(
        getEventPosition(eventObj),
        color
      );

      const timeInfo = (
        <div className="start-end-times">
          {startTime.replace(" ", "").toLowerCase()}-{endTime.replace(" ", "").toLowerCase()}
        </div>
      );
      const locationInfo = (
        <div className="location">
          {eventObj.location}
        </div>
      );

      return (
        <div
          key={id}
          id={id.toString()}
          className="event-entry"
          style={eventEntryStyle}
        >
          <div
            className="content-wrapper"
            draggable="true"
            onDragStart={(evt) => this.handleDragStart(eventObj, evt.target, evt)}
            onClick={() => this.handleEventClick(eventObj)}
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
          <div className="resizer"
            draggable="true"
            onMouseDown={(evt) => this.startResize(eventObj, evt)}
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
          {genSimpleCells()}
        </div>
        <div id="main-calendar" className="main-calendar">
          {rows}
          {eventsJSX}
          <Editor
            id={this.props.editor}
            calendarMap={this.props.calendarMap}
            eventsMap={this.props.eventsMap}
            updateEvent={this.handleEditorUpdates}
          />
        </div>
        <div className="integrations-calendar">
          {integrations}
        </div>
      </div>
    );
  }
}
