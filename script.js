/* Adds */

/* 
NOTE: A song may consist of multiple beatmaps, not just one. All objects apply solely to standard osu!. This list will NOT include: 
osu! taiko 
osu! mania
osu! catch. 
*/
document.addEventListener("DOMContentLoaded", function() {
    console.log("HTML is ready, script.js is running.");
    let searchBar = document.getElementById("search-bar")
      , searchButton = document.getElementById("search-button")
      , autoSuggestions = document.getElementById("auto-suggest")
      , display = document.getElementById("display");
    const database = [{
        name: "Vanic - Samurai (Spirix Remix)",
        //Name of song being categorized
        mapper: "Monstrata",
        //Mapper refers to the name of the person who created the beatmap for the song.
        bpm: [150],
        //Beats Per Minute used from osu! algorithim to determine note snap placement (Some beatmaps change pace, hence array).
        length: "1:16",
        //Length of overall beatmap, usually kept consistent but some beatmaps do offer range of selection
        difficulty: ["Easy", "Normal", "Hard", "Fading"],
        //Difficulty for EACH beatmapâ€”increasing order.
        stars: [1.35, 1.97, 3.31, 4.15]/*Star difficulty (out of 10) is used to 
    allow players to determine difficulty of beatmap (corresponds to difficultyâ€”increaasing order). */
    }, {
        name: "Kurokotei - Galaxy Collapse",
        mapper: "Doomsday is Bad",
        bpm: [27, 520],
        length: "5:53",
        difficulty: ["Galaxy, Galactic"],
        stars: [9.41, 10.67]
    }, {
        name: "REOL - 404 Not Found",
        mapper: "SnowNiNo_",
        bpm: [140],
        length: "4:01",
        difficulty: ["Normal", "Hard", "Collab Light Insane", "Chaoz's Insane", "Error"],
        stars: [1.75, 2.84, 3.44, 4.45, 5.14]
    }, {
        name: "BRIGHT - Ichinen Nikagetsu Hatsuka",
        mapper: "Nymph",
        bpm: [119],
        length: "2:58",
        difficulty: ["Easy", "Normal", "Hard"],
        stars: [1.27, 1.7, 3.2]
    }, {
        name: "Yousei Teikoku - Kokou no Sousei",
        mapper: "Saten-san",
        bpm: [240],
        length: "5:06",
        difficulty: ["Hard", "Insane", "Collab", "Chaos"],
        stars: [2.87, 4.53, 5.40, 6.10]
    }];
    if (searchBar) {
        // If HTML is NOT finished loaded and parsed, searchBar and searchButton listeners will NOT be able to mount, hence needing us to check if it does not equal null.
        searchBar.addEventListener("keypress", checkKey),
        searchBar.addEventListener("input", getAutoSuggestions);
    } else {
        return alert("searchBar event error, searchBar equals null");
    }
    //It may be helpful to note that this is ONLY needed if it not within our document loaded listener, since that would obviously guarantee that the HTML finished parsing anyways. TL;DR: This conditional does absolutely nothing within the project. Only there for safe keeping.
    if (searchButton) {
        searchButton.addEventListener("click", processInput);
    } else {
        return alert("searchButton event error, searchButton equals null");
    }
    /* fires processInput() if the enter key is detected */
    function checkKey(event) {
        // We do this in case user presses enter to submit response
        let key = event.which || event.keyCode;
        if (key == "13") {
            processInput();
        }
    }
    /* If the search query is a direct result, take that and display it on our HTML document */
    function processInput() {
        var cleanedInput = searchBar.value.toLowerCase().trim();
        // In order to make it easier for us to read the input, we clean it up and get rid of excess whitespace.
        console.log("cleanedInput: " + cleanedInput);
        autoSuggestions.style.display = "none";
        //Hide auto suggestions when the function is called
        searchBar.value = "";
        autoSuggestions.innerHTML = "";
        display.innerHTML = "";
        //Clear up any possible excess information that could have been left over from last search, along with erasing search value.
        var databaseRecord = getRecord(cleanedInput);
        //Initialize variable databaseRecord to getRecord with argument clanedInput, grabs search value from database and sets it equal to the variable.
        if (databaseRecord != null) {
            displayRecord(databaseRecord);
            //This should, in theory, only fire if the input search searched as it should have.
        } else {
            displaySuggestions(getSuggestions(cleanedInput));
            //Occurs when the getRecord function failed and did not yield any results within the database.
        }
    }
    /* In essence, we scrape the database variable via the index value names and see if any of them match up with the input value. NOTE: Only applies to EXACT query results, aka: "REOL - 404 Not Found" == "REOL - 404 Not Found".
Also, a bit ironic how that's the name of the song. lol. */
    function getRecord(input) {
        console.log("getRecord called, running");
        for (var i = 0; i < database.length; i++) {
            console.log(database[i]);
            var recordName = database[i].name.toLowerCase().trim();
            //Makes life easier for us to check values.
            if (input == recordName) {
                console.log("Match made, passing Results.");
                return database[i];
            }
        }
        return null;
        //If no results are found, we return a value of null for later use.
    }
    /* Pulls information from the requested database index value and displays it accordingly */
    function displayRecord(record) {
        // I'll most likely shorthand this with loops later.
        let name = document.createElement("h2")
          , mapper = document.createElement("h3")
          , bpm = document.createElement("h4")
          , length = document.createElement("h4")
          , difficulty = document.createElement("h4")
          , stars = document.createElement("h4");
        //Prepare the necessary functions that will be for appending within our document.
        name.innerHTML = record.name,
        mapper.innerHTML = record.mapper,
        bpm.innerHTML = "BPM: " + record.bpm,
        length.innerHTML = "Length: " + record.length,
        difficulty.innerHTML = record.difficulty,
        stars.innerHTML = record.stars;
        //Set the innerHTML of our variables to their respective database search results
        display.appendChild(name),
        display.appendChild(mapper),
        display.appendChild(difficulty),
        display.appendChild(stars),
        display.appendChild(length),
        display.appendChild(bpm)
        //Append all of the results to our empty div within our HTML document.
    }
    /* Fires off when the user attempts to click the suggestions, displaying the appropriate information that is needed */
    function activateSuggestionButton(button, record) {
        button.addEventListener("click", function() {
            //Since we only call this now and then, it is an anonymous function.
            autoSuggestions.innerHTML = "";
            autoSuggestions.style.dispay = "none";
            searchBar.value = "";
            display.innerHTML = "";
            displayRecord(record);
        });
    }
    /* Displays a suggestion based on the input. If, so far, it matches something within the database, it will suggest an automatic completion of the query and then automatically presents the information based on what was suggested. Also, automatically hides itself if it was successful. */
    function getAutoSuggestions() {
        var cleanedInput = searchBar.value.toLowerCase().trim();
        console.log("getAutoSuggestions,", cleanedInput);
        //I'm making life easy.
        autoSuggestions.innerHTML = "";
        //Done to avoid pushing multiple suggestions to "auto-suggest" div and having them overlap.
        for (var i = 0; i < database.length; i++) {
            var recordName = database[i].name.toLowerCase().trim();
            if (recordName.startsWith(cleanedInput) && cleanedInput.length > 0) {
                //We don't want to print a blank space of suggestions, which is why we check if it's greater than zero.
                //Oh, we also check to see if our input matches with the first few characters of any of the records in database. lol.

                /*It may be helpful to know that .startsWith() method is not included in Internet Explorer browsers, although there is a polyfill version for those scenarios. That being said, it is not included in this script. */
                console.log("autoSuggest, match made (so far)");
                var match = database[i].name.substring(0, searchBar.value.length)// I literally don't even need this variable. it does nothing.
                // Pulls the text that matches so far as the user types into the searchBar by calling all of the index values using the searchBar as reference
                  , remaining = database[i].name.substring(searchBar.value.length)//Why does this work? Not quite sure how this line works. Also, why do we even need the variable match then?
                  , result = match + "<b>" + remaining + "</b>"
                  , button = document.createElement("button");
                button.style.display = "block";
                button.innerHTML = result;
                button.className = "suggestion";
                //Resetting previous texts
                activateSuggestionButton(button, database[i]);
                autoSuggestions.appendChild(button);
            }
            if (autoSuggestions.hasChildNodes()) {
                //Done to check if a suggestion was made. If it was, it will most likely be in the form of "#text, BUTTON", in that particular order. You'll find that the button will hold text within itself, then having a BUTTON node.
                autoSuggestions.style.display = "block";
            } else {
                autoSuggestions.style.display = "none";
            }
        }
    }
    /* Scrapes the database for a possible match with the input. If it finds one, great. Take that and return it as a possible suggestion */
    function getSuggestions(cleanedInput) {
        var suggestions = [];
        //This variable will allow us to display suggestions for data we have available in database based on what they type.
        for (var i = 0; i < database.length; i++) {
            var record = database[i].name.toLowerCase().trim();
            console.log("getSuggestions," + record);
            if (record.startsWith(cleanedInput) && cleanedInput.length > 0) {
                console.log("getSuggestions, match made");
                //Similar to Auto, except all we do is push this to our empty array for further use.
                suggestions.push(database[i]);
                //Appends the suggestion to empty array.
                return suggestions;
                //Pass to next user function.
            }
        }
    }
    /*Sets up the scene for displaying the suggestions received from getSuggestions, properly appending and checking if what's being passed isn't just blank text. */
    function displaySuggestions(suggestions) {
        display.innerHTML = "";
        // Clear screen of all possible leftovers
        var paragraph = document.createElement("p");
        if (suggestions.length > 0) {
            //Checks to see if the length of the suggestions passed on is greater than 0. We don't want to suggest blank, do we?
            paragraph.innerHTML = "Did you mean:";
            //Set the scene up for our concatenation later on.
            for (var i = 0; i < suggestions.length; i++) {
                console.log("displaySuggestions," + i);
                //Scrape suggestions list
                var button = document.createElement("button");
                display.appendChild(paragraph);
                button.innerHTML = suggestions[i].name;
                button.style = "block";
                button.className = "suggestion";
                //Allows us to define the suggestions buttons that we'll append into our HTML document for automatic searching.
                activateSuggestionButton(button, suggestions[i]);
                //Now, if the user were to click the suggestions button, the above function would take that suggestion and automatically display it.
                display.appendChild(button);
                //Display "Did you mean:"

            }
        } else {
            paragraph.innerHTML = "No results!";
            //Only fires off when the input matches nothing in our database (At all)
            display.appendChild(paragraph);
            //Pushes to display
        }
    }

});
