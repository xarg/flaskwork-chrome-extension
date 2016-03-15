import React from 'react';
import InfoStore from '../stores/InfoStore';
import InfoActions from '../actions/InfoActions';
let {Component, PropTypes} = React;


class RequestItem extends Component {
  static propTypes = {
    uuid: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      info: InfoStore.get(props.uuid)
    };
  }

  render() {
    var {request, response} = this.state.info;
    var info = this.state.info;

    return (
      <div className="request-item" onClick={this._onClick}>
        <div className="request-url">{request.url}</div>
        <div className="request-method">{request.method}</div>
        <div className="request-time">
          <div className="request-total-time">{info.total_time}</div>
          <div className="request-db-time">{info.database_time}</div>
        </div>
      </div>
    );
  }

  _onClick = (event) => {
    event.preventDefault();
    InfoActions.select(this.props.uuid);
  }
}


export default class RequestList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      requests: InfoStore.getAll()
    };
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
        {this.state.requests.map(i =>
          <RequestItem uuid={i.uuid} key={i.uuid} />
        )}
      </div>
    );
  }

  _onChange = () => {
    this.setState({
      requests: InfoStore.getAll()
    });
  }
}