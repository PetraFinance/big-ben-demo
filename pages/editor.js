import React from 'react'

export default class Editor extends React.Component {

  constructor(props) {
    super(props);
    const eventObj = this.props.eventObj;
    this.state = {
      editingField: null,
      title: eventObj.name,
    };
  }

  setEditableField = (field) => {
    this.setState({ editingField: field });
  }

  setEditableFieldValue = (field, evt) => {
    if (field === "title") {
      this.setState({ title: evt.target.value });
    }
  }

  finishEditing = () => {
    this.setState({ editingField: null });
  }

  render () {

    const eventObj = this.props.eventObj;
    const eventEditorStyle = this.props.eventEditorStyle;

    const titleValue = this.state.title;

    const form = {
      title: [(
        <div
          key={"title"}
          className="title"
          onClick={() => this.setEditableField("title")}
        >
          <span>{titleValue}</span>
        </div>
      )],
      location: [(
        <div
          key={"location"}
          className="location"
          onClick={() => this.setEditableField("location")}
        >
          <span className="value">Dwinelle 140</span>
        </div>
      )],
    }

    const editableForm = {
      title: [(
        <input
          autoFocus
          key={"title"}
          className="title-input"
          onChange={(evt) => this.setEditableFieldValue("title", evt)}
          onBlur={() => this.finishEditing()}
          placeholder={titleValue}
        />
      )],
      location: [(
        <input
          key={"title"}
          className="location-input"
          onChange={(evt) => this.setEditableFieldValue("location", evt)}
          onBlur={() => this.finishEditing()}
          placeholder="Dwinelle 140"
        />
      )],
    }

    const editingField = this.state.editingField;
    console.log(editingField);

    return (
      <div className="editor-panel" style={eventEditorStyle}>
        <div className="top-bar">
        </div>
        <div className="header">
          <div className="dot-container">
            <div className="dot">
            </div>
          </div>
          { editingField === "title" ? editableForm["title"] : form["title"]}
        </div>
        <div className="info">
          <div className="item">
            <span className="key">Calendar</span>
            <span className="value calendar">School</span>
            <img className="arrow-icon" src="./assets/grey-down-arrow.png" />
          </div>
          <div className="item">
            <span className="key">Location</span>
            {form["location"]}
          </div>
        </div>
      </div>
    );
  }
}
