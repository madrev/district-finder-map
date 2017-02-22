export const displayRep = rep => {
  if(!rep) {
    $("#rep-name").html(`This congressional seat is currently vacant.`);
    $("#rep-details").addClass("hidden");
  } else {
    $("#rep-name").text(`Your rep is ${rep.first_name} ${rep.last_name}`);
    $("#rep-party").html(`${rep.party}`);
    $("#rep-phone").html(`${rep.phone}`);
    $("#rep-website").html(`${rep.website}`);
    $("#rep-website").attr("href", `${rep.website}`);
    $("#rep-twitter").html(`${rep.twitter_id}`);
    $("#rep-twitter").attr("href", `https://www.twitter.com/${rep.twitter_id}`);
    $("#rep-details").removeClass("hidden");
  }
  $("#rep-display").removeClass("hidden");
  $("#no-rep-results").addClass("hidden");
};

export const hideRep = () => {
  $("#rep-display").addClass("hidden");
  $("#no-rep-results").removeClass("hidden");
};
