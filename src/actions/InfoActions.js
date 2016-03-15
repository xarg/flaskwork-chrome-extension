import dispatcher from '../dispatcher';
import {InfoConstants} from '../constants';
import $ from 'jquery';


export default {
  get(uuid) {
    chrome.devtools.inspectedWindow.eval('location', location => {
      var url = `${location.protocol}//${location.hostname}/__flaskwork/${uuid}`;

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
    });
  },

  select(uuid) {
    dispatcher.dispatch({
      type: InfoConstants.SELECT,
      uuid: uuid
    });
  }
};