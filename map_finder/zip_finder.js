import { geocoder, geocode, selectFeature, fitTo } from "./map_setup.js";
import { displayRep, hideRep } from "./rep_display.js";

export const retrieveDistrict = zip => (
    $.ajax({
      method: "GET",
      url: `https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20json%20where%20url%3D%22https%3A%2F%2Fcongress.api.sunlightfoundation.com%2Fdistricts%2Flocate%3Fzip%3D${zip}%22&format=json&diagnostics=true&callback=`,
      success: res => handleResults(res, zip)
    })
  );

const handleResults = (res, zip) => {
  let jsonResults = res.query.results.json;
  let resultCount = jsonResults.count;

  if(resultCount === "1") {
    handleSingleResult(jsonResults.results);
  } else if(resultCount === "0") {
    handleNoResults();
  } else {
    let resultArr = jsonResults.results;
    handleMultipleResults(resultArr, resultCount, zip);
  }

};

const handleSingleResult = result => {
  let feature = selectFeature(result.state, result.district);
  window.feature = feature;
  fitTo(feature);
  displayRep(feature.getProperty("REP"));

  let resultText = $("<p class='district-text'></p>").text(
    `Your district is ${result.state}-${(result.district === '0' ? 'at-large' : result.district)}.`);
    setResultText(resultText);
};


const handleNoResults = () => {
  hideRep();
  let resultText = $("<p></p>").text(`We couldn't find districts for that ZIP code. Please check your entry and try again.`);
  setResultText(resultText);
};

const handleMultipleResults = (resultArr, resultCount, zip) => {
  geocode(String(zip));


  hideRep();
  let resultText = $("<div></div>").html(`
    <p>Your ZIP code crosses ${resultCount} districts:</p>
  `);
  let districtList = $("<ul></ul>");
  resultArr.forEach(result => districtList.append(`<li>${result.state}-${result.district}</li>`));
  resultText.append(districtList);

  let mapReferenceText = $("<p></p>").text(`Click on your neighborhood on the map to reveal your district.`);
  resultText.append(mapReferenceText);

  setResultText(resultText);
};


export const setResultText = text => {
  $("#district-results").html(text);
  $("#district-results").removeClass("hidden");
};


export const hideResults = () => {
  $("#district-results").addClass("hidden");
};






export default retrieveDistrict;
