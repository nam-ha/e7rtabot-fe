const heroes_file = "assets/heros.json";
const heros_id_by_name = {};
let heroes = {};

// Fetch the JSON file
fetch(heroes_file)
.then(response => {
    // Check if the request was successful
    if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json(); // Parse the JSON data
})
.then(data => {
    // `data` is now a JavaScript object
    console.log(data)
    heroes = data
    console.log(heroes)
    

    Object.entries(heroes).forEach(([id, hero]) => {
        heros_id_by_name[hero.name] = id;
    });

})
.catch(error => {
    console.error("Error fetching the JSON file:", error);
});

let changeTimeout;

function createHeroPicks(containerId) {
    // Container is a <div> element
    const container = document.getElementById(containerId);

    // Create pick element
    const picksContainer = document.createElement("ul");
    container.appendChild(picksContainer);
    picksContainer.classList.add("picks-container");

    for (let i = 0; i < 5; i++) {
        function createSearchDropdown(containerId) {
            function updateDropdown(query = "") {    
                dropdown.innerHTML = ""; // Clear previous results
            
                const filteredHeroes = Object.entries(heroes).filter(([heroId, hero]) =>
                    hero.name.toLowerCase().includes(query.toLowerCase())
                );
            
                if (filteredHeroes.length === 0 && query !== "") {
                    dropdown.style.display = "block"; // Show dropdown if there are no results
            
                    const noResultsMessage = document.createElement("div");
                    noResultsMessage.classList.add("no-results");
                    noResultsMessage.textContent = "No results found";
            
                    dropdown.appendChild(noResultsMessage);
                } else {
                    filteredHeroes.forEach(([id, hero]) => {
                        const dropdownItem = document.createElement("div");
            
                        dropdownItem.classList.add("dropdown-item");
                        dropdownItem.textContent = hero.name;
                        dropdownItem.addEventListener("click", () => {
                            searchInput.value = hero.name;
                            dropdown.style.display = "none"; // Hide dropdown after selection
                        });
            
                        dropdown.appendChild(dropdownItem);
                    });
            
                    dropdown.style.display = filteredHeroes.length > 0 ? "block" : "none"; // Show dropdown if any items match
                }
            }
        
            const container = document.getElementById(containerId);
        
            // Create search box
            const searchInput = document.createElement("input");
            searchInput.type = "text";
            searchInput.placeholder = "Name";
            
            container.appendChild(searchInput);
            searchInput.classList.add("hero-search-box");
        
            // Create dropdown
            const dropdown = document.createElement("div");
            container.appendChild(dropdown);
            dropdown.classList.add("dropdown");
            dropdown.style.display = "none"; // Initially hidden
        
            searchInput.addEventListener("input", function () {
                /*
                    1. Get the value from search input
                    2. Update the dropdown based on the value
                    3. Show the dropdown if there's a value
                */
                const query = searchInput.value;
        
                updateDropdown(query);
        
                // if (query) {
                //     dropdown.style.display = "block"
                // } else {
                //     dropdown.style.display = "none"
                // }
            });
        
            searchInput.addEventListener("change", function () {
                clearTimeout(changeTimeout);
        
                changeTimeout = setTimeout(() => {
                    const selectedHeroId = heros_id_by_name[searchInput.value];
        
                    if (selectedHeroId) {
                        const avatar_url = `assets/avatars/${selectedHeroId}.png`
        
                        avatar.style.backgroundImage = `url(${avatar_url})`;
                        avatar.style.backgroundSize = "cover";
                        avatar.textContent = "";
                    } else {
                        avatar.style.backgroundImage = "none";
                        avatar.textContent = "";
                    }
                }, 100);
            });
        }

        const pickContainer = document.createElement("li");
        picksContainer.appendChild(pickContainer);

        pickContainer.classList.add("pick-container");

        const avatar = document.createElement("div");
        avatar.classList.add("avatar");
        avatar.textContent = "";
        pickContainer.appendChild(avatar);

        // Create search dropdown
        const searchDropdownContainer = document.createElement("div");
        pickContainer.appendChild(searchDropdownContainer);

        searchDropdownContainer.classList.add("search-dropdown-container");
        searchDropdownContainer.id = `search-dropdown-container-${i}`;

        createSearchDropdown(searchDropdownContainer.id);
        
        searchDropdownContainer.removeAttribute("id");

        // Create ban option
        const banButton = document.createElement("button");
        pickContainer.appendChild(banButton);
        banButton.classList.add("btn-ban");
        banButton.textContent = "Ban";

        banButton.addEventListener("click", function () {
            resetPicksColor();
            document.querySelectorAll(`#${containerId} .banned`).forEach(pickContainer => pickContainer.classList.remove("banned"));
            // document.querySelectorAll(`#${containerId} .banned`).forEach(btn => btn.classList.remove("banned"));
            // banButton.classList.add("banned");

            pickContainer.classList.add("banned");
        });

        // picksContainer.appendChild(pickContainer);
    }

    // container.appendChild(picksContainer);
}

