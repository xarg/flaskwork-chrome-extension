import React from 'react';
import cx from 'classnames';
import InfoStore from '../stores/InfoStore';
import {ms} from '../utils';
let {Component, PropTypes} = React;


export default class RequestDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      info: InfoStore.getSelected(),
      show: InfoStore.getSelected() ? true : false,
      activeTab: 0
    };
  }

  componentDidMount() {
    InfoStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    InfoStore.removeChangeListener(this._onChange);
  }

  shouldComponentUpdate(props, state) {
    return state.info !== this.state.info ||
      state.activeTab !== this.state.activeTab ||
      state.show !== this.state.show;
  }

  render() {
    var queries = this.state.info ? this.state.info.queries : [];
    var classes = cx('request-details', {
      show: this.state.show
    });

    var panelStyle = {
      transform: `translateX(-${this.state.activeTab * 100}%)`
    };
    var indicatorStyle = {
      transform: `translateX(${this.state.activeTab * 100}%)`
    };

    var request = this.state.info ? this.state.info.request : {};
    var response = this.state.info ? this.state.info.response : {};
    var session = this.state.info ? this.state.info.session : {};
    var profile = this.state.info ? this.state.info.profile : null;
    var queryTime = this.state.info ? this.state.info.database_time : 0;

    function prettify(obj) {
      return JSON.stringify(obj, null, 4);
    }

    return (
      <div className={classes} onClick={this._onClick}>
        <div className="request-details-inner">
          <div className="tabs">
            <div className="tab" onClick={this._go(0)}>
              Request
            </div>
            <div className="tab" onClick={this._go(1)}>
              Response
            </div>
            <div className="tab" onClick={this._go(2)}>
              Session
            </div>
            <div className="tab" onClick={this._go(3)}>
              Queries
            </div>
            {/*<div className="tab" onClick={this._go(4)}>
              Profiling
            </div>*/}
          </div>
          <div className="tab-indicator" style={indicatorStyle}></div>
          <div className="panels" style={panelStyle}>
            <div className="panel request">
              <pre>
                <strong>url:</strong> {request.url}
                <br /><br />
                <strong>method:</strong> {request.method}
                <br /><br />
                <strong>endpoint:</strong> {request.endpoint}
                <br /><br />
                <strong>view args:</strong> {prettify(request.view_args)}
                <br /><br />
                <strong>url rule:</strong> {request.url_rule}
                <br /><br />
                <strong>headers:</strong> {prettify(request.headers)}
              </pre>
            </div>
            <div className="panel response">
              <pre>
                <strong>headers:</strong> {prettify(response.headers)}
              </pre>
            </div>
            <div className="panel session">
              <pre>
                {prettify(session)}
              </pre>
            </div>
            <div className="panel queries">
              <div className="total-queries">
                <strong>Total Queries:</strong> {queries.length} ({ms(queryTime)})
              </div>
              <div className="queries-list">
                <div className="queries-item queries-heading">
                  <div className="query-statement"><span>Query</span></div>
                  <div className="query-time"><span>Time</span></div>
                </div>
                {queries.map((i, n) =>
                  <div className="queries-item" key={n}>
                    <div className="query-statement"><pre>{i.statement}</pre></div>
                    <div className="query-time">
                      <span>{ms(i.query_time)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/*<div className="panel profiling">
              <pre>
                {profile}
              </pre>
            </div>*/}
          </div>
        </div>
      </div>
    );
  }

  _go = (n) => {
    return () => {
      this.setState({
        activeTab: n
      });
    };
  }

  _onClick = (event) => {
    event.stopPropagation();
  }

  _onChange = () => {
    var info = InfoStore.getSelected();

    if (!info) {
      this.setState({
        show: false
      });
    }
    else {
      this.setState({
        info: info,
        show: true
      });
    }
  }
}