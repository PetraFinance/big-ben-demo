import React from 'react'
import { genTimeMap, computeTimeFromValue } from './helpers';

export default class Calendar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      events: [
        {
          name: "Stat 101 Lecture",
          startTime: "7 AM",
          endTime: "8:30 AM",
          startValue: 7,
          endValue: 8.5,
          day: "Mon",
        },
      ],
    }
  }

  render () {
    const days = [
      "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
    ]
    const plugins = [
      "Trello", "Todoist"
    ];
    const createEvent = (day, startValue) => {
      const endValue = startValue + 0.5;
      const startTime = computeTimeFromValue(startValue);
      const endTime = computeTimeFromValue(endValue);
      const name = "default";

      const eventObj = {
        name,
        startTime,
        endTime,
        startValue,
        endValue,
        day
      };

      this.setState({events: this.state.events.concat([eventObj])});
    }

    const genEvents = () => {
      let eventsList = [];
      const events = this.state.events;
      for (let event of events) {
        const day = event.day;
        const length = Math.abs(event.endValue - event.startValue) * 10;
        const start = event.startTime.replace(":", "").split(" ")[0];
        const className = 'event-entry start-' + start + ' ' + day + ' ' + 'length-' + length.toString();
        console.log(className);

        const key = className + ' ' + event.name;

        const jsx = (
          <div
            draggable="true"
            className={className}
            key={key}
          >
            <div className="sidebar">
            </div>
            <div className="content">
              {event.name}
            </div>
          </div>
        );

        eventsList.push(jsx);
      }
      console.log("break")
      return eventsList;
    }

    const times = genTimeMap();



    const columns = [
      (<div key={1} className="item"></div>),
      (<div key={2} className="item"></div>),
      (<div key={3} className="item"></div>),
      (<div key={4} className="item"></div>),
      (<div key={5} className="item"></div>),
      (<div key={6} className="item"></div>),
      (<div key={7} className="item"></div>),
    ];

    const headers = days.map((day, i) => (
      <div className="item" key={i}><span>{day}</span></div>
    ));

    const hours = times.filter(timeObj => !timeObj.time.includes(":30"));

    const rows = hours.map((timeObj, i) => {

      return (
        <div key={i}>
          <div className="row">
            <div className="time">
              <span>{timeObj.time}</span>
            </div>

            <div
              className="item"
              onClick={() => createEvent("Sun", timeObj.value)}
            ></div>
            <div
              className="item"
              onClick={() => createEvent("Mon", timeObj.value)}
            ></div>
            <div
              className="item"
              onClick={() => createEvent("Tue", timeObj.value)}
            ></div>
            <div
              className="item"
              onClick={() => createEvent("Wed", timeObj.value)}
            ></div>
            <div
              className="item"
              onClick={() => createEvent("Thu", timeObj.value)}
            ></div>
            <div
              className="item"
              onClick={() => createEvent("Fri", timeObj.value)}
            ></div>
            <div
              className="item"
              onClick={() => createEvent("Sat", timeObj.value)}
            ></div>

          </div>
          <div className="row half-hour">
            <div className="time">
            </div>

            <div
              className="item"
              onClick={() => createEvent("Sun", timeObj.value)}
            ></div>
            <div
              className="item"
              onClick={() => createEvent("Mon", timeObj.value)}
            ></div>
            <div
              className="item"
              onClick={() => createEvent("Tue", timeObj.value)}
            ></div>
            <div
              className="item"
              onClick={() => createEvent("Wed", timeObj.value)}
            ></div>
            <div
              className="item"
              onClick={() => createEvent("Thu", timeObj.value)}
            ></div>
            <div
              className="item"
              onClick={() => createEvent("Fri", timeObj.value)}
            ></div>
            <div
              className="item"
              onClick={() => createEvent("Sat", timeObj.value)}
            ></div>

          </div>
        </div>
      );
    });

    const integrations = plugins.map((plugin, i) => (
      <div className="row" key={i}>
        <div className="plugin">
          <span>{plugin}</span>
        </div>
        {columns}
      </div>
    ));

    return (
      <div className="calendar-container">
        <div className="column-headers">
          <div className="time"></div>
          {headers}
        </div>
        <div className="all-day-events">
          <div className="time">
            <span>ALL DAY</span>
          </div>
          {columns}
        </div>
        <div className="main-calendar">
          {rows}
          {genEvents()}
        </div>
        <div className="integrations-calendar">
          {integrations}
        </div>
      </div>
    )
  }
}
