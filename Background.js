const faceitAPIURL = "https://open.faceit.com/data/v4/";
const headerAccept = "application/json";
const headerAuthorization = "Bearer 229b8d49-00be-4d43-8170-f4ee80873973";
let leagueLevel = "";
let leagueOrganizerID = "08b06cfc-74d0-454b-9a51-feda4b6b18da";
let playerTeamID = "";
let playerID = "";

browser.tabs.onUpdated.addListener((tabId, tab) => {
  if (tab.url && tab.url.includes("players")) {
    const urlName = tab.url.split("players/")[1];
    if (!urlName.includes("/")) {
      const playerName = urlName;
      console.log(callAPIs(playerName));
      console.log(playerName);
      browser.tabs.sendMessage(tabId, {
        playerName: playerName,
      });
    }
  }
});

const callAPIs = async (username) => {
  const response = await fetch(faceitAPIURL + "search/players?nickname=" + username + "&game=csgo&offset=0&limit=20", {
    method: "GET",
    headers: {
      accept: headerAccept,
      Authorization: headerAuthorization,
    },
  });
  const playerAPIValues = await response.json();
  playerID = playerAPIValues.items[0].player_id;

  // const response2 = await fetch(
  //   faceitAPIURL + "players/" + playerID + "/teams?offset=0&limit=20",
  //   {
  //     method: "GET",
  //     headers: {
  //       accept: headerAccept,
  //       Authorization: headerAuthorization,
  //     },
  //   }
  // );
  // const playerTeamListValues = await response2.json();
  // let listOfTeams = [];
  // console.log(playerTeamListValues.items[0]);
  // for (let i = 0; i < playerTeamListValues.items.length; i++) {
  //   listOfTeams.push(playerTeamListValues.items[i].team_id);
  // }

  getPlayerMatchHistory();
};

const getPlayerMatchHistory = async () => {
  let keepChecking = true;
  let num = 100;

  while (keepChecking) {
    const response = await fetch(faceitAPIURL + "players/" + playerID + "/history?game=csgo&offset=0&limit=" + num, {
      method: "GET",
      headers: {
        accept: headerAccept,
        Authorization: headerAuthorization,
      },
    });
    const currentMatches = await response.json();

    for (let i = 0; i < currentMatches.items.length; i++) {
      if (
        currentMatches.items[i].competition_type === "championship" &&
        currentMatches.items[i].organizer_id === leagueOrganizerID
      ) {
        leagueLevel = currentMatches.items[i].competition_name;

        for (let j = 0; j < currentMatches.items[i].teams.faction1.players.length; j++) {
          if (currentMatches.items[i].teams.faction1.players[j].player_id == playerID) {
            playerTeamID = currentMatches.items[i].teams.faction1.faction_id;
          }
        }
      }
      if (playerTeamID === "") {
        playerTeamID = currentMatches.items[i].teams.faction2.faction_id;
      }
      break;
    }
  }
  if (leagueLevel != "" || currentMatches.items.length < 100) {
    keepChecking = false;
  } else {
    num += 100;
  }
  console.log(leagueLevel);
  console.log(playerTeamID);
};
