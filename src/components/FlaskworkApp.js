import React from 'react';
import InfoActions from '../actions/InfoActions';
let {Component, PropTypes} = React;

// Components
import RequestList from './RequestList';
import RequestDetails from './RequestDetails';


export default class FlaskworkApp extends Component {
  componentDidMount() {
    chrome.devtools.network.onRequestFinished.addListener(this._onRequest);
  }

  render() {
    return (
      <div className="flaskwork">
        <h1>Flaskwork</h1>
        <RequestList />
        <RequestDetails />
      </div>
    );
  }

  _onRequest(request) {
    request.response.headers.forEach(header => {
      if (header.name === 'X-Flaskwork-UUID') {
        InfoActions.get(header.value);
      }
    });
  }
}