function submitMatch() {
    const userPicksName = [[]];
    const opponentPicksName = [[]];

    document.querySelectorAll("#user-picks-container .pick-container").forEach(pickContainer => {
        const searchInput = pickContainer.querySelector(".hero-search-box");

        const isBanned = pickContainer.classList.contains("banned");
 
        if (!isBanned) {
            userPicksName[0].push(searchInput.value);
        }
    });

    document.querySelectorAll("#opponent-picks-container .pick-container").forEach(pickContainer => {
        const searchInput = pickContainer.querySelector(".hero-search-box");
        const isBanned = pickContainer.classList.contains("banned");

        if (!isBanned) {
            opponentPicksName[0].push(searchInput.value);
        }
    });

    const isDistinct = (array) => {
        const uniqueSet = new Set(array);
        return uniqueSet.size === array.length;
    };

    const isInputDistinct = isDistinct([...userPicksName[0], ...opponentPicksName[0]]);

    const isInputCorrect = 
        userPicksName[0].every(key => key in heros_id_by_name) &&
        opponentPicksName[0].every(key => key in heros_id_by_name)

    const isBanningYet = 
        userPicksName[0].length === 4 &&
        opponentPicksName[0].length === 4;

    if (!isInputDistinct) {
        alert("Duplication in inputs.");
        return;
    }

    if (!isInputCorrect) {
        alert("Invalid names in inputs.");
        return;
    }

    if (!isBanningYet) {
        alert("Not ban yet! Please ban 1 pick for both sides.");
        return;
    }

    // Send the API request
    fetch("https/api/v1/predict", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            my_pickss: userPicksName,
            opp_pickss: opponentPicksName,
            my_player_id: "global"
        })
    })
    .then(response => response.json())
    .then(data => {
        const predictions = data.results;
        const scoresColor = data.scoresColor[0];

        let [userWinrate, opponentWinrate] = predictions[0];

        userWinrate = (userWinrate * 100).toFixed(2);
        opponentWinrate = (opponentWinrate * 100).toFixed(2);

        document.getElementById("user-winrate").textContent = `${userWinrate}%`;
        document.getElementById("opponent-winrate").textContent = `${opponentWinrate}%`;

        let colorIndex = 0;
        document.querySelectorAll("#user-picks-container .pick-container").forEach((pickContainer, index) => {
            if (!pickContainer.classList.contains("banned")) {
                pickContainer.style.backgroundColor = `${scoresColor[colorIndex]}`;
                colorIndex += 1;
                console.log(scoresColor[colorIndex])
            };
        })

        document.querySelectorAll("#opponent-picks-container .pick-container").forEach((pickContainer, index) => {
            if (!pickContainer.classList.contains("banned")) {
                pickContainer.style.backgroundColor = `${scoresColor[colorIndex]}`;
                colorIndex += 1;
            };
        })
    })
    .catch(error => console.error("Error:", error));
}

function resetPicksColor() {
    document.querySelectorAll("#user-picks-container .pick-container").forEach(pickContainer => {
        pickContainer.style.removeProperty("background-color");

    });

    document.querySelectorAll("#opponent-picks-container .pick-container").forEach(pickContainer => {
        pickContainer.style.removeProperty("background-color");
    });
}

function refreshMatch() {
    document.getElementById("user-winrate").textContent = document.getElementById("opponent-winrate").textContent = ("")
    document.querySelectorAll("#user-picks-container .pick-container").forEach(pickContainer => {
        const searchInput = pickContainer.querySelector(".hero-search-box");
        searchInput.value = "";

        pickContainer.classList.remove("banned");
        pickContainer.style.removeProperty("background-color");
        const avatar = pickContainer.querySelector(".avatar")

        avatar.style.backgroundImage = "none";
        avatar.style.backgroundSize = "none";
    });

    document.querySelectorAll("#opponent-picks-container .pick-container").forEach(pickContainer => {
        const searchInput = pickContainer.querySelector(".hero-search-box");
        searchInput.value = "";

        pickContainer.classList.remove("banned");
        pickContainer.style.removeProperty("background-color");
        const avatar = pickContainer.querySelector(".avatar")

        avatar.style.backgroundImage = "none";
        avatar.style.backgroundSize = "none";
    });
}

function minimizeNotification() {
    document.getElementById("extended-notification").style.display = "none";

    document.querySelector("#notification-container .btn-minimize").onclick = maximizeNotification
    document.querySelector("#notification-container .btn-minimize").textContent = "+"
}

function maximizeNotification() {
    document.getElementById("extended-notification").style.display = "block";

    document.querySelector("#notification-container .btn-minimize").onclick = minimizeNotification
    document.querySelector("#notification-container .btn-minimize").textContent = "-"
}

function buyMeACoffee() {
    window.open("https://www.buymeacoffee.com/namhatankhu", "_blank");
}

// Main code
createHeroPicks("user-picks-container");
createHeroPicks("opponent-picks-container");
