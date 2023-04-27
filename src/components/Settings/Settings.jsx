import React, { useState } from 'react';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Settings.css';
import {
  toggleSettings,
  updateColumns,
  updateDraggedColumns,
} from '../../redux/actions/Actions';
import { bindActionCreators } from 'redux';
import { connect, useDispatch } from 'react-redux';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

const Settings = ({ columns, showMetrics, toggleSettings, dragColumn }) => {
  const [localColumns, setLocalColumns] = useState(columns);
  const [draggedColumns, setDraggedColumns] = useState([]);
  const dispatch = useDispatch();

  const handleApplyChangesClick = () => {
    // handle apply changes
    dispatch(updateColumns(localColumns));
    dispatch(updateDraggedColumns(draggedColumns));
  };

  const handleSettingsClose = () => {
    toggleSettings();
  };

  const handleColumnToggle = (columnName) => {
    const selectedCol = columns.find((col) => col.name === columnName);
    if (selectedCol.fixed) {
      window.alert(`You cannot hide the "${columnName}" column`);
      return;
    }

    // Update local state
    const updatedColumns =
      localColumns &&
      localColumns.map((col) =>
        col.name === columnName ? { ...col, selected: !col.selected } : col
      );
    setLocalColumns(updatedColumns);
  };
  const handleDragEnd = (result, snapshot) => {
    if (!result.destination) return;

    const items = Array.from(localColumns);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setLocalColumns(items);
    setDraggedColumns(items.filter((col) => !col.fixed));
  };

  return (
    <div
      className='metrics-container'
      style={{ display: showMetrics ? 'flex' : 'none' }}
    >
      <div className='metrics-header'>
        <h6>Dimensions and Metrics</h6>
      </div>

      <DragDropContext
        onDragEnd={(result, snapshot) => handleDragEnd(result, snapshot)}
      >
        <Droppable droppableId='columns' direction='horizontal'>
          {(provided) => (
            <div
              className='metrics-body'
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {localColumns.map((col, index) => (
                <Draggable key={col.id} draggableId={col.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className='column-container'
                      style={{
                        borderLeft: col.selected ? '7px solid #ff7373' : '',
                        userSelect: 'none',
                        backgroundColor: snapshot.isDragging
                          ? '#eee'
                          : 'inherit',
                        ...provided.draggableProps.style,
                      }}
                      onClick={() => handleColumnToggle(col.name)}
                    >
                      {col.label}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className='metrics-buttons'>
        <button className='metrics-close' onClick={handleSettingsClose}>
          <span>Close</span>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <button className='metrics-apply' onClick={handleApplyChangesClick}>
          Apply Changes
        </button>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  columns: state.columns,
  showMetrics: state.settings.showMetrics,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      toggleSettings,
      updateColumns,
      updateDraggedColumns,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
