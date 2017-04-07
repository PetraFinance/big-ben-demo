import React from 'react';
import $ from 'jquery';
import { getEditorPosition } from '../helpers/position';

export default class Editor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      editingField: '',
    }
  }

  setEditorField(field) {
    this.setState({ editingField: field });
  }

  updateEventObj(field, evt) {
    const editorObjId = this.props.editorObj.id;
    const eventObj = this.props.eventsMap[editorObjId];
    if (field === 'calendar') {
      const calendarInput = $(evt.target).text();
      let eventObjCategory = '';
      const calendarMap = this.props.calendarMap;
      const categories = Object.keys(calendarMap);
      for (const category of categories) {
        const calendars = Object.keys(calendarMap[category]);
        for (const calendar of calendars) {
          if (calendar === calendarInput) {
            eventObjCategory = category;
          }
        }
      }
      eventObj[field] = calendarInput;
      eventObj["category"] = eventObjCategory;
      this.props.updateEvent(eventObj);
      this.setEditorField('');
    } else {
      eventObj[field] = evt.target.value;
      this.props.updateEvent(eventObj);
    }
  }

  render () {
    const editorObjId = this.props.editorObj.id;
    if (editorObjId === '-1') {
      return (<div className="editor-panel-off" />);
    }

    const eventObj = this.props.eventsMap[editorObjId];
    const name = eventObj.name;
    const location = eventObj.location;
    const category = eventObj.category;
    const calendar = eventObj.calendar;
    const editingField = this.state.editingField;
    const editorPosition = getEditorPosition(eventObj);
    const calendarMap = this.props.calendarMap;
    const editorColor = { backgroundColor: calendarMap[category][calendar].color };

    const form = {
      name: [(
        <div
          key={'name'}
          className="name"
          onClick={() => this.setEditorField('name')}
        >
          <span>{name}</span>
        </div>
      )],
      location: [(
        <div
          key={'location'}
          className="location"
          onClick={() => this.setEditorField('location')}
        >
          <span className="value">{location}</span>
        </div>
      )],
      calendar: [(
        <div
          key={'calendar'}
          className="calendar"
          onClick={() => this.setEditorField('calendar')}
        >
          <span className="value">{calendar}</span>
          <img className="arrow-icon" src="./assets/grey-down-arrow.png" />
        </div>
      )],
    };

    const editableForm = {
      name: [(
        <input
          autoFocus
          key={'title'}
          className="name-input"
          onChange={(evt) => this.updateEventObj('name', evt)}
          onBlur={() => this.setEditorField('')}
          placeholder={name}
        />
      )],
      location: [(
        <input
          autoFocus
          key={'location'}
          className="location"
          onChange={(evt) => this.updateEventObj('location', evt)}
          onBlur={() => this.setEditorField('')}
          placeholder={location}
        />
      )],
    };

    const calendarList = [];
    const calendarCategories = Object.keys(calendarMap);
    for (const category of calendarCategories) {
      const calendars = Object.keys(calendarMap[category]);
      for (const calendar of calendars) {
        const style = { backgroundColor: calendarMap[category][calendar].color };
        const calendarJSX = (
          <div
            key={calendar}
            className="item"
            onClick={(evt) => this.updateEventObj('calendar', evt)}
          >
            <div className="calendar-dot" style={style} />
            <div className="name">
              {calendar}
            </div>
          </div>
        );
        calendarList.push(calendarJSX);
      }
    }

    const mainEditor = (
      <div className="editor-panel" style={editorPosition}>
        <div className="top-bar" style={editorColor} />
        <div className="header">
          <div className="dot-container">
            <div className="dot" style={editorColor} />
          </div>
          {editingField === 'name' ? editableForm.name : form.name}
        </div>
        <div className="info">
          <div className="item">
            <img className="icon" src="./assets/calendar-icon.png" />
            <span className="field">Calendar</span>
            {form.calendar}
          </div>
          <div className="item">
            <img className="icon" src="./assets/location-icon.png" />
            <span className="field">Location</span>
            { editingField === 'location' ? editableForm.location : form.location}
          </div>
        </div>
      </div>
    );

    if (editingField === 'calendar') {
      return (
        <div className="editor-panel" style={editorPosition}>
          <div
            key={'calendar'}
            className="calendar-input"
          >
            {calendarList}
          </div>
        </div>
      );
    }
    return mainEditor;
  }
}

Editor.propTypes = {
  calendarMap: React.PropTypes.object.isRequired,
  editorObj: React.PropTypes.object.isRequired,
  eventsMap: React.PropTypes.object.isRequired,
  updateEvent: React.PropTypes.func.isRequired,
};
