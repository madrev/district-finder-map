export const displayRep = rep => {
  $(".rep-name").text(`Your rep is ${rep.first_name} ${rep.last_name}`);
  $(".rep-party").text(`Party: ${rep.party}`);
  $(".rep-phone").text(`Phone: ${rep.phone}`);
  $(".rep-website").text(`Website: ${rep.website}`);
  $(".rep-twitter").text(`Twitter: ${rep.twitter_id}`);

};
