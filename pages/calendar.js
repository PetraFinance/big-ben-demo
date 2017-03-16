import React from 'react'

import { genSimpleCells } from './calendar/simpleCells';
import { genSmartCells } from './calendar/smartCells';
import { genEvents } from './calendar/events';
import { genTimeMap, computeTimeFromValue } from './calendar/helpers';
import $ from "jquery";

export default class Calendar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      beingDragged: null,
      next_id: 1,
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
    const row_headers = days.map((day, i) => (
      <div className="item" key={i}><span>{day}</span></div>
    ));

    const handleDragBehavior = (event) => {
      this.setState({ draggedObj: event });
    }
    const events = genEvents(this.state.events, handleDragBehavior);
    const possibleEvent = this.state.possibleEvent;

    const createEvent = (day, startValue) => {
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
    }

    const checkDropElement = (day, startValue) => {
      const dragged = this.state.draggedObj;
      if (!dragged) {
        return;
      }
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

    const rows = genSmartCells(createEvent, checkDropElement);

    return (
      <div className="calendar-container">
        <div className="column-headers">
          <div className="time"></div>
          {row_headers}
        </div>
        <div className="all-day-events">
          <div className="time">
            <span>ALL DAY</span>
          </div>
          {genSimpleCells()}
        </div>
        <div className="main-calendar">
          {rows}
          {events}
          {possibleEvent}
        </div>
        <div className="integrations-calendar">
          {integrations}
        </div>
      </div>
    );
  }
}
