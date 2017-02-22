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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectFeature = exports.geocode = exports.styleActive = exports.fitTo = exports.initMap = undefined;

var _rep_display = __webpack_require__(1);

var _zip_finder = __webpack_require__(2);

var partyColor = function partyColor(feature) {
  var rep = feature.getProperty("REP");
  if (!rep) return "gray";else if (rep.party === "D") return "blue";else if (rep.party === "R") return "red";
};

var hideOverlay = function hideOverlay() {
  window.setTimeout(function () {
    return $("#overlay").remove();
  }, 1000);
};

var map = void 0;

var initMap = exports.initMap = function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: { lat: 37.0902, lng: -95.71 },
    mapTypeControl: false
  });

  var dataUrl = 'https://raw.githubusercontent.com/sisterdistricttech/web-widgets/master/districts_with_ids.json';
  map.data.loadGeoJson(dataUrl, { idPropertyName: "ID" }, hideOverlay);

  map.data.setStyle(function (feature) {
    return {
      fillColor: partyColor(feature),
      strokeWeight: 0.35
    };
  });

  var infowindow = new google.maps.InfoWindow();

  map.data.addListener('click', function (event) {
    var feature = event.feature;
    styleActive(feature);
    var districtNum = feature.f["CD115FP"];
    var districtType = districtNum == "00" ? "at large" : 'District ' + districtNum;
    infowindow.setPosition(event.latLng);
    console.log(event.latLng);
    infowindow.setContent(feature.f["STATE"] + ' ' + districtType);
    infowindow.open(map);
    (0, _rep_display.displayRep)(feature.f["REP"]);
    (0, _zip_finder.hideResults)();
    // setResultText(`You have selected ${feature.getProperty("ID").slice(0,2)}-${districtType}`);
  });
};

var zoomTo = function zoomTo(lat, lng) {
  var loc = new google.maps.LatLng(lat, lng);
  map.setCenter(loc);
  map.setZoom(12);
};

var fitTo = exports.fitTo = function fitTo(feature) {
  styleActive(feature);
  var bounds = new google.maps.LatLngBounds();
  var geo = feature.getGeometry();
  geo.forEachLatLng(function (latlng) {
    bounds.extend(latlng);
  });
  var boundsLiteral = bounds.toJSON();
  map.fitBounds(bounds);
};

var styleActive = exports.styleActive = function styleActive(feature) {
  map.data.revertStyle();
  map.data.overrideStyle(feature, {
    strokeColor: partyColor(feature),
    strokeWeight: 2,
    fillOpacity: 0.1
  });
};

var geocoder = new google.maps.Geocoder();

var geocode = exports.geocode = function geocode(zip) {
  geocoder.geocode({ 'address': zip }, function (res) {
    var lat = res[0].geometry.location.lat();
    var lng = res[0].geometry.location.lng();
    zoomTo(lat, lng);
  });
};

var selectFeature = exports.selectFeature = function selectFeature(state, district) {
  var idString = state + (parseInt(district) < 10 ? "0" + district : district);
  return map.data.getFeatureById(idString);
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var displayRep = exports.displayRep = function displayRep(rep) {
  if (!rep) {
    $("#rep-name").html("This congressional seat is currently vacant.");
    $("#rep-details").addClass("hidden");
  } else {
    $("#rep-name").text("Your rep is " + rep.first_name + " " + rep.last_name);
    $("#rep-party").html("" + rep.party);
    $("#rep-phone").html("" + rep.phone);
    $("#rep-website").html("" + rep.website);
    $("#rep-website").attr("href", "" + rep.website);
    $("#rep-twitter").html("" + rep.twitter_id);
    $("#rep-twitter").attr("href", "https://www.twitter.com/" + rep.twitter_id);
    $("#rep-details").removeClass("hidden");
  }
  $("#rep-display").removeClass("hidden");
  $("#no-rep-results").addClass("hidden");
};

var hideRep = exports.hideRep = function hideRep() {
  $("#rep-display").addClass("hidden");
  $("#no-rep-results").removeClass("hidden");
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hideResults = exports.setResultText = exports.retrieveDistrict = undefined;

var _map_setup = __webpack_require__(0);

var _rep_display = __webpack_require__(1);

var retrieveDistrict = exports.retrieveDistrict = function retrieveDistrict(zip) {
  return $.ajax({
    method: "GET",
    url: "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20json%20where%20url%3D%22https%3A%2F%2Fcongress.api.sunlightfoundation.com%2Fdistricts%2Flocate%3Fzip%3D" + zip + "%22&format=json&diagnostics=true&callback=",
    success: function success(res) {
      return handleResults(res, zip);
    }
  });
};

var handleResults = function handleResults(res, zip) {
  var jsonResults = res.query.results.json;
  var resultCount = jsonResults.count;

  if (resultCount === "1") {
    handleSingleResult(jsonResults.results);
  } else if (resultCount === "0") {
    handleNoResults();
  } else {
    var resultArr = jsonResults.results;
    handleMultipleResults(resultArr, resultCount, zip);
  }
};

var handleSingleResult = function handleSingleResult(result) {
  var feature = (0, _map_setup.selectFeature)(result.state, result.district);
  console.log(feature);
  window.feature = feature;
  (0, _map_setup.fitTo)(feature);
  (0, _rep_display.displayRep)(feature.getProperty("REP"));

  var resultText = $("<p class='district-text'></p>").text("Your district is " + result.state + "-" + (result.district === '0' ? 'at-large' : result.district) + ".");
  setResultText(resultText);
};

var handleNoResults = function handleNoResults() {
  (0, _rep_display.hideRep)();
  var resultText = $("<p></p>").text("We couldn't find districts for that ZIP code. Please check your entry and try again.");
  setResultText(resultText);
};

var handleMultipleResults = function handleMultipleResults(resultArr, resultCount, zip) {
  (0, _map_setup.geocode)(String(zip));

  (0, _rep_display.hideRep)();
  var resultText = $("<div></div>").html("\n    <p>Your ZIP code crosses " + resultCount + " districts:</p>\n  ");
  var districtList = $("<ul></ul>");
  resultArr.forEach(function (result) {
    return districtList.append("<li>" + result.state + "-" + result.district + "</li>");
  });
  resultText.append(districtList);

  var mapReferenceText = $("<p></p>").text("Click on your neighborhood on the map to reveal your district.");
  resultText.append(mapReferenceText);

  setResultText(resultText);
};

var setResultText = exports.setResultText = function setResultText(text) {
  $("#district-results").html(text);
  $("#district-results").removeClass("hidden");
};

var hideResults = exports.hideResults = function hideResults() {
  $("#district-results").addClass("hidden");
};

exports.default = retrieveDistrict;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _map_setup = __webpack_require__(0);

var _zip_finder = __webpack_require__(2);

var _rep_display = __webpack_require__(1);

window.initMap = _map_setup.initMap;

$(function () {
  (0, _map_setup.initMap)();
  $("form").submit(function (e) {
    e.preventDefault();
    var zip = e.target.zip.value;
    (0, _zip_finder.retrieveDistrict)(zip);
    return false;
  });
});

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map