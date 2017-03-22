import React from 'react'
import Editor from './editor';
import { genTimeMap, computeTimeFromValue, isEmpty, genSimpleCells, getEventEntryDOM, getMapValues } from '../helpers/helpers';
import $ from "jquery";

export default class Calendar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      resizeObj: {},
      draggedObj: {},
      editorPosition: {},
    }
    this.dismissEditor = this.dismissEditor.bind(this);
    this.handleCellClick = this.handleCellClick.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);
    this.shouldEventDrop = this.shouldEventDrop.bind(this);
    this.toggleEditor = this.toggleEditor.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.startResize = this.startResize.bind(this);
  }

  // Dismisses the editor
  dismissEditor() {
    this.setState({ editorPosition: {} });
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
        const dummyEvent = { id };
        const eventEntryDOM = getEventEntryDOM(dummyEvent);
        $(eventEntryDOM).css("pointer-events", "none");
      }
    });
    this.dismissEditor();
  }

  handleCellClick(day, startValue) {
    if (!isEmpty(this.state.editorPosition)) {
      // turn editor off if clicking outside the editor
      this.dismissEditor();
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
          const dummyEvent = { id };
          const eventEntryDOM = getEventEntryDOM(dummyEvent);
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
          const dummyEvent = { id };
          const eventEntryDOM = getEventEntryDOM(dummyEvent);
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
        const dummyEvent = { id };
        const eventEntryDOM = getEventEntryDOM(dummyEvent);
        $(eventEntryDOM).css("pointer-events", "none");
      }
    });
    // turn the editor off if it's on during a drag
    this.dismissEditor();
  }


  // in order to bring up the editor, we need to know the object we are editing and its position on the page, so we can appropriately position the editor relative to it
  // you must pass in the eventObj and the eventEntryDOM for jQuery offset() to use
  toggleEditor(eventObj, eventEntryDOM, newEvent) {
    // first calculate the editor position
    const day = eventObj.day;
    const startTime = eventObj.startTime;
    const calendarWidth = document.getElementById('main-calendar').clientWidth;
    const calendarHeight = document.getElementById('main-calendar').clientHeight;
    let eventEntry = eventEntryDOM;
    // iterate up the DOM to the event entry parent
    while (!$(eventEntry).attr('class').includes('event-entry')) {
      eventEntry = $(eventEntry).parent();
    }
    let left, top;
    const eventWidth = $(eventEntry).width();
    const eventHeight = $(eventEntry).height();
    const eventPos = $(eventEntry).offset();
    const calendarPos = $(eventEntry).parent().offset();
    const eventOffset = {
        top: eventPos.top - calendarPos.top,
        left: eventPos.left - calendarPos.left
    }
    // checks if the editor is above or below a certain threshold on the screen and adjusts accordingly
    left = ((eventOffset.left + eventWidth + 15) / calendarWidth) * 100;
    if (left > 65) {
      left = ((eventOffset.left + eventWidth - 265 - (calendarWidth * 0.13)) / calendarWidth) * 100;
    }
    left = left.toString() + '%';
    top = Math.abs(eventOffset.top);
    if (top < 15) {
      top = top + 15;
    }
    top = top.toString() + 'px';
    this.setState({
      editorPosition: {
        left,
        top,
        newEvent,
        eventObj,
      }
    });
  }

  render () {

    const calendarMap = this.props.calendarMap;

    const plugins = [ "Trello", "Todoist" ];
    const integrations = plugins.map((plugin, i) => (
      <div className="row" key={i}>
        <div className="plugin">
          <span>{plugin}</span>
        </div>
        {genSimpleCells()}
      </div>
    ));

    const days = [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ];
    const rowHeaders = days.map((day, i) => (
      <div className="item" key={i}><span>{day}</span></div>
    ));

    const times = genTimeMap();
    const hours = times.filter(timeObj => !timeObj.time.includes(":30"));
    const rows = hours.map((timeObj, i) => {
      const whole_hours_jsx = days.map((day, i) => (
        <div
          key={i}
          className={"item " + day.toString() + timeObj.value.toString()}
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
          className={"item " + day.toString() + increment.toString()}
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

    const updateEditedEventObj = (editedEventObj) => {
      const id = editedEventObj.id;
      const filtered = events.filter(event => event.id !== id);
      this.setState({ events: filtered.concat([editedEventObj])});
    }

    const genEventEditor = () => {
      const editorPosition = this.state.editorPosition;

      if (!isEmpty(editorPosition)) {
        const eventEditorPosition = {
          top: editorPosition.top,
          left: editorPosition.left,
        }
        const eventObj = editorPosition.eventObj;
        const newEvent = editorPosition.newEvent;

        const color = calendarMap[eventObj.calendar]["color"];
        const editorColor = {
          backgroundColor: color,
        }

        return (
          <Editor
            eventObj={eventObj}
            newEvent={newEvent}
            eventEditorPosition={eventEditorPosition}
            updateEditedEventObj={updateEditedEventObj}
            calendarMap={calendarMap}
            editorColor={editorColor}
          />
        );
      }
      return ( <div /> );
    }

    const packagedEvents = Object.entries(this.props.eventsMap);
    const eventsJSX = packagedEvents.map((packagedEvent) => {
      const id = packagedEvent[0];
      const eventObj = packagedEvent[1];
      const day = eventObj.day;
      const startTime = eventObj.startTime;
      const endTime = eventObj.endTime;
      const length = Math.abs(eventObj.endValue - eventObj.startValue) * 10;
      const start = eventObj.startTime.replace(":", "").replace(" ", "");
      const className = 'event-entry start-' + start + ' ' + day + ' ' + 'length-' + length.toString();
      const color = calendarMap[eventObj.calendar]["color"];
      const accent = calendarMap[eventObj.calendar]["accent"];
      const eventEntryStyle = {
        backgroundColor: color,
      }
      const eventSideBarStyle = {
        backgroundColor: accent,
      }
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
          className={className}
          style={eventEntryStyle}
        >
          <div
            className="content-wrapper"
            draggable="true"
            onDragStart={(evt) => this.handleDragStart(eventObj, evt.target, evt)}
            onClick={(evt) => this.toggleEditor(eventObj, evt.target, false)}
          >
            <div
              className="sidebar"
              style={eventSideBarStyle}
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
            style={eventEntryStyle}
            onMouseDown={(evt) => this.startResize(eventObj, evt)}
          >
            <div
              className="sidebar"
              style={eventSideBarStyle}
            />
            <div
              className="filler"
              style={eventEntryStyle}
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
          {genEventEditor()}
        </div>
        <div className="integrations-calendar">
          {integrations}
        </div>
      </div>
    );
  }
}
