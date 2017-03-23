import React from 'react'
import $ from "jquery"
import { getEventEntryDOM, isEmpty } from '../helpers/helpers'
import { getEditorPosition } from '../helpers/position'
import _ from 'lodash'

export default class Editor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      editingField: {},
      editedEventObj: {},
    };
  }

  componentWillReceiveProps(nextProps) {
    const id = nextProps.id;
    const eventsMap = nextProps.eventsMap;
    if (!_.isEqual(this.state.editedEventObj, eventsMap[id])) {
      this.setState({ editedEventObj: eventsMap[id] });
    }
  }

  finishEditing() {
    this.setState({ editingField: {} });
    this.props.updateEvent(this.state.editedEventObj);
  }

  finishEditingOnEnter(evt) {
    if (evt.keyCode == '13') {
      this.finishEditing();
    }
  }

  setEditingField(field) {
    this.setState({ editingField: field });
  }

  setEditingFieldValue(field, evt) {
    let copy = this.state.editedEventObj;
    if (field === "calendar") {
      copy[field] = $(evt.target).text();
      this.setState({ editedEventObj: copy }, () => {
        this.finishEditing();
      });
    } else {
      copy[field] = evt.target.value;
      this.setState({ editedEventObj: copy });
    }
  }

  render () {
    const id = this.props.id;
    if (id === -1) {
      return ( < div/> );
    }

    // the Editor uses its own copy of the event, edits it, and then updates the event in the store on exiting
    const eventObj = this.state.editedEventObj;
    const name = eventObj.name;
    const location = eventObj.location;
    const calendar = eventObj.calendar;

    const editingField = this.state.editingField;

    const editorPosition = getEditorPosition(this.props.eventsMap[id]);
    const calendarMap = this.props.calendarMap;
    const editorColor = { backgroundColor: calendarMap[calendar]["color"] };

    const form = {
      name: [(
        <div
          key={"name"}
          className="name"
          onClick={() => this.setEditingField("name")}
        >
          <span>{name}</span>
        </div>
      )],
      location: [(
        <div
          key={"location"}
          className="location"
          onClick={() => this.setEditingField("location")}
        >
          <span className="value">{location}</span>
        </div>
      )],
      calendar: [(
        <div
          key={"calendar"}
          className="calendar"
          onClick={() => this.setEditingField("calendar")}
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
          onChange={(evt) => this.setEditingFieldValue("name", evt)}
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
          onChange={(evt) => this.setEditingFieldValue("location", evt)}
          onBlur={() => this.finishEditing()}
          onKeyUp={(evt) => this.finishEditingOnEnter(evt)}
          placeholder={location}
        />
      )],
    }

    const calendarsJSX = [];
    const calendars = Object.keys(calendarMap);
    for (let calendar of calendars) {
      const style = { backgroundColor: calendarMap[calendar]["color"] };
      const jsx = (
        <div
          key={calendar}
          className="item"
          onClick={(evt) => this.setEditingFieldValue("calendar", evt)}
        >
          <div className="calendar-dot" style={style}>
          </div>
          <div className="name">
            {calendar}
          </div>
        </div>
      );
      calendarsJSX.push(jsx);
    }

    const mainEditor = (
      <div className="editor-panel" style={editorPosition}>
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

    if (editingField === "calendar") {
      return (
        <div className="editor-panel" style={editorPosition}>
          <div
            key={"calendar"}
            className="calendar-input"
          >
            {calendarsJSX}
          </div>
        </div>
      );
    } else {
      return mainEditor;
    }
  }
}
