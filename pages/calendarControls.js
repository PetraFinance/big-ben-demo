import React from 'react'
import { prefixLink } from 'gatsby-helpers';

export default class CalendarControls extends React.Component {
  render () {
    return (
      <div className="cal-controls-container">
        <div className="left-side">

          <div className="day-control-buttons">
            <div className="arrow back">
              <img src={prefixLink("./assets/grey-back-arrow.png")} />
            </div>
            <div className="go-to-today">
              <span>Today</span>
            </div>
            <div className="arrow forward">
              <img src={prefixLink("./assets/grey-forward-arrow.png")} />
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
            <img src={prefixLink("./assets/settings.png")} />
          </div>

        </div>

      </div>
    )
  }
}
