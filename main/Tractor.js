import axios from 'axios';

import Logger from './Logger';

export default class Tractor {
  // const url = "http://tractor/Tractor/monitor?q=login&user=" + user + "&c=" + password;
  constructor() {
    this.tsid;
  }

  fetchData(url) {
    return axios.get(url)
     .then(response => response.data)
     .catch(error => error)
  }

  connect(cb) {
    console.log("connect");
    this.fetchData('http://tractor/Tractor/monitor?q=login&user=root')
      .then((res) => {
        this.tsid = res.tsid;
        Logger.info(this.tsid);
        cb();
      })
      .catch(error => {
        console.log(error);
      });
  }

  getJobs(data, cb) {
    if(this.tsid) {
      Logger.warning("Get Jobs");
      let filtername = `${data.project}.joblist`;
      axios.get(`http://tractor/Tractor/monitor?q=jobs&filter=${filtername}&tsid=${this.tsid}`)
        .then(function (res) {
          // handle success
          //faire truc avec jobs
          let jobs = {};
          let users = res.data.users;
          let userNames = Object.keys(users);
          for(let i = 0; i < userNames.length; i++) {
            let user = users[userNames[i]];
            let jobIds = Object.keys(user);
            for(let j = 0; j < jobIds.length; j++) {
              jobs[jobIds[j]] = user[jobIds[j]].data;
            }
          }
          console.log(jobs);
          cb("jobs", jobs);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
          console.log("-------------------- ERROR ----------------------------");
        })
    }
  }
}
