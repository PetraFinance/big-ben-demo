import React from 'react'
import moment from 'moment'
import { DayPicker } from 'react-dates'
import { eventFire, formatDatePickerMonth } from '../helpers/html'

class DatePicker extends React.Component {
  constructor(props) {
    super(props);
    this.handleMonthClick = this.handleMonthClick.bind(this);
  }

  handleDateClick(date, target) {
    this.props.setActiveDate(date);
    this.props.editorOff();
  }

  componentDidUpdate(prevProps, prevState) {
    const currentDate = this.props.activeDate;
    const oldDate = prevProps.activeDate;
    if (!currentDate.isSame(oldDate, 'month')) {
      if (currentDate.isAfter(oldDate, 'month')) {
        eventFire(document.getElementsByClassName("DayPickerNavigation__next")[0], "click");
      } else {
        eventFire(document.getElementsByClassName("DayPickerNavigation__prev")[0], "click");
      }
    }
  }

  handleMonthClick() {
    const months = document.getElementsByClassName("js-CalendarMonth__caption");
    for (let month of months) {
      const updated = formatDatePickerMonth(month);
      month.innerHTML = updated;
    }
  }

  componentDidMount() {
    const month = document.getElementsByClassName("js-CalendarMonth__caption")[1];
    const updated = formatDatePickerMonth(month);
    month.innerHTML = updated;
  }

  render() {
    const navPrev = ( <img className="arrow-icon" src="./assets/grey-back-arrow.png" /> );
    const navNext = ( <img className="arrow-icon" src="./assets/grey-forward-arrow.png" /> );
    return (
      <div className="datepicker-container">
        <DayPicker
          navPrev={navPrev}
          navNext={navNext}
          onPrevMonthClick={() => this.handleMonthClick()}
          onNextMonthClick={() => this.handleMonthClick()}
          initialVisibleMonth={() => (this.props.activeDate)}
          numberOfMonths={1}
          onDayClick={(date) => this.handleDateClick(date)}
          modifiers={{selected: (date) => ( date.isSame(this.props.activeDate, 'day') )}}
        />
      </div>
    );
  }
}

export default DatePicker;
