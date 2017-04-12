import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import { getWeekStartDate } from '../../helpers/time';
import { genUniqueIdentifier } from '../../helpers/html';

export default class DayColumnHeaders extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    let selectedDate = this.props.selectedDate.clone();
    const activeDay = selectedDate.format('dddd');
    let dateObj = getWeekStartDate(selectedDate);

    const momentDateObjects = [];
    const formattedDateObjects = [];

    for (let i = 0; i < 7; i += 1) {
      const formatted = dateObj.format('ddd M/D');
      formattedDateObjects.push(formatted);
      momentDateObjects.push(dateObj);
      dateObj = dateObj.clone().add(1, 'days');
    }

    const days = moment.weekdays();
    const rowHeaders = days.map((day, i) => {
      let className = 'column-header-item';
      if (day === activeDay) {
        className = 'column-header-item active';
      }
      const date = formattedDateObjects[i];
      return (
        <div
          onClick={() => this.props.setSelectedDate(momentDateObjects[i])}
          className={className}
          key={genUniqueIdentifier([date, i])}
        >
          <span>{date}</span>
        </div>
      );
    });

    return (
      <div className="calendar-column-headers">
        <div className="time-column" />
        {rowHeaders}
      </div>
    );
  }
}
