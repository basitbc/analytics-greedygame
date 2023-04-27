import { createStore, combineReducers } from 'redux';
import {
  columnReducer,
  settingsReducer,
  reportsReducer,
  draggedColumnsReducer,
  appsReducer,
} from '../reducers/Reducer.js';

const rootReducer = combineReducers({
  columns: columnReducer,
  settings: settingsReducer,
  reports: reportsReducer,
  draggedColumns: draggedColumnsReducer,
  apps: appsReducer,
});

const store = createStore(rootReducer);

export default store;
