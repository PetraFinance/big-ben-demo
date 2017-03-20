import React from 'react'
import $ from "jquery"

export default class Editor extends React.Component {

  constructor(props) {
    super(props);
    const eventObj = this.props.eventObj;
    const newEvent = this.props.newEvent;
    let editingField = {};
    if (newEvent) { editingField="name"; }
    this.state = {
      editingField,
      editableEventObj: eventObj,
    };
  }

  // if you click on a different event, you need to update the state to have the new event entry you're trying to edit
  componentWillReceiveProps(nextProps) {
    if (this.state.editableEventObj !== nextProps.eventObj) {
      this.setState({ editableEventObj: nextProps.eventObj });
    }
  }

  finishEditing = () => {
    this.setState({ editingField: {} });
    this.props.updateEditedEventObj(this.state.editableEventObj);
  }

  finishEditingOnEnter = (evt) => {
    if (evt.keyCode == '13') {
      this.setState({ editingField: {} });
      this.props.updateEditedEventObj(this.state.editableEventObj);
    }
  }

  setEditableField = (field) => {
    this.setState({ editingField: field });
  }

  handleSetCalendar = (evt) => {
    this.setEditableFieldValue("calendar", evt);
    this.finishEditing();
  }

  setEditableFieldValue = (field, evt) => {
    let cp = this.state.editableEventObj;
    let value;
    if (field == "calendar") {
      value = $(evt.target).text();
    } else {
      value = evt.target.value
    }
    cp[field] = value;
    this.setState({ editableEventObj: cp });
  }

  render () {

    const eventObj = this.state.editableEventObj;
    const calendarMap = this.props.calendarMap;
    const calendarList = Object.keys(calendarMap);
    const eventEditorPosition = this.props.eventEditorPosition;

    const name = eventObj.name;
    const location = eventObj.location;
    const calendar = eventObj.calendar;

    const form = {
      name: [(
        <div
          key={"name"}
          className="name"
          onClick={() => this.setEditableField("name")}
        >
          <span>{name}</span>
        </div>
      )],
      location: [(
        <div
          key={"location"}
          className="location"
          onClick={() => this.setEditableField("location")}
        >
          <span className="value">{location}</span>
        </div>
      )],
      calendar: [(
        <div
          key={"calendar"}
          className="calendar"
          onClick={() => this.setEditableField("calendar")}
        >
          <span className="value">{calendar}</span>
          <img className="arrow-icon" src={"./assets/grey-down-arrow.png"} />
        </div>
      )],
    }

    const editableForm = {
      name: [(
        <input
          autoFocus
          key={"title"}
          className="name-input"
          onChange={(evt) => this.setEditableFieldValue("name", evt)}
          onBlur={() => this.finishEditing()}
          onKeyUp={(evt) => this.finishEditingOnEnter(evt)}
          placeholder={name}
        />
      )],
      location: [(
        <input
          autoFocus
          key={"location"}
          className="location"
          onChange={(evt) => this.setEditableFieldValue("location", evt)}
          onBlur={() => this.finishEditing()}
          onKeyUp={(evt) => this.finishEditingOnEnter(evt)}
          placeholder={location}
        />
      )],
    }

    const editingField = this.state.editingField;
    const editorColor = this.props.editorColor;

    const mainEditor = (
      <div className="editor-panel" style={eventEditorPosition}>
        <div className="top-bar" style={editorColor}>
        </div>
        <div className="header">
          <div className="dot-container">
            <div className="dot" style={editorColor}>
            </div>
          </div>
          {editingField === "name" ? editableForm["name"] : form["name"]}
        </div>
        <div className="info">
          <div className="item">
            <img className="icon" src="./assets/calendar-icon.png" />
            <span className="field">Calendar</span>
            {form["calendar"]}
          </div>
          <div className="item">
            <img className="icon" src="./assets/location-icon.png" />
            <span className="field">Location</span>
            { editingField === "location" ? editableForm["location"] : form["location"]}
          </div>
        </div>
      </div>
    );

    const calendarListJSX = calendarList.map((calendar, i) => {

      const backgroundColor = calendarMap[calendar]["color"];
      const style = {
        backgroundColor
      };
      return (
        <div
          key={i}
          className="item"
          onClick={(evt) => this.handleSetCalendar(evt)}
        >
          <div className="calendar-dot" style={style}>
          </div>
          <div className="name">
            {calendar}
          </div>
        </div>
      );
    });

    if (editingField === "calendar") {
      return (
        <div className="editor-panel" style={eventEditorPosition}>
          <div
            key={"calendar"}
            className="calendar-input"
          >
            {calendarListJSX}
          </div>
        </div>
      );
    } else {
      return mainEditor;
    }
  }
}
