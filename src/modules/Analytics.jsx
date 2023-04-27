import axios from 'axios';

class Analytics {
  getAllReports(startDate, endDate) {
    return axios.get(
      `http://go-dev.greedygame.com/v3/dummy/report?startDate=${startDate}&endDate=${endDate}`
    );
  }
  getAllApps() {
    return axios.get(`http://go-dev.greedygame.com/v3/dummy/apps`);
  }
}

const analytics = new Analytics();
export default analytics;
