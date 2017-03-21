import React from 'react';

class CalendarListItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    const colorToBorderMap = {
      "#03A9F4": "#029BE0",
      "#009688": "#008A7D",
      "#F44336": "#E03D31",
      "#39579A": "#39579A"
    }
    const color = this.props.color;
    const border = '1px solid ' + colorToBorderMap[color];
    const style = {
      backgroundColor: color,
      border: border,
    };
    return (
      <div className="calendar-list-item">
        <div className="dot-container">
          <div style={style} className="dot"></div>
        </div>
        <span className="title">
          {this.props.item}
        </span>
      </div>
    );
  }
}

// A list of calendar items in the side panel
class CalendarList extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    const title = this.props.title;
    const calendarList = this.props.calendarList;
    const calendarListItems = calendarList.map((calendarListItem, i) => (
      <CalendarListItem
        key={i}
        item={calendarListItem.item}
        color={calendarListItem.color}
      />
    ));
    return (
      <div className="calendar-list">
        <div className="calendar-list-header">
          <span>{this.props.title}</span>
          <div className="arrow-img">
            <img src={"../../assets/grey-down-arrow.png"} />
          </div>
        </div>
        <div className="calendar-list-items">
          {calendarListItems}
        </div>
      </div>
    );
  }
}

// All the lists of all the calendars in the application in the side panel
export default class CalendarsList extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    const allCalendarsData = [
      {
        title: 'Google',
        calendarList: [{
          item: "School",
          color: "#03A9F4"
        },
        {
          item: "Innovative Design",
          color: "#009688"
        },
        {
          item: "IEEE",
          color: "#F44336"
        }]
      },
      {
        title: 'Facebook',
        calendarList: [{
          item: "Events I'm Attending",
          color: "#39579A"
        }]
      }
    ]
    const allCalendarsList = allCalendarsData.map((calendarList, i) => {
      return (
        <CalendarList
          key={i}
          {...calendarList}
        />
      );
    });
    return (
      <div className="calendar-list-container">
        {allCalendarsList}
      </div>
    )
  }
}
