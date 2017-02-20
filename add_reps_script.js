const data = require('./reps_added.json');
const fetch = require('node-fetch');
const fs = require('fs');


const fetchAndAdd = (feature) => {
  if(feature.properties["REP"]) return true;
  let lat = feature.properties["INTPTLAT"];
  let lng = feature.properties["INTPTLON"];
  let url = `http://congress.api.sunlightfoundation.com/legislators/locate?latitude=${lat}&longitude=${lng}`;
  fetch(url)
    .then(function(res) {
        return res.json();
    }).then(function(json) {
        if(!json.results) console.log(json);
        json.results.forEach(result => {
          if(result.chamber === "house") {
          feature.properties["REP"] = result;
          console.log(feature.properties);
        }
        });
    }).catch(err => console.log(err));
};


const updateData = obj => {
  return new Promise((resolve, reject) => {
    obj.features.forEach( feat => fetchAndAdd(feat));
    setTimeout(function(){if(obj.features[344].properties["REP"]) resolve(obj);}, 30000);
  });
};

updateData(data).then( res => fs.writeFile("testing.json", JSON.stringify(res)));
