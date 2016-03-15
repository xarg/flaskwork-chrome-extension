import React from 'react';
import cx from 'classnames';
import InfoStore from '../stores/InfoStore';
let {Component, PropTypes} = React;


export default class RequestDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      info: InfoStore.getSelected()
    };
  }

  componentDidMount() {
    InfoStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    InfoStore.removeChangeListener(this._onChange);
  }

  shouldComponentUpdate(props, state) {
    return state.info !== this.state.info;
  }

  render() {
    var queries = this.state.info ? this.state.info.queries : [];
    var classes = cx('request-details', {
      show: this.state.info
    });

    return (
      <div className={classes}>
        <ul className="queries">
          {queries.map((i, n) =>
            <li key={n}>
              <div className="query-statement">{i.statement}</div>
              <div className="query-time">{i.query_time}</div>
            </li>
          )}
        </ul>
      </div>
    );
  }

  _onChange = () => {
    this.setState({
      info: InfoStore.getSelected()
    });
  }
}