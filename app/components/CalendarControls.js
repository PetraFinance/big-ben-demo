import React from 'react'

export default class CalendarControls extends React.Component {
  render () {
    return (
      <div className="cal-controls-container">
        <div className="left-side">
          <div className="day-control-buttons">
            <div className="arrow back">
              <img src={"./assets/grey-back-arrow.png"} />
            </div>
            <div className="go-to-today">
              <span>Today</span>
            </div>
            <div className="arrow forward">
              <img src={"./assets/grey-forward-arrow.png"} />
            </div>
          </div>
          <div className="month-year">
            <span className="bold">February </span><span>2017</span>
          </div>
        </div>
        <div className="right-side">
          <div className="week-month-buttons">
            <div className="select-week">
              <span>Week</span>
            </div>
            <div className="select-month">
              <span>Month</span>
            </div>
          </div>
          <div className="settings">
            <img src={"./assets/settings.png"} />
          </div>
        </div>
      </div>
    )
  }
}
