import React from 'react';
import $ from 'jquery';
import { getEditorPosition } from '../helpers/position';

export default class Editor extends React.Component {

  constructor(props) {
    super(props);
    const eventsMap = this.props.eventsMap;
    const editorObjId = this.props.editorObj;
    const eventObj = eventsMap[editorObjId];
    this.state = {
      eventObj,
      loadedGoogleMaps: false,
    }
  }

  componentWillUpdate(nextProps, nextState) {
    const currentId = this.props.editorObj.id;
    const newId = nextProps.editorObj.id;
    if (newId !== currentId) {
      const eventsMap = nextProps.eventsMap;
      const editorObjId = nextProps.editorObj.id;
      const eventObj = eventsMap[editorObjId]
      this.setState({ eventObj, })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const editorObjId = this.props.editorObj.id;
    if (editorObjId === '-1') {
      return;
    }

    const loadMap = () => {
      const location = this.state.eventObj.location;
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({'address': location}, (results, status) => {
        if (status === 'OK') {
          const map = new google.maps.Map(document.getElementById('editor-google-maps'), {
            zoom: 12,
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

    $.loadScript = function (url, callback) {
      $.ajax({
          url: url,
          dataType: 'script',
          success: callback,
          async: true
      });
    }

    if (!this.state.loadedGoogleMaps) {
      $.loadScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyBGlKlVCw6Y_OTJXAtdo7qD1eSNr58itnk', loadMap);
      this.setState({ loadedGoogleMaps: true });
    } else {
      const location = this.state.eventObj.location;
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({'address': location}, (results, status) => {
        if (status === 'OK') {
          const map = new google.maps.Map(document.getElementById('editor-google-maps'), {
            zoom: 12,
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
  }

  updateEventObj(field, evt) {
    return true;
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
              <div className="date">{eventObj.date.format('dddd, MMMM Do, YYYY')}</div>
              <div className="time">{eventObj.startTime + " - " + eventObj.endTime}</div>
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
  calendarMap: React.PropTypes.object.isRequired,
  editorObj: React.PropTypes.object.isRequired,
  eventsMap: React.PropTypes.object.isRequired,
  updateEvent: React.PropTypes.func.isRequired,
};
