export const showAbout = e => {
  e.preventDefault();
  $("#about-button").addClass("hidden");
  $("#about-container").removeClass("hidden");
  return false;
};

export const hideAbout = e => {
  e.preventDefault();
  $("#about-container").addClass("hidden");
  $("#about-button").removeClass("hidden");
  return false;
};
