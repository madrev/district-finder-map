import { initMap, geocode } from "./map_setup.js";
import { retrieveDistrict } from "./zip_finder.js";
import { hideRep } from "./rep_display.js";

window.initMap = initMap;



$( () => {
  initMap();
  $("form").submit((e) => {
      e.preventDefault();
      let zip = e.target.zip.value;
      retrieveDistrict(zip);
      return false;
    });
  });
