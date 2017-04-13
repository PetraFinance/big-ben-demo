import React from 'react';
import { isEmpty } from '../helpers/objects';

class CalendarListEntry extends React.Component {
  constructor(props) {
    super(props);
    this.handleToggle = this.handleToggle.bind(this);
  }

  handleToggle() {
    this.props.editorOff();
    this.props.toggleCalendarVisibility(this.props.calendarGroup, this.props.calendarId);
  }

  render() {
    let backgroundColor = this.props.color;
    if (!this.props.visible) {
      backgroundColor = '#FAFAFA';
    }
    const style = {
      backgroundColor,
      border: '2px solid ' + this.props.highlight,
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

class CalendarSublist extends React.Component {
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

    const calendars = this.props.calendars;
    const calendarIds = Object.keys(calendars);
    const calendarGroup = this.props.calendarGroup;

    const calendarListEntries = calendarIds.map((calendar, i) => (
      <CalendarListEntry
        key={calendar}
        calendarGroup={calendarGroup}
        calendarName={calendars[calendar].name}
        calendarId={calendar}
        color={calendars[calendar].color}
        highlight={calendars[calendar].highlight}
        visible={calendars[calendar].visible}
        toggleCalendarVisibility={this.props.toggleCalendarVisibility}
        editorOff={this.props.editorOff}
      />
    ));

    let calendarListEntriesStyle = { 'maxHeight': '300px', };
    let calendarList = {};
    let arrowStyle = {};
    if (this.state.collapsed) {
      calendarListEntriesStyle = { 'maxHeight': '0px', 'overflow': 'hidden' };
      calendarList = { 'marginBottom': '0rem' };
      arrowStyle = { 'transform': 'rotate(180deg)' };
    }

    return (
      <div style={calendarList} className="calendar-list">
        <div className="calendar-list-header">
          <span>{calendarGroup}</span>
          <img
            className="arrow-img"
            onClick={() => this.toggleCollapse()}
            style={arrowStyle}
            src={"../../assets/grey-down-arrow.png"}
          />
        </div>
        <div style={calendarListEntriesStyle} className="calendar-list-items">
          {calendarListEntries}
        </div>
      </div>
    );
  }
}

// The calendar list in the sidepanel
// This file needs a better naming scheme
export default class CalendarList extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    const eventsMap = this.props.eventsMap;

    const calendarGroups = Object.keys(eventsMap);
    const calendars = calendarGroups.filter(group => (!isEmpty(eventsMap[group].calendarList))).map((calendarGroup) => (
      <CalendarSublist
        key={calendarGroup}
        calendarGroup={calendarGroup}
        calendars={eventsMap[calendarGroup].calendarList}
        toggleCalendarVisibility={this.props.toggleCalendarVisibility}
        editorOff={this.props.editorOff}
      />
    ));
    return (
      <div className="calendar-list-container">
        {calendars}
      </div>
    )
  }
}
