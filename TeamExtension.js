browser.runtime.onMessage.addListener((obj, sender, response) => {
  let name = obj.playerName;
  console.log("right here");
  if (name) {
    displayInfo(name);
  }
});

const displayInfo = (playerName) => {
  if (document.getElementsByClassName("col-md-4").length == 0) {
    setTimeout(() => {
      displayInfo(playerName);
    }, 1000);
  } else {
    const playerRightSideDetails =
      document.getElementsByClassName("col-md-4")[0];
    const newSection = generateHTML();

    playerRightSideDetails.prepend(newSection);
  }
};

const getPlayerTeam = async () => {
  fetch();
};

const setPlayerLeagueImage = (leagueName) => {
  switch (leagueName) {
    case "Challenger":
      return browser.runtime.getURL("Assets/Challenger.png");
    case "Advanced":
      return browser.runtime.getURL("Assets/Advanced.png");
    case "Main":
      return browser.runtime.getURL("Assets/Main.png");
    case "Intermediate":
      return browser.runtime.getURL("Assets/Intermediate.png");
    case "Open":
      return browser.runtime.getURL("Assets/Open.png");
    default:
      return browser.runtime.getURL("Assets/Open.png");
  }
};

const generateHTML = () => {
  //Generates Header to designate section
  const teamStatTitle = document.createElement("h3");
  teamStatTitle.innerHTML = "Team Stats";

  //Generates the div where the league image and win will be
  const newSection = document.createElement("div");
  const teamStatSection = document.createElement("div");
  teamStatSection.className = "profile__block__content";
  const leagueImage = document.createElement("img");
  leagueImage.src = setPlayerLeagueImage("Advanced");
  teamStatSection.appendChild(leagueImage);

  newSection.prepend(teamStatSection);
  newSection.prepend(teamStatTitle);
  return newSection;
};
