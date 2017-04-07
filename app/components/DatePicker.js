import React from 'react';
import { DayPicker } from 'react-dates';
import { formatDatePickerMonth } from '../helpers/html';
import { isSameDay } from '../helpers/time';

export default class DatePicker extends React.Component {
  constructor(props) {
    super(props);
    this.handleDateClick = this.handleDateClick.bind(this);
    this.clickArrowButtons = this.clickArrowButtons.bind(this);
    const navPrev = (<img className="arrow-icon" src="./assets/grey-back-arrow.png" />);
    const navNext = (<img className="arrow-icon" src="./assets/grey-forward-arrow.png" />);
    this.state = {
      datePicker: () => <DayPicker
        onPrevMonthClick={() => this.clickArrowButtons()}
        onNextMonthClick={() => this.clickArrowButtons()}
        navPrev={navPrev}
        navNext={navNext}
        initialVisibleMonth={() => this.props.activeDate}
        numberOfMonths={1}
        onDayClick={(date) => this.handleDateClick(date)}
        modifiers={{ selected: (date) => date.isSame(this.props.activeDate, 'day') }}
      />
    }
  }

  componentDidMount() {
    const datePickerDOMs = document.getElementsByClassName('js-CalendarMonth__caption');
    for (const datePickerDOM of datePickerDOMs) {
      const updated = formatDatePickerMonth(datePickerDOM);
      datePickerDOM.innerHTML = updated;
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const oldDate = prevProps.activeDate;
    const newDate = this.props.activeDate;
    const navPrev = (<img className="arrow-icon" src="./assets/grey-back-arrow.png" />);
    const navNext = (<img className="arrow-icon" src="./assets/grey-forward-arrow.png" />);
    const visibleMonth = document.getElementsByClassName('js-CalendarMonth__caption')[1].innerHTML;
    const newDateMonth = newDate.format('MMMM');
    if (!isSameDay(newDate, oldDate) || !visibleMonth.includes(newDateMonth)) {
      this.setState({
        datePicker: () => <DayPicker
          onPrevMonthClick={() => this.clickArrowButtons()}
          onNextMonthClick={() => this.clickArrowButtons()}
          navPrev={navPrev}
          navNext={navNext}
          initialVisibleMonth={() => this.props.activeDate}
          numberOfMonths={1}
          onDayClick={(date) => this.handleDateClick(date)}
          modifiers={{ selected: (date) => date.isSame(this.props.activeDate, 'day') }}
        />
      });
    }
    const datePickerDOMs = document.getElementsByClassName('js-CalendarMonth__caption');
    for (const datePickerDOM of datePickerDOMs) {
      const updated = formatDatePickerMonth(datePickerDOM);
      datePickerDOM.innerHTML = updated;
    }
  }

  clickArrowButtons() {
    const datePickerDOMs = document.getElementsByClassName('js-CalendarMonth__caption');
    for (const datePickerDOM of datePickerDOMs) {
      const updated = formatDatePickerMonth(datePickerDOM);
      datePickerDOM.innerHTML = updated;
    }
  }

  handleDateClick(date) {
    this.props.setActiveDate(date);
    this.props.editorOff();
  }

  render() {
    return (
      <div className="datepicker-container">
        < this.state.datePicker />
      </div>
    );
  }
}

DatePicker.propTypes = {
  activeDate: React.PropTypes.object.isRequired,
  setActiveDate: React.PropTypes.func.isRequired,
  editorOff: React.PropTypes.func.isRequired,
};
