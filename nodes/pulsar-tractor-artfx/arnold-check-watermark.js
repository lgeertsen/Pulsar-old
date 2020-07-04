const path = require('path');
const fs = require('fs');
const axios = require('axios');

var jid;
var owner;
var logUrl;

var watermarkPaths = [];

var frames = [];
var filePath;

const searchTask = process.argv[4];

const main = (folder, id) => {
  let file = path.join(folder, "jid.txt");
  jid = fs.readFileSync(file, "utf8");
  filePath = path.join(folder, `${id}.txt`);
  fs.appendFile(filePath, "", (err) => {
    if(err) throw err;
    getJob();
  });
}

const getJob = () => {
  axios.get(`http://tractor/Tractor/monitor?q=jtree&jid=${jid}`)
  .then(function (response) {
    // handle success
    let data = response.data;
    owner = Object.keys(data.users)[0];
    console.log(owner);
    console.log(data);
    let children = data.users[owner][`J${jid}`].children;
    loopLayers(children)
  })
  .catch(function (error) {
    // handle error
  })
}

const loopLayers = (layers) => {
  for(let i in layers) {
    let layer = layers[i];
    // console.log(layer.children);
    let children = layer.children;
    for(let j in children) {
      let child = children[j];
      if(child.data.title == searchTask) {
        console.log(child);
        getTaskUrls(child.children);
      }
    }
    // getLogUrl(child.data.tid);
  }
}

const getTaskUrls = (tasks) => {
  console.log(tasks);
  for(let i in tasks) {
    getLogUrl(tasks[i].data.tid);
  }
}

const getLogUrl = (tid) => {
  axios.get(`http://tractor/Tractor/monitor?q=tasklogs&owner=${owner}&jid=${jid}&tid=${tid}`)
    .then(function (response) {
      // handle success
      logUrl = response.data.LoggingRedirect[0];
      console.log(response.data);
      getLogs();
    })
    .catch(function (error) {
      // handle error
    })

}

const getLogs = () => {
  axios.get(`http://tractor${logUrl}`)
  .then(function (response) {
    let data = response.data;
    let lines = data.split("\n");

    let watermark = false;

    for(let i in lines) {
      if(watermark) {
        if(lines[i].indexOf("[driver_exr] writing file") != -1) {
          // console.log(lines[i]);
          let exrPath = path.normalize(lines[i].split("`")[1]);
          exrSplit = path.basename(exrPath).split(".")[0].split("_");
          frameNum = parseInt(exrSplit[exrSplit.length-1]);
          console.log(frameNum);
          console.log(exrPath);
          frames.push(frameNum);
        } else if(lines[i].indexOf("releasing resources") != -1) {
          console.log(lines[i]);
          watermark = false;
        }
      } else if(lines[i].indexOf("rendering with watermarks because of failed authorization") != -1) {
        console.log(lines[i]);
        watermark = true;
      }
    }
  })
  .catch(function (error) {
    // handle error
    console.log("##########################################");
    console.log("##########################################");
    console.log("##########################################");
    console.log("##########################################");
    console.log("##########################################");
    console.log(error);
  })
}

main(process.argv[2], process.argv[3]);

process.on('exit', (code) => {
  console.log('Process beforeExit event with code: ', code);
  console.log(frames);
  let singleFrames = frames.filter((item, index) => frames.indexOf(item) === index);
  singleFrames.sort((a, b) => {return a - b});
  let framesString = singleFrames.join(",");
  console.log(framesString);
  fs.writeFileSync(filePath, framesString);
});
