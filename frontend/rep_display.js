export const displayRep = rep => {
  if(!rep) {
    $("#rep-name").html(`This congressional seat is currently vacant.`);
    $("#rep-details").addClass("hidden");
  } else {
    generateTwitterButton(rep);
    $("#rep-name").text(`Your rep is ${rep.first_name} ${rep.last_name}`);
    $("#rep-party").html(`${rep.party}`);
    $("#rep-phone").html(`${rep.phone}`);
    $("#rep-website").html(`${rep.website}`);
    $("#rep-website").attr("href", `${rep.website}`);
    $("#rep-details").removeClass("hidden");
  }
  $("#rep-display").removeClass("hidden");
  $("#no-rep-results").addClass("hidden");
};


const generateTwitterButton = rep => {
  if(rep.twitter_id) {
    $("#rep-twitter").html(`${rep.twitter_id}`);
    $("#rep-twitter").attr("href", `https://www.twitter.com/${rep.twitter_id}`);
    // Skipping the twitter button until I can find a way to improve latency
    // $("#twitter-button").html(` <a href="https://twitter.com/${rep.twitter_id}" class="twitter-follow-button" data-show-count="false" data-show-screen-name="false">Follow</a>`);
    // twttr.widgets.load($("#twitter-button").get(0));
  } else {
    $("#rep-twitter").html(`Not Available`);
    $("#rep-twitter").removeAttr("href");
    $("#twitter-button").empty();
  }
};

export const hideRep = () => {
  $("#rep-display").addClass("hidden");
  $("#no-rep-results").removeClass("hidden");
};
