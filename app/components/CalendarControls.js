import React from 'react';
import moment from 'moment';

export default class CalendarControls extends React.Component {
  constructor(props) {
    super(props);
    this.handleTodayButton = this.handleTodayButton.bind(this);
    this.handleAdvanceButton = this.handleAdvanceButton.bind(this);
  }

  handleTodayButton() {
    const today = moment();
    this.props.setActiveDate(today);
  }

  handleAdvanceButton() {
    const activeDate = this.props.activeDate.clone();
    const advanced = activeDate.add(7, 'days');
    this.props.setActiveDate(advanced);
  }

  handleBackButton() {
    const activeDate = this.props.activeDate.clone();
    const back = activeDate.subtract(7, 'days');
    this.props.setActiveDate(back);
  }

  render() {
    const todayButton = (
      <div
        onClick={() => this.handleTodayButton()}
        className="go-to-today"
      >
        <span>Today</span>
      </div>
    );

    const backButton = (
      <div
        onClick={() => this.handleBackButton()}
        className="arrow back"
      >
        <img src={'./assets/grey-back-arrow.png'} />
      </div>
    );

    const advanceButton = (
      <div
        onClick={() => this.handleAdvanceButton()}
        className="arrow forward"
      >
        <img src={'./assets/grey-forward-arrow.png'} />
      </div>
    );

    const month = this.props.activeDate.format('MMMM');
    const year = this.props.activeDate.format('YYYY');
    const format = this.props.calendarViewType;

    let weekMonthButtons = ["select-week-active", "select-month"];
    if (format === "month") {
      weekMonthButtons = ["select-week", "select-month-active"];
    }

    return (
      <div className="cal-controls-container">
        <div className="left-side">
          <div className="day-control-buttons">
            {backButton}
            {todayButton}
            {advanceButton}
          </div>
          <div className="month-year">
            <span className="bold">{month} </span><span>{year}</span>
          </div>
        </div>
        <div className="right-side">
          <div className="week-month-buttons">
            <div className={weekMonthButtons[0]}>
              <span>Week</span>
            </div>
            <div className={weekMonthButtons[1]}>
              <span>Month</span>
            </div>
          </div>
          <div className="settings">
            <img src={'./assets/settings.png'} />
          </div>
        </div>
      </div>
    );
  }
}

CalendarControls.propTypes = {
  activeDate: React.PropTypes.object.isRequired,
  setActiveDate: React.PropTypes.func.isRequired,
};
