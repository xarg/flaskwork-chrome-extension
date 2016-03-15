import React from 'react';
import cx from 'classnames';
import InfoStore from '../stores/InfoStore';
import InfoActions from '../actions/InfoActions';
import {ms} from '../utils';
let {Component, PropTypes} = React;


class RequestItem extends Component {
  static propTypes = {
    uuid: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      info: InfoStore.get(props.uuid)
    };
  }

  shouldComponentUpdate(props, state) {
    return props.uuid !== this.props.uuid || state.info !== this.state.info ||
      props.active !== this.props.active;
  }

  render() {
    var {request, response} = this.state.info;
    var info = this.state.info;
    var classes = cx('request-item', {
      active: this.props.active
    });

    console.log('active', this.props.active);

    return (
      <div className={classes} onClick={this._onClick}>
        <div className="request-url">{request.url}</div>
        <div className="request-method">{request.method}</div>
        <div className="request-status">{response.status}</div>
        <div className="request-time">
          <div className="request-total-time">{ms(info.total_time)}</div>
          <div className="request-db-time">{ms(info.database_time)}</div>
        </div>
      </div>
    );
  }

  _onClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    InfoActions.select(this.props.uuid);
  }
}


export default class RequestList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      requests: InfoStore.getAll(),
      selectedInfo: InfoStore.getSelected()
    };
  }

  shouldComponentUpdate(props, state) {
    return state.requests !== this.state.requests ||
      state.selectedInfo !== this.state.selectedInfo
  }

  componentDidMount() {
    InfoStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    InfoStore.removeChangeListener(this._onChange);
  }

  render() {

    return (
      <div className="request-list">
        <div className="request-list-header">
          <div className="request-item">
            <div className="request-url">URL</div>
            <div className="request-method">Method</div>
            <div className="request-status">Status</div>
            <div className="request-time">Time</div>
          </div>
        </div>
        <div className="request-list-items">
          {this.state.requests.map(i =>
            <RequestItem active={i === this.state.selectedInfo} uuid={i.uuid} key={i.uuid} />
          )}
        </div>
      </div>
    );
  }

  _onChange = () => {
    this.setState({
      requests: InfoStore.getAll(),
      selectedInfo: InfoStore.getSelected()
    });
  }
}