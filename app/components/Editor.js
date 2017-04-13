import React from 'react';
import $ from 'jquery';
import _ from 'lodash';
import { isEmpty } from '../helpers/objects';
import { getEditorPosition } from '../helpers/position';

export default class Editor extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    $.loadScript = function (url) {
      $.ajax({
          url: url,
          dataType: 'script',
          async: true
      });
    }
    $.loadScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyBGlKlVCw6Y_OTJXAtdo7qD1eSNr58itnk');
  }

  componentDidUpdate(prevProps, prevState) {
    const editorObj = this.props.editorObj;
    if (isEmpty(editorObj)) {
      return;
    }
    const location = editorObj.location;
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': location}, (results, status) => {
      if (status === 'OK') {
        const map = new google.maps.Map(document.getElementById('editor-google-maps'), {
          zoom: 16,
          center: results[0].geometry.location,
          mapTypeControl: false
        });
        var marker = new google.maps.Marker({
          map,
          position: results[0].geometry.location
        });
      } else {
        console.log("Could not geocode address");
      }
    });
  }

  render () {
    const eventObj = this.props.editorObj;
    if (isEmpty(eventObj)) {
      return (<div className="editor-panel-off" />);
    }

    const name = eventObj.name;
    const location = eventObj.location;
    const calendarGroup = eventObj.calendarGroup;
    const calendarId = eventObj.calendarId;
    const editorPosition = getEditorPosition(eventObj);
    const eventsMap = this.props.eventsMap;
    const editorColor = { backgroundColor: eventsMap[calendarGroup].calendarList[calendarId].color };

    return (
      <div className="editor-panel" style={editorPosition}>
        <div className="editor-highlight" style={editorColor} />
        <div className="editor-header">
          <div className="dot-container">
            <div className="dot" style={editorColor} />
          </div>
          <div className="event-name">{eventObj.name}</div>
        </div>
        <div className="event-info">
          <div className="event-time-container">
            <div className="icon-container">
              <img className="icon" src="./assets/calendar-icon.png" />
            </div>
            <div className="event-time">
              <div className="date">{eventObj.start.format('dddd, MMMM Do, YYYY')}</div>
              <div className="time">{eventObj.start.format('h:mm A-') + eventObj.end.format('h:mm A')}</div>
              <div className="repeat">Repeat Weekly: Tues, Thurs</div>
            </div>
          </div>
          <div className="event-location-container">
            <div className="icon-container">
              <img className="icon" src="./assets/location-icon.png" />
            </div>
            <div className="event-location">{eventObj.location}</div>
          </div>
        </div>
        <div id="editor-google-maps" className="editor-google-maps" />
        <div className="editor-buttons-container">
          <div className="delete-container">
            <div className="delete-button">
              Delete
            </div>
          </div>
          <div className="edit-container">
            <div className="edit-button">
              Edit
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Editor.propTypes = {
  editorObj: React.PropTypes.object.isRequired,
  eventsMap: React.PropTypes.object.isRequired,
  updateEvent: React.PropTypes.func.isRequired,
};
