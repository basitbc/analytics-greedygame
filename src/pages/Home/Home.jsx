import React, { useCallback, useEffect, useState } from 'react';
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
import { useLocation } from 'react-router-dom';

const Home = ({ setReportsData, toggleSettings, setAppsData }) => {
  const cache = require('../../cache/index');
  const [copySuccess, setCopySuccess] = useState(false);
  const location = useLocation();
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

  const handleDateRangeChange = useCallback((dates) => {
    if (dates) {
      const [start, end] = dates;
      if (start && end) {
        const formattedStartDate = start.toISOString().slice(0, 10);
        const formattedEndDate = end.toISOString().slice(0, 10);
        const searchParams = new URLSearchParams({
          start_date: formattedStartDate,
          end_date: formattedEndDate,
        });
        window.history.replaceState(null, '', '?' + searchParams.toString());
        fetchReports(formattedStartDate, formattedEndDate);
      }
    } else {
      window.history.replaceState(null, '', window.location.pathname);
      fetchReports(null, null);
    }
  }, []);

  const setMetricsModalVisible = useCallback(() => {
    toggleSettings();
  }, [toggleSettings]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    fetchApps();
    if (startDate && endDate) {
      fetchReports(startDate, endDate);
    } else {
      const today = new Date();
      const fifteenDaysAgo = new Date(
        today.getTime() - 15 * 24 * 60 * 60 * 1000
      );
      const formattedStartDate = fifteenDaysAgo.toISOString().slice(0, 10);
      const formattedEndDate = today.toISOString().slice(0, 10);
      const searchParams = new URLSearchParams({
        start_date: formattedStartDate,
        end_date: formattedEndDate,
      });
      window.history.replaceState(null, '', '?' + searchParams.toString());
      fetchReports(formattedStartDate, formattedEndDate);
    }
  }, [location.search]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
  };

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
            className={`copy-button ${copySuccess ? 'copied' : ''}`}
            onClick={copyToClipboard}
          >
            {copySuccess ? 'Url Copied!' : 'Copy URL'}
          </button>
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
