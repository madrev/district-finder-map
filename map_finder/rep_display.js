export const displayRep = rep => {
  if(!rep) {
    $("#rep-name").html(`This congressional seat is currently vacant.`);
    $("#rep-details").addClass("hidden");
  } else {
    $("#rep-name").text(`Your rep is ${rep.first_name} ${rep.last_name}`);
    $("#rep-party").html(`<strong>Party:</strong> ${rep.party}`);
    $("#rep-phone").html(`<strong>Phone:</strong> ${rep.phone}`);
    $("#rep-website").html(`<strong>Website:</strong> ${rep.website}`);
    $("#rep-twitter").html(`<strong>Twitter:</strong> ${rep.twitter_id}`);
    $("#rep-details").removeClass("hidden");
  }
  $("#rep-display").removeClass("hidden");
  $("#no-rep-results").addClass("hidden");
};

export const hideRep = () => {
  $("#rep-display").addClass("hidden");
  $("#no-rep-results").removeClass("hidden");
};
