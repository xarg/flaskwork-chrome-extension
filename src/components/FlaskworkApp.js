import React from 'react';
import InfoActions from '../actions/InfoActions';
let {Component, PropTypes} = React;

// Components
import RequestList from './RequestList';
import RequestDetails from './RequestDetails';


export default class FlaskworkApp extends Component {
  componentDidMount() {
    chrome.devtools.network.onRequestFinished.addListener(this._onRequest);
    chrome.devtools.network.onNavigated.addListener(this._onNavigated);
  }

  render() {
    return (
      <div className="flaskwork" onClick={this._onClick}>
        <h1>Flaskwork</h1>
        <RequestList />
        <RequestDetails />
      </div>
    );
  }

  _onNavigated(url) {
    InfoActions.reset();
  }

  _onRequest(request) {
    request.response.headers.forEach(header => {
      if (header.name === 'X-Flaskwork-UUID') {
        InfoActions.get(request.request.url, header.value);
      }
    });
  }

  _onClick = (event) => {
    InfoActions.select(null);
  }
}