const columnData = [
  { id: '0', name: 'date', label: 'Date', selected: true, fixed: true },
  { id: '1', name: 'app_name', label: 'App', selected: true, fixed: true },
  { id: '2', name: 'clicks', label: 'Clicks', selected: true },
  { id: '3', name: 'impressions', label: 'Impressions', selected: true },
  { id: '4', name: 'requests', label: 'Requests', selected: false },
  { id: '5', name: 'responses', label: 'Responses', selected: true },
  { id: '6', name: 'revenue', label: 'Revenue', selected: false },
  { id: '7', name: 'fill_rate', label: 'Fill Rate', selected: true },
  { id: '8', name: 'ctr', label: 'CTR', selected: true },
];

const apps = {};
const reportsData = {};

const columnReducer = (state = columnData, action) => {
  switch (action.type) {
    case 'UPDATE_COLUMNS':
      return action.payload;
    case 'RESET_COLUMNS':
      return action.payload;
    default:
      return state;
  }
};

const settingsReducer = (state = { showMetrics: false }, action) => {
  switch (action.type) {
    case 'TOGGLE_SETTINGS':
      return { ...state, showMetrics: !state.showMetrics };
    default:
      return state;
  }
};

const reportsReducer = (state = reportsData, action) => {
  switch (action.type) {
    case 'SET_REPORTS_DATA':
      return action.payload;
    default:
      return state;
  }
};

const appsReducer = (state = apps, action) => {
  switch (action.type) {
    case 'SET_APPS_DATA':
      return action.payload;
    default:
      return state;
  }
};

const draggedColumnsReducer = (state = [], action) => {
  switch (action.type) {
    case 'UPDATE_DRAGGED_COLUMNS':
      return action.payload;
    default:
      return state;
  }
};

export {
  reportsReducer,
  columnReducer,
  settingsReducer,
  columnData,
  draggedColumnsReducer,
  appsReducer,
};
