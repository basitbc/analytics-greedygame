import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import Analytics from '../../modules/Analytics';
import { DateRangePicker } from 'rsuite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import Settings from '../../components/Settings/Settings';
import './Home.css';

import {
  setReportsData,
  toggleSettings,
  setAppsData,
} from '../../redux/actions/Actions';
import Table from '../../components/Table/Table';

const Home = ({ reportsData, setReportsData, toggleSettings, setAppsData }) => {
  const cache = require('../../cache/index');

  const fetchReports = useCallback(
    async (startDate, endDate) => {
      const cacheKey = `${startDate}-${endDate}`;
      const cachedData = cache.get(cacheKey);

      if (cachedData) {
        setReportsData(cachedData);
        return;
      }

      try {
        const response = await Analytics.getAllReports(startDate, endDate);
        setReportsData(response?.data);
        cache.set(cacheKey, response?.data);
      } catch (error) {
        console.error(error);
      }
    },
    [cache, setReportsData]
  );

  const fetchApps = useCallback(async () => {
    const cacheKey = 'apps';
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      setAppsData(cachedData);
      return;
    }

    try {
      const response = await Analytics.getAllApps();

      setAppsData(response?.data);
      cache.set(cacheKey, response?.data);
    } catch (error) {
      console.error(error);
    }
  }, [cache, setAppsData]);

  const handleDateRangeChange = useCallback(
    (dates) => {
      if (dates) {
        const [start, end] = dates;
        if (start && end) {
          const formattedStartDate = start.toISOString().slice(0, 10);
          const formattedEndDate = end.toISOString().slice(0, 10);
          setReportsData({}); // clear reports data in the store
          fetchReports(formattedStartDate, formattedEndDate);
        }
      } else {
        setReportsData({});
      }
    },
    [fetchReports, setReportsData]
  );

  const setMetricsModalVisible = useCallback(() => {
    toggleSettings();
  }, [toggleSettings]);

  useEffect(() => {
    if (!reportsData || Object.keys(reportsData).length === 0) {
      fetchReports('2021-05-01', '2021-05-03');
      fetchApps();
    }
  }, [reportsData, fetchReports, fetchApps]);

  return (
    <div>
      <header className='header-container'>
        <h4>Analytics</h4>
      </header>

      <div className='utilities-container'>
        <div>
          <DateRangePicker onChange={handleDateRangeChange} />
        </div>
        <div>
          <button
            className='settings-button'
            onClick={() => setMetricsModalVisible(true)}
          >
            <FontAwesomeIcon icon={faCog} />
            <span>Settings</span>
          </button>
        </div>
      </div>

      <Settings />

      <div>
        <Table />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  reportsData: state.reports.reportsData,
});

const mapDispatchToProps = {
  setReportsData,
  toggleSettings,
  setAppsData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
