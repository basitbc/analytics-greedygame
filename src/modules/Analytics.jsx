import axios from 'axios';

const headers = {
  'Content-Type': 'application/json',
  'User-Agent': 'My App 1.0',
};

class Analytics {
  getAllReports(startDate, endDate) {
    return axios.get(
      `http://go-dev.greedygame.com/v3/dummy/report?startDate=${startDate}&endDate=${endDate}`,
      { headers }
    );
  }
  getAllApps() {
    return axios.get(`http://go-dev.greedygame.com/v3/dummy/apps`, { headers });
  }
}

const analytics = new Analytics();
export default analytics;
