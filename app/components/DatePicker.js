import React from 'react'
import moment from 'moment'
import { DayPicker } from 'react-dates'
import { isEmpty } from '../helpers/objects'

class DatePicker extends React.Component {
  constructor(props) {
    super(props);
  }

  handleDateClick(date, target) {
    this.props.setActiveDate(date);
    this.props.editorOff();
  }

  componentDidMount() {
    const captions = document.getElementsByClassName("js-CalendarMonth__caption");
    for (let caption of captions) {
      const contents = caption.innerHTML;
      let updated = contents.replace("<strong", "<span");
      updated = updated.replace("</strong", "</span");
      updated = updated.replace(">", "><strong>");
      // Assuming we're still in the 2000s :)
      updated = updated.replace(" 2", " </strong>2");
      caption.innerHTML = updated;
    }
  }

  render() {

    const navPrev = ( <img className="arrow-icon"
    src="./assets/grey-back-arrow.png" /> );
    const navNext = ( <img className="arrow-icon"
    src="./assets/grey-forward-arrow.png" /> );
    console.log("This is the active date");
    console.log(this.props.activeDate);
    return (
      <div className="datepicker-container">
        <DayPicker
          navPrev={navPrev}
          navNext={navNext}
          numberOfMonths={1}
          onDayClick={(date) => this.handleDateClick(date)}
          modifiers={{selected: (date) => ( date.isSame(this.props.activeDate, 'day') )}}
        />
      </div>
    );
  }
}

export default DatePicker;
