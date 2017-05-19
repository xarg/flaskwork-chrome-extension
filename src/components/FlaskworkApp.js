import React from 'react';
import InfoActions from '../actions/InfoActions';
// Components
import RequestList from './RequestList';
import RequestDetails from './RequestDetails';
let {Component, PropTypes} = React;


var urlPattern = /^(.*?:)\/\/([^\/]*)/;


export default class FlaskworkApp extends Component {
    componentDidMount() {
        chrome.devtools.network.onRequestFinished.addListener(this._onRequest);
        chrome.devtools.network.onNavigated.addListener(this._onNavigated);
    }

    render() {
        return (
            <div className="flaskwork" onClick={this._onClick}>
                <div className="flaskwork-main">
                    <RequestList />
                </div>
                <RequestDetails />
            </div>
        );
    }

    _onNavigated(url) {
        InfoActions.reset();
    }

    _onRequest(request) {
        var uuid;
        var url;

        request.response.headers.forEach(header => {
            if (header.name === 'X-Flaskwork-UUID') {
                uuid = header.value;
                // InfoActions.get(request.request.url, header.value);
            }
            if (header.name === 'X-Flaskwork-URL') {
                url = header.value;
            }
        });

        if (!url) {
            let match = urlPattern.exec(request.request.url);

            if (!match) {
                throw new Error("Could not find protocol and hostname in URL: " + requestUrl);
            }

            url = `${match[1]}//${match[2]}/__flaskwork/${uuid}`;
        }

        if (uuid) {
            InfoActions.get(url, uuid);
        }
    }

    _onClick = (event) => {
        InfoActions.select(null);
    }
}