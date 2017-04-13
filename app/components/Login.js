import React from 'react';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="login-page">
        <div className="login-container">
          <div className="introduction">
            Hey, we&#39;re Petra Labs. Right now, we&#39;re working on a calendar application that will hopefully make your life a little bit easier. To try it out, just start by logging in with Google below.
          </div>
          <a href="https://api.cal.trypetra.com/auth/redirect/" target="_blank">
            <div className="buttons-container">
              <div className="login-button">Login with Google</div>
            </div>
          </a>
        </div>
      </div>
    );
  }
}
