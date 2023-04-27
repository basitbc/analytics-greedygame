const updateColumns = (columns) => ({
  type: 'UPDATE_COLUMNS',
  payload: columns,
});

const resetColumns = (columns) => ({
  type: 'RESET_COLUMNS',
  payload: columns,
});

const toggleSettings = () => ({
  type: 'TOGGLE_SETTINGS',
});

const setReportsData = (reportsData) => ({
  type: 'SET_REPORTS_DATA',
  payload: reportsData,
});

const setAppsData = (appsData) => ({
  type: 'SET_APPS_DATA',
  payload: appsData,
});

const updateDraggedColumns = (draggedColumns) => {
  return {
    type: 'UPDATE_DRAGGED_COLUMNS',
    payload: draggedColumns,
  };
};

export {
  updateColumns,
  resetColumns,
  toggleSettings,
  setReportsData,
  updateDraggedColumns,
  setAppsData,
};
