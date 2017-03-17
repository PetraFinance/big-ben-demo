import React from 'react'
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
      events: [
        {
          id: 0,
          name: "Stat 101 Lecture",
          calendar: "Google",
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
    const endValue = startValue + 0.5 ;
    const startTime = computeTimeFromValue(startValue);
    const endTime = computeTimeFromValue(endValue);
    const name = "default";
    const calendar = "Google";
    const eventObj = {
      id,
      name,
      calendar,
      startTime,
      endTime,
      startValue,
      endValue,
      day
    };
    this.setState({events: this.state.events.concat([eventObj])});
    return eventObj;
  }

  handleClick = (day, startValue, evt) => {
    if (this.state.editorPosition) {
      this.setState({ editorPosition: null });
      return;
    }
    // create the event, recreate the className to select the new event

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
      this.toggleEditor(day, eventObj.startValue, eventObj, mostRecentEventEntryDOM);
    }, (error) => {
      console.log(error);
    });
  }


  checkElementShouldDrop = (day, startValue) => {
    // check if element is being dragged
    const dragged = this.state.draggedObj;
    if (!dragged) { return; }
    const id = dragged.id;
    const events = this.state.events;
    const filtered = events.filter(event => event.id !== id);
    const endValue = startValue + Math.abs(dragged.startValue - dragged.endValue);
    const startTime = computeTimeFromValue(startValue);
    const endTime = computeTimeFromValue(endValue);
    const name = dragged.name;
    const calendar = dragged.calendar;
    const eventObj = {
      id,
      name,
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
    this.setState({ editorPosition: null });
  }

  dismissEditor = () => {
    this.setState({ editorPosition: null });
  }

  toggleEditor = (day, startValue, eventObj, eventEntryDOM) => {
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
        eventObj: eventObj,
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
          onClick={() => this.handleClick(day, timeObj.value)}
        >
        </div>
      ));
      const increment = timeObj.value + 0.5;
      const half_hours_jsx = days.map((day, i) => (
        <div
          key={i}
          className="item"
          onMouseUp={() => this.handleMouseUp(day, increment)}
          onClick={() => this.handleClick(day, increment)}
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

    const genEventEditor = () => {
      const editorPosition = this.state.editorPosition;
      if (editorPosition) {
        const eventEditorStyle = {
          top: editorPosition.top,
          left: editorPosition. left,
        }
        const eventObj = editorPosition.eventObj;
        return (
          <div className="editor-panel" style={eventEditorStyle}>
            <div className="top-bar">
            </div>
            <div className="header">
              <div className="dot-container">
                <div className="dot">
                </div>
              </div>
              <div className="title">
                <span>{eventObj.name}</span>
              </div>
            </div>
            <div className="info">
              <div className="item">
                <span className="key">Calendar</span>
                <span className="value">School</span>
                <img className="arrow-icon" src="./assets/grey-down-arrow.png" />
              </div>
              <div className="item">
                <span className="key">Location</span>
                <span className="value">Dwinelle 140</span>
              </div>
            </div>
          </div>
        );
      }
      return ( <div /> );
    }

    const events = this.state.events;
    let eventsList = [];
    for (let eventObj of events) {
      const day = eventObj.day;
      const length = Math.abs(eventObj.endValue - eventObj.startValue) * 10;
      const start = eventObj.startTime.replace(":", "").replace(" ", "");
      const className = 'event-entry start-' + start + ' ' + day + ' ' + 'length-' + length.toString();
      const key = eventObj.id;
      const eventjsx = (
        <div
          key={key}
          draggable="true"
          className={className}
          onDragStart={() => this.handleDragBehavior(eventObj)}
          onClick={(evt) => this.toggleEditor(day, eventObj.startValue, eventObj, evt.target)}
        >
          <div className="sidebar">
          </div>
          <div className="content">
            <div className="title">
              {eventObj.name}
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
