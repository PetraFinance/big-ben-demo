import React from 'react';
import { genUniqueIdentifier } from '../../helpers/html';

export default class IntegrationsCalendar extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const plugins = ['Trello', 'Todoist'];
    const integrations = plugins.map((plugin, i) => (
      <div className="integrations-row" key={genUniqueIdentifier([i, plugin])}>
        <div className="integration-name">
          <span>{plugin}</span>
        </div>
        <div className="integration-item" />
        <div className="integration-item" />
        <div className="integration-item" />
        <div className="integration-item" />
        <div className="integration-item" />
        <div className="integration-item" />
        <div className="integration-item" />
      </div>
    ));

    return (
      <div className="integrations-calendar">
        {integrations}
      </div>
    );
  }
}
