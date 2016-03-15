import {EventEmitter} from 'events';
import assign from 'object-assign';
import dispatcher from '../dispatcher';
import {InfoConstants} from '../constants';


const CHANGE_EVENT = 'change';
var infos = [];
var infosById = {};
var selectedInfo = null;


const InfoStore = assign(new EventEmitter(), {
  getAll() {
    return infos;
  },

  get(uuid) {
    return infosById[uuid] || null;
  },

  getSelected() {
    return selectedInfo;
  },

  emitChange() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener(fn) {
    this.addListener(CHANGE_EVENT, fn);
  },

  removeChangeListener(fn) {
    this.removeListener(CHANGE_EVENT, fn);
  },

  dispatchToken: dispatcher.register(action => {
    switch (action.type) {
      case InfoConstants.ADD:
        let oldInfo = infosById[action.uuid];
        if (oldInfo) {
          let index = infos.indexOf(oldInfo);
          if (index !== -1) {
            infos.splice(index, 1);
          }
        }
        infosById[action.uuid] = action.info;
        action.info.uuid = action.uuid;
        infos.push(action.info);
        infos = infos.slice();
        InfoStore.emitChange();
        break;
      case InfoConstants.SELECT:
        selectedInfo = infosById[action.uuid] || null;
        InfoStore.emitChange();
        break;
      case InfoConstants.RESET:
        selectedInfo = null;
        infos = [];
        infosById = {};
        InfoStore.emitChange();
        break;
    }

    return true;
  })
});


export default InfoStore;