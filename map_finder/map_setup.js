import { displayRep } from './rep_display.js';

let map;

export const initMap = () => {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: {lat: 37.0902, lng: -95.71}
  });


map.data.loadGeoJson('https://raw.githubusercontent.com/madrev/sister_district_sandbox/master/reps_added.json');

map.data.setStyle( feature => {
  let color = 'gray';
  if(feature.f["REP"]) {
    if(feature.f["REP"].party === "D") {
      color="blue";
    } else if(feature.f["REP"].party === "R"){
      color="red";
    }
  }
  return{
    fillColor: color,
    strokeWeight: 0.35
  };
});

  const infowindow = new google.maps.InfoWindow;

  map.data.addListener('click', function(event) {
  window.feature = event.feature;
  let districtNum = event.feature.f["CD115FP"];
  let districtType = (districtNum == "00" ? "at large" : `District ${districtNum}`);
  infowindow.setPosition(event.latLng);
  infowindow.setContent(`${event.feature.f["STATE"]} ${districtType}`);
  infowindow.open(map);
  displayRep(event.feature.f["REP"]);
  });
};

const zoomTo = (lat, lng) => {
  let loc = new google.maps.LatLng(lat, lng);
  map.setCenter(loc);
  map.setZoom(13);
}
window.zoomTo = zoomTo;

const geocoder = new google.maps.Geocoder();

export const geocode = zip => {
  geocoder.geocode({'address': zip}, res => {
    let lat = res[0].geometry.location.lat();
    let lng = res[0].geometry.location.lng();
    zoomTo(lat, lng);
  });
};
