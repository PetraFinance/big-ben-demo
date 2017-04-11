import React from 'react';
import moment from 'moment';
import _ from 'lodash';

import { getWeekStartDate } from '../helpers/time';
import { genUniqueIdentifier } from '../helpers/html';

import CalendarMonthView from './calendar/CalendarMonthView';
import CalendarWeekView from './calendar/CalendarWeekView';
import CalendarDayLabels from './calendar/CalendarDayLabels';
import IntegrationsCalendar from './calendar/IntegrationsCalendar';
import AllDayEventsCalendar from './calendar/AllDayEventsCalendar';

export default class Calendar extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const calendarWeekView = (
      <div className="calendar-container-week" >
        <CalendarDayLabels {...this.props} />
        <AllDayEventsCalendar {...this.props} />
        <CalendarWeekView {...this.props} />
        <IntegrationsCalendar {...this.props} />
      </div>
    );

    const calendarMonthView = (
      <div className="calendar-container-month">
        <CalendarMonthView />
      </div>
    )

    return (
      <div style={{ 'height': '100%', 'width': '100%' }}>
        {
          this.props.calendarViewMode === "week" ?
          calendarWeekView :
          calendarMonthView
        }
      </div>
    );
  }
}

Calendar.propTypes = {
  calendarMap: React.PropTypes.object.isRequired,
  activeDate: React.PropTypes.object.isRequired,
  resizeObj: React.PropTypes.object.isRequired,
  draggedObj: React.PropTypes.object.isRequired,
  editorObj: React.PropTypes.object.isRequired,
  eventsMap: React.PropTypes.object.isRequired,
  editorOn: React.PropTypes.func.isRequired,
  editorOff: React.PropTypes.func.isRequired,
  setDraggedObj: React.PropTypes.func.isRequired,
  updateEvent: React.PropTypes.func.isRequired,
  addEvent: React.PropTypes.func.isRequired,
  setResizeObj: React.PropTypes.func.isRequired,
};
