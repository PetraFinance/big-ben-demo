import React from 'react';

class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.handleToggle = this.handleToggle.bind(this);
  }

  handleToggle() {
    this.props.editorOff();
    this.props.toggleCalendarVisibility(this.props.category, this.props.calendarName);
  }

  render() {
    let backgroundColor = this.props.color;
    if (!this.props.visible) {
      backgroundColor = '#FAFAFA';
    }
    const style = {
      backgroundColor,
      border: '2px solid ' + this.props.accent,
    };
    return (
      <div className="calendar-list-item">
        <div className="dot-container">
          <div
            onClick={() => this.handleToggle()}
            style={style}
            className="dot"
          />
        </div>
        <span className="title">
          {this.props.calendarName}
        </span>
      </div>
    );
  }
}

class CalendarCategory extends React.Component {
  constructor(props) {
    super(props);
    this.toggleCollapse = this.toggleCollapse.bind(this);
    this.state = {
      collapsed: false,
    }
  }

  toggleCollapse() {
    const value = this.state.collapsed;
    this.setState({ collapsed: !value });
  }

  render() {
    const category = this.props.category;
    const calendars = this.props.calendars;
    const calendarNames = Object.keys(calendars);

    const calendarEntries = calendarNames.map((calendarName, i) => (
      <Calendar
        key={calendarName}
        calendarName={calendarName}
        category={category}
        color={calendars[calendarName].color}
        accent={calendars[calendarName].accent}
        visible={calendars[calendarName].visible}
        toggleCalendarVisibility={this.props.toggleCalendarVisibility}
        editorOff={this.props.editorOff}
      />
    ));

    let calendarListItems = { 'maxHeight': '300px', };
    let calendarList = {};
    let arrowStyle = {};
    if (this.state.collapsed) {
      calendarListItems = { 'maxHeight': '0px', 'overflow': 'hidden' };
      calendarList = { 'marginBottom': '0rem' };
      arrowStyle = { 'transform': 'rotate(180deg)' };
    }

    return (
      <div style={calendarList} className="calendar-list">
        <div className="calendar-list-header">
          <span>{category}</span>
          <div
            className="arrow-img"
            onClick={() => this.toggleCollapse()}
          >
            <img style={arrowStyle} src={"../../assets/grey-down-arrow.png"} />
          </div>
        </div>
        <div style={calendarListItems} className="calendar-list-items">
          {calendarEntries}
        </div>
      </div>
    );
  }
}

// The calendar list in the sidepanel
export default class CalendarList extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    const calendarMap = this.props.calendarMap;
    const calendarCategories = Object.keys(calendarMap);

    const calendarsList = calendarCategories.map((category) => {
      return (
        <CalendarCategory
          key={category}
          category={category}
          calendars={calendarMap[category]}
          toggleCalendarVisibility={this.props.toggleCalendarVisibility}
          editorOff={this.props.editorOff}
        />
      );
    });
    return (
      <div className="calendar-list-container">
        {calendarsList}
      </div>
    )
  }
}
