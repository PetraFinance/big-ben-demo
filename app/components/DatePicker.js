import React from 'react'
import moment from 'moment'
import { DayPicker } from 'react-dates'
import { isEmpty } from '../helpers/helpers'

class DatePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      highlightedDOM: {},
    }
    this.props.setActiveDate(moment());
  }

  handleDateClick(date, target) {
    this.props.setActiveDate(date);
    const highlightedDOM = this.state.highlightedDOM;
    if (!isEmpty(highlightedDOM)) {
      highlightedDOM.className =  highlightedDOM.className.replace(" active", "");
    }
    this.setState({ date });
    this.setState({ highlightedDOM: target });
    target.className += " active";
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

    return (
      <div className="datepicker-container">
        <DayPicker
          navPrev={navPrev}
          navNext={navNext}
          numberOfMonths={1}
          onDayClick={(date, evt) => this.handleDateClick(date, evt.target)}
        />
      </div>
    );
  }
}

export default DatePicker;
