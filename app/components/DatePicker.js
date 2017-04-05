import React from 'react';
import { DayPicker } from 'react-dates';
import { eventFire, formatDatePickerMonth } from '../helpers/html';

export default class DatePicker extends React.Component {
  constructor(props) {
    super(props);
    this.handleDateClick = this.handleDateClick.bind(this);
    const navPrev = (<img className="arrow-icon" src="./assets/grey-back-arrow.png" />);
    const navNext = (<img className="arrow-icon" src="./assets/grey-forward-arrow.png" />);
    this.state = {
      datePicker: () => <DayPicker
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
    // const pickerDateDOM = document.getElementsByClassName('js-CalendarMonth__caption')[1];
    // const updated = formatDatePickerMonth(pickerDateDOM);
    // pickerDateDOM.innerHTML = updated;
  }

  componentDidUpdate(prevProps, prevState) {
    const oldDate = prevProps.activeDate;
    const newDate = this.props.activeDate;
    const navPrev = (<img className="arrow-icon" src="./assets/grey-back-arrow.png" />);
    const navNext = (<img className="arrow-icon" src="./assets/grey-forward-arrow.png" />);
    if (!oldDate.isSame(newDate, 'month')) {
      this.setState({
        datePicker: () => <DayPicker
          navPrev={navPrev}
          navNext={navNext}
          initialVisibleMonth={() => this.props.activeDate}
          numberOfMonths={1}
          onDayClick={(date) => this.handleDateClick(date)}
          modifiers={{ selected: (date) => date.isSame(this.props.activeDate, 'day') }}
        />
      });
    }
  }

  handleDateClick(date) {
    this.props.setActiveDate(date);
    this.props.editorOff();
  }

  render() {
    console.log(this.props.activeDate);
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
