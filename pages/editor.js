import React from 'react'

export default class Editor extends React.Component {

  constructor(props) {
    super(props);
    const eventObj = this.props.eventObj;
    const newEvent = this.props.newEvent;
    let editingField = null;
    if (newEvent) {
      editingField="name";
    }
    this.state = {
      editingField,
      editableEventObj: eventObj,
    };
  }

  setEditableField = (field) => {
    this.setState({ editingField: field });
  }

  setEditableFieldValue = (field, evt) => {
    let cp = this.state.editableEventObj;
    cp[field] = evt.target.value;
    console.log("This is the copy");
    console.log(cp);
    this.setState({ editableEventObj: cp });
  }

  finishEditing = () => {
    this.setState({ editingField: null });
    this.props.updateEditedEventObj(this.state.editableEventObj);
  }

  finishEditingOnEnter = (evt) => {
    if (evt.keyCode == '13') {
      this.setState({ editingField: null });
      this.props.updateEditedEventObj(this.state.editableEventObj);
    }
  }

  render () {

    const eventObj = this.state.editableEventObj;
    const eventEditorStyle = this.props.eventEditorStyle;

    const name = eventObj.name;
    const location = eventObj.location;
    const calendarMap = this.props.calendarMap;

    let calendarList = [];


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
          className="value"
          onChange={(evt) => this.setEditableFieldValue("location", evt)}
          onBlur={() => this.finishEditing()}
          onKeyUp={(evt) => this.finishEditingOnEnter(evt)}
          placeholder={location}
        />
      )],
    }

    const editingField = this.state.editingField;

    return (
      <div className="editor-panel" style={eventEditorStyle}>
        <div className="top-bar">
        </div>
        <div className="header">
          <div className="dot-container">
            <div className="dot">
            </div>
          </div>
          { editingField === "name" ? editableForm["name"] : form["name"]}
        </div>
        <div className="info">
          <div className="item cal">
            <img className="icon" src="./assets/calendar-icon.png" />
            <span className="key">Calendar</span>
            <select
              dir="rtl"
              className="value"
              key={"calendar"}
              className="calendar"
              onClick={() => this.setEditableField("calendar")}
            >
              <option value="volvo">Volvo</option>
              <option value="saab">Saab</option>
              <option value="mercedes">Mercedes</option>
              <option value="audi">Audi</option>
            </select>
          </div>
          <div className="item">
            <img className="icon" src="./assets/location-icon.png" />
            <span className="key">Location</span>
            { editingField === "location" ? editableForm["location"] : form["location"]}
          </div>
        </div>
      </div>
    );
  }
}
