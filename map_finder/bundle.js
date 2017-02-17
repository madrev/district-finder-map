/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.geocode = exports.initMap = undefined;

var _rep_display = __webpack_require__(3);

var map = void 0;

var initMap = exports.initMap = function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: { lat: 37.0902, lng: -95.71 }
  });

  map.data.loadGeoJson('https://raw.githubusercontent.com/madrev/sister_district_sandbox/master/reps_added.json');

  map.data.setStyle(function (feature) {
    var color = 'gray';
    if (feature.f["REP"]) {
      if (feature.f["REP"].party === "D") {
        color = "blue";
      } else if (feature.f["REP"].party === "R") {
        color = "red";
      }
    }
    return {
      fillColor: color,
      strokeWeight: 0.35
    };
  });

  var infowindow = new google.maps.InfoWindow();

  map.data.addListener('click', function (event) {
    window.feature = event.feature;
    var districtNum = event.feature.f["CD115FP"];
    var districtType = districtNum == "00" ? "at large" : 'District ' + districtNum;
    infowindow.setPosition(event.latLng);
    infowindow.setContent(event.feature.f["STATE"] + ' ' + districtType);
    infowindow.open(map);
    (0, _rep_display.displayRep)(event.feature.f["REP"]);
  });
};

var zoomTo = function zoomTo(lat, lng) {
  var loc = new google.maps.LatLng(lat, lng);
  map.setCenter(loc);
  map.setZoom(13);
};
window.zoomTo = zoomTo;

var geocoder = new google.maps.Geocoder();

var geocode = exports.geocode = function geocode(zip) {
  geocoder.geocode({ 'address': zip }, function (res) {
    var lat = res[0].geometry.location.lat();
    var lng = res[0].geometry.location.lng();
    zoomTo(lat, lng);
  });
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _map_setup = __webpack_require__(0);

var retrieveDistrict = function retrieveDistrict(zip) {
  return $.ajax({
    method: "GET",
    url: "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20json%20where%20url%3D%22https%3A%2F%2Fcongress.api.sunlightfoundation.com%2Fdistricts%2Flocate%3Fzip%3D" + zip + "%22&format=json&diagnostics=true&callback=",
    success: function success(res) {
      return appendResults(res);
    }
  });
};

var appendResults = function appendResults(res) {
  var jsonResults = res.query.results.json;
  var districtText = void 0;

  if (jsonResults.count === "1") {
    var result = jsonResults.results;
    districtText = $("<p class='district-text'></p>").text("Your district is " + result.state + "-" + (result.district === '0' ? 'at-large' : result.district) + ".");
  } else if (jsonResults.count === "0") {
    districtText = $("<p></p>").text("We couldn't find districts for that ZIP code. Please check your entry and try again.");
  } else {
    var resultArr = jsonResults.results;
    districtText = $("<div></div>").html("\n        <p>Your ZIP code crosses " + jsonResults.count + " districts:</p>\n      ");
    var districtList = $("<ul></ul>");
    resultArr.forEach(function (result) {
      return districtList.append("<li>" + result.state + "-" + result.district + "</li>");
    });
    districtText.append(districtList);
    var mapReferenceText = $("<p></p>").text("Click on your neighborhood on the map above to reveal your district.");
    districtText.append(mapReferenceText);
  }

  $("#district-results").html(districtText);
};

exports.default = retrieveDistrict;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _map_setup = __webpack_require__(0);

var _zip_finder = __webpack_require__(1);

var _zip_finder2 = _interopRequireDefault(_zip_finder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.initMap = _map_setup.initMap;

$(function () {
  (0, _map_setup.initMap)();
  $("form").submit(function (e) {
    e.preventDefault();
    var zip = e.target.zip.value;
    (0, _map_setup.geocode)(String(zip));
    (0, _zip_finder2.default)(zip);
    return false;
  });
});

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var displayRep = exports.displayRep = function displayRep(rep) {
  $(".rep-name").text("Your rep is " + rep.first_name + " " + rep.last_name);
  $(".rep-party").text("Party: " + rep.party);
  $(".rep-phone").text("Phone: " + rep.phone);
  $(".rep-website").text("Website: " + rep.website);
  $(".rep-twitter").text("Twitter: " + rep.twitter_id);
};

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map