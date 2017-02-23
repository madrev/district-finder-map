import { displayRep } from './rep_display.js';
import { setResultText, hideResults } from './zip_finder.js';

const partyColor = feature  => {
  let rep = feature.getProperty("REP");
  if(!rep) return "gray";
  else if(rep.party === "D") return "blue";
  else if(rep.party === "R") return "red";
};

const hideOverlay = () => {
  window.setTimeout( () => $("#overlay").remove(), 1000 );
};

let map;

export const initMap = () => {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: {lat: 37.0902, lng: -95.71},
    mapTypeControl: false,
  });

  let dataUrl = 'https://raw.githubusercontent.com/sisterdistricttech/web-widgets/master/districts_with_ids.json';
  map.data.loadGeoJson(dataUrl, { idPropertyName: "ID" }, hideOverlay);

  map.data.setStyle( feature => (
    {
      fillColor: partyColor(feature),
      strokeWeight: 0.35
    }
  ));

  const infowindow = new google.maps.InfoWindow;

  map.data.addListener('click', function(event) {
    let feature = event.feature;
    styleActive(feature);
    let districtNum = feature.f["CD115FP"];
    let districtType = (districtNum == "00" ? "at large" : `District ${districtNum}`);
    infowindow.setPosition(event.latLng);
    console.log(event.latLng);
    infowindow.setContent(`${feature.f["STATE"]} ${districtType}`);
    infowindow.open(map);
    displayRep(feature.f["REP"]);
    hideResults();
    // setResultText(`You have selected ${feature.getProperty("ID").slice(0,2)}-${districtType}`);
  });



};

const zoomTo = (lat, lng) => {
  let loc = new google.maps.LatLng(lat, lng);
  map.setCenter(loc);
  map.setZoom(12);
};

export const fitTo = feature => {
  styleActive(feature);
  let bounds = new google.maps.LatLngBounds();
  let geo = feature.getGeometry();
  geo.forEachLatLng( (latlng) => {
    bounds.extend(latlng);
  });
  let boundsLiteral = bounds.toJSON();
  map.fitBounds(bounds);
};

export const styleActive = feature => {
  map.data.revertStyle();
  map.data.overrideStyle(feature, {
    strokeColor: partyColor(feature),
    strokeWeight: 2,
    fillOpacity: 0.1
  });
};

const geocoder = new google.maps.Geocoder();

export const geocode = zip => {
  geocoder.geocode({'address': zip}, res => {
    let lat = res[0].geometry.location.lat();
    let lng = res[0].geometry.location.lng();
    zoomTo(lat, lng);
  });
};

export const selectFeature = (state, district) => {
  let idString = state + (parseInt(district) < 10 ? "0"+district : district);
  return map.data.getFeatureById(idString);
};
