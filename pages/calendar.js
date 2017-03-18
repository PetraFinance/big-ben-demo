import React from 'react'

import Editor from './editor';
import { genSimpleCells } from './calendar/simpleCells';
import { genTimeMap, computeTimeFromValue } from './calendar/helpers';
import $ from "jquery";

export default class Calendar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      beingDragged: null,
      next_id: 1,
      editorPosition: null,
      calendarMap: {
        "Innovative Design": {
          color: "#009688",
          accent: "#008A7D",
        },
        "IEEE": {
          color: "#F44336",
          accent: "#E03D31",
        },
        "School": {
          color: "#03A9F4",
          accent: "#029BE0",
        },
        "Events I'm Attending": {
          color: "#39579A",
          accent: "#39579A",
        },
      },
      events: [
        {
          id: 0,
          name: "Innod Meeting",
          category: "Google",
          calendar: "Innovative Design",
          location: "Dwinelle 140",
          startTime: "7 AM",
          endTime: "9:00 AM",
          startValue: 7,
          endValue: 9,
          day: "Mon",
        },
      ],
    }
  }

  createEvent = (day, startValue) => {
    const id = this.state.next_id;
    let next_id = id + 1;
    this.setState({ next_id });
    const endValue = startValue + 0.5;
    const startTime = computeTimeFromValue(startValue);
    const endTime = computeTimeFromValue(endValue);
    const name = "default";
    const category = "Google";
    const calendar = "Innovative Design";
    const location = "Dwinelle 140";
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
    this.setState({events: this.state.events.concat([eventObj])});
    return eventObj;
  }

  dismissEditor = () => {
    this.setState({ editorPosition: null });
  }

  handleCellClick = (day, startValue, evt) => {
    if (this.state.editorPosition) {
      // turn editor off if clicking outside the editor
      this.dismissEditor();
      return;
    }
    // create the event, recreate the className to select the new event
    // need to wait for the state to update first
    const promiseEventObj = (self) => (
      new Promise(function(resolve, reject) {
        const eventObj = self.createEvent(day, startValue);
        if (eventObj) {
          resolve(eventObj);
        } else {
          reject(new Error(eventObj));
        }
      })
    );

    promiseEventObj(this).then((eventObj) => {
      const length = Math.abs(eventObj.endValue - eventObj.startValue) * 10;
      const start = eventObj.startTime.replace(":", "").replace(" ", "");
      const key = eventObj.id;
      const className = 'event-entry start-' + start + ' ' + day + ' ' + 'length-' + length.toString();
      const eventEntryDOMs = document.getElementsByClassName('event-entry');
      const mostRecentEventEntryDOM = eventEntryDOMs[eventEntryDOMs.length - 1];
      this.toggleEditor(eventObj, mostRecentEventEntryDOM, true);
    }, (error) => {
      console.log(error);
    });
  }


  checkElementShouldDrop = (day, startValue) => {
    // check if element is being dragged
    const dragged = this.state.draggedObj;
    if (!dragged) { return; }
    // copy the contents of the element being dropped and then remove it from the events list, re-add the new event
    const id = dragged.id;
    const events = this.state.events;
    const filtered = events.filter(event => event.id !== id);
    const endValue = startValue + Math.abs(dragged.startValue - dragged.endValue);
    const startTime = computeTimeFromValue(startValue);
    const endTime = computeTimeFromValue(endValue);
    const name = dragged.name;
    const calendar = dragged.calendar;
    const category = dragged.category;
    const location = dragged.location;
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
    this.setState({ events: filtered.concat([eventObj]) });
    this.setState({ draggedObj: null });
  }

  handleMouseUp = (day, startValue) => {
    this.checkElementShouldDrop(day, startValue);
  }

  handleDragBehavior = (eventObj) => {
    this.setState({ draggedObj: eventObj });
    // turn the editor off if it's on during a drag
    this.dismissEditor();
  }

  // in order to bring up the editor, we need to know the object we are editing and its position on the page, so we can appropriately position the editor relative to it
  // you must pass in the eventObj and the eventEntryDOM for jQuery offset() to use
  toggleEditor = (eventObj, eventEntryDOM, newEvent) => {
    // first calculate the editor position
    const day = eventObj.day;
    const startTime = eventObj.startTime;
    const calendarWidth = document.getElementById('main-calendar').clientWidth;
    const calendarHeight = document.getElementById('main-calendar').clientHeight;
    let eventEntry = eventEntryDOM;
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
    if (top < 10) {
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
      const hours_jsx = days.map((day, i) => (
        <div
          key={i}
          className="item"
          onMouseUp={() => this.handleMouseUp(day, timeObj.value)}
          onClick={() => this.handleCellClick(day, timeObj.value)}
        >
        </div>
      ));
      const increment = timeObj.value + 0.5;
      const half_hours_jsx = days.map((day, i) => (
        <div
          key={i}
          className="item"
          onMouseUp={() => this.handleMouseUp(day, increment)}
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
            {hours_jsx}
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
      const calendarMap = this.state.calendarMap;

      if (editorPosition) {
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

    const events = this.state.events;
    const calendarMap = this.state.calendarMap;

    let eventsList = [];
    for (let eventObj of events) {
      const day = eventObj.day;
      const startTime = eventObj.startTime;
      const endTime = eventObj.endTime;
      const length = Math.abs(eventObj.endValue - eventObj.startValue) * 10;
      const start = eventObj.startTime.replace(":", "").replace(" ", "");
      const className = 'event-entry start-' + start + ' ' + day + ' ' + 'length-' + length.toString();
      const key = eventObj.id;
      const color = calendarMap[eventObj.calendar]["color"];
      const accent = calendarMap[eventObj.calendar]["accent"];
      const eventEntryStyle = {
        backgroundColor: color,
      }
      const eventSideBarStyle = {
        backgroundColor: accent,
      }
      const eventjsx = (
        <div
          key={key}
          draggable="true"
          className={className}
          style={eventEntryStyle}
          onDragStart={() => this.handleDragBehavior(eventObj)}
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
            <div className="start-end-times">
              {startTime.replace(" ", "").toLowerCase()}-{endTime.replace(" ", "").toLowerCase()}
            </div>
            <div className="location">
              {eventObj.location}
            </div>
          </div>
        </div>
      );
      eventsList.push(eventjsx);
    }

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
          {eventsList}
          {genEventEditor()}
        </div>
        <div className="integrations-calendar">
          {integrations}
        </div>
      </div>
    );
  }
}
