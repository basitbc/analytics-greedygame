import { faDice } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { connect } from 'react-redux';
import './Table.css';

const Table = ({ columns, rows, draggedColumns, apps }) => {
  // Its a Function to format a date string into a more another [1, july 2021] format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    const suffixes = ['st', 'nd', 'rd', 'th'];
    const suffix = suffixes[(day - 1) % 10 < 3 ? (day - 1) % 10 : 3];

    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const monthName = monthNames[monthIndex];

    return `${day}${suffix} ${monthName} ${year}`;
  };

  // its a function to Filter and sort the columns to display based on user selection and dragging
  const displayedColumns = columns
    .filter((col) => col.selected)
    .sort((a, b) => {
      const aIndex = draggedColumns?.findIndex(
        (col) => col.destinationIndex === columns.indexOf(a)
      );
      const bIndex = draggedColumns?.findIndex(
        (col) => col.destinationIndex === columns.indexOf(b)
      );
      return aIndex - bIndex;
    });

  // its a Function to Sort the rows based on the currently displayed columns
  const sortedRows = rows
    ? [...rows].sort((a, b) => {
        let result = 0;
        displayedColumns?.forEach((col) => {
          if (result === 0) {
            result = a[col.name]
              ?.toString()
              .localeCompare(b[col.name].toString());
          }
        });
        return result;
      })
    : [];
  return (
    <div className='table-container'>
      <table>
        <thead>
          <tr>
            {displayedColumns &&
              displayedColumns?.map((col) => (
                <th key={col.name}>{col.label}</th>
              ))}
          </tr>
          <tr style={{ borderStyle: 'none' }}>
            {displayedColumns &&
              displayedColumns.map((col) => {
                if (col.name === 'app_name') {
                  const uniqueApps = new Set(
                    sortedRows?.map((row) => row.app_id)
                  );
                  return <td key={col.name}>{uniqueApps.size}</td>;
                } else if (col.name === 'date') {
                  return <td key={col.name}>{sortedRows?.length}</td>;
                } else {
                  let total = 0;
                  sortedRows?.forEach((row) => {
                    total += row[col.name] || 0;
                  });
                  if (col.name === 'fill_rate') {
                    const fillRate =
                      sortedRows && sortedRows.length > 0
                        ? (
                            (sortedRows.reduce(
                              (total, row) =>
                                total + (row.responses / row.requests || 0),
                              0
                            ) /
                              sortedRows.length) *
                            100
                          ).toFixed(2) + '%'
                        : '-';
                    return <td key={col.name}>{fillRate}</td>;
                  } else if (col.name === 'ctr') {
                    const clicks = sortedRows?.reduce(
                      (total, row) => total + (row.clicks || 0),
                      0
                    );
                    let impressions = sortedRows?.reduce(
                      (total, row) => total + (row.impressions || 0),
                      0
                    );

                    const ctr = impressions
                      ? ((clicks / impressions) * 100).toFixed(2) + '%'
                      : '-';
                    return <td key={col.name}>{ctr}</td>;
                  } else if (col.name === 'revenue') {
                    const revenue = sortedRows?.reduce(
                      (total, row) => total + (row.revenue || 0),
                      0
                    );
                    return (
                      <td key={col.name}>
                        {revenue ? `$${revenue.toFixed(2)}` : '-'}
                      </td>
                    );
                  } else if (
                    col.name === 'clicks' ||
                    col.name === 'requests' ||
                    col.name === 'responses'
                  ) {
                    const value = sortedRows?.reduce(
                      (total, row) => total + (row[col.name] || 0),
                      0
                    );
                    const suffix = value > 1000000 ? 'M' : '';
                    const formattedValue =
                      suffix === 'M' ? (value / 1000000).toFixed(1) : value;
                    return <td key={col.name}>{formattedValue + suffix}</td>;
                  } else if (col.name === 'impressions') {
                    const impressions = sortedRows?.reduce(
                      (total, row) => total + (row.impressions || 0),
                      0
                    );
                    const formattedImpressions = impressions?.toLocaleString(
                      undefined,
                      {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }
                    );
                    return <td key={col.name}>{formattedImpressions}</td>;
                  } else {
                    return <td key={col.name}>{total}</td>;
                  }
                }
              })}
          </tr>
        </thead>
        <tbody>
          {rows &&
            rows.length > 0 &&
            sortedRows?.map((row, index) => {
              const app = apps?.find((app) => app.app_id === row.app_id);
              return (
                <tr key={index}>
                  {displayedColumns &&
                    displayedColumns.map((col) => {
                      if (col.name === 'app_name') {
                        return (
                          <td key={col.name}>
                            <div>
                              <FontAwesomeIcon
                                style={{ marginRight: '10px' }}
                                size='xl'
                                color='#800000'
                                icon={faDice}
                              />
                              {app?.app_name}
                            </div>
                          </td>
                        );
                      } else if (col.name === 'fill_rate') {
                        const adRequest = row?.requests;
                        const adResponse = row?.responses;
                        const fillRate =
                          adRequest && adResponse
                            ? (adResponse / adRequest) * 100
                            : null;
                        return (
                          <td key={col.name}>
                            {fillRate ? `${fillRate.toFixed(2)}%` : '-'}
                          </td>
                        );
                      } else if (col.name === 'ctr') {
                        const clicks = row?.clicks;
                        let impressions = row?.impressions;

                        const ctr = (clicks / impressions) * 100;
                        return (
                          <td key={col.name}>
                            {ctr ? `${ctr.toFixed(2)}%` : '-'}
                          </td>
                        );
                      } else if (col.name === 'revenue') {
                        const revenue = row?.revenue;
                        return (
                          <td key={col.name}>
                            {revenue ? `$${revenue.toFixed(2)}` : '-'}
                          </td>
                        );
                      } else if (col.name === 'responses') {
                        const responses = row?.responses;
                        return (
                          <td key={col.name}>
                            {responses ? responses.toLocaleString() : '-'}
                          </td>
                        );
                      } else if (col.name === 'impressions') {
                        const impressions = row?.impressions;
                        return (
                          <td key={col.name}>
                            {impressions ? impressions.toLocaleString() : '-'}
                          </td>
                        );
                      } else if (col.name === 'clicks') {
                        const clicks = row?.clicks;
                        return (
                          <td key={col.name}>
                            {clicks ? clicks.toLocaleString() : '-'}
                          </td>
                        );
                      } else {
                        return (
                          <td key={col.name}>
                            {col.name === 'date'
                              ? formatDate(row[col.name])
                              : row[col.name]}
                          </td>
                        );
                      }
                    })}
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

const mapStateToProps = (state) => ({
  columns: state.columns,
  rows: state.reports?.data,
  draggedColumns: state?.draggedColumns,
  apps: state.apps?.data,
});

export default connect(mapStateToProps)(Table);
