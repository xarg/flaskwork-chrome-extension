import dispatcher from '../dispatcher';
import {InfoConstants} from '../constants';
import $ from 'jquery';


const urlPattern = /^(.*?:)\/\/([^\/]*)/;


export default {
  get(url, uuid) {
    return $.ajax({
      url: url,
      type: 'GET'
    }).success(data => {
      dispatcher.dispatch({
        type: InfoConstants.ADD,
        info: data,
        uuid: uuid
      });
    });
  },

  select(uuid) {
    dispatcher.dispatch({
      type: InfoConstants.SELECT,
      uuid: uuid
    });
  },

  reset() {
    dispatcher.dispatch({
      type: InfoConstants.RESET
    });
  }
};