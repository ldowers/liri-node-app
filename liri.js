"use strict";

// NPM packages
var Twitter = require("twitter");
var spotify = require("spotify");
var request = require("request");
var fs = require("fs");

// Twitter keys
var keys = require("./keys.js");

// LIRI command and arguments
var command = process.argv[2];
var args = process.argv.slice(3);

// Functions
function liriMain() {

    // Log the command and arguments to log.txt file
    if (command) {
        command = command.toLowerCase();
        fs.appendFileSync("log.txt", "Command: " + command + " " + args.join(" ") + "\n");
    }

    // Determine the command entered and call a function to handle it
    switch (command) {
        case "my-tweets":
            tweets();
            break;
        case "spotify-this-song":
            spotifySong();
            break;
        case "movie-this":
            movie();
            break;
        case "do-what-it-says":
            random();
            break;
        default:
            console.log("Valid command options: my-tweets, spotify-this-song, movie-this, do-what-it-says.");
            break;
    }
};

// Handle my-tweets command
function tweets() {
    var client = new Twitter(keys.twitterKeys);
    var screenName = args[0];

    if (screenName) {
        var params = { screen_name: screenName, count: 20 };
    }
    else {
        var params = { screen_name: 'loridowers', count: 20 };
    }

    // Run a request to the Twitter API
    client.get('statuses/user_timeline', params, twitterResponse);
};

// Display and log response from Twitter API call
function twitterResponse(error, tweets, response) {
    if (!error) {
        for (var i = 0; i < tweets.length; i++) {
            console.log(tweets[i].created_at + " " + tweets[i].text);

            fs.appendFileSync("log.txt", tweets[i].created_at + " " + tweets[i].text + "\n");
        }
    }
    else {
        console.log(error);
    }
};

// Handle spotify-this-song command
function spotifySong() {
    var songName = args;

    if (songName.length === 0) {
        songName = "The Sign + Ace of Base";
    }
    else {
        songName = args[0];

        for (var i = 1; i < args.length; i++) {
            songName = songName + "+" + args[i];
        }
    }

    // Run a request to the Spotify API with the song specified
    spotify.search({ type: 'track', query: songName }, spotifyResponse);
};

// Display and log response from Spotify API call
function spotifyResponse(err, data) {
    if (!err) {
        var songInfo = data.tracks.items[0];

        if (songInfo) {
        var artists = songInfo.artists[0].name;

        for (var i = 1; i < songInfo.artists.length; i++) {
            artists += ", " + songInfo.artists[i].name;
        }

        console.log("Artist\(s\): " + artists);
        console.log("Song Name: " + songInfo.name);
        console.log("Preview Link: " + songInfo.preview_url);
        console.log("Album: " + songInfo.album.name);

        fs.appendFileSync("log.txt", "Artists: " + artists + "\n");
        fs.appendFileSync("log.txt", "Song Name: " + songInfo.name + "\n");
        fs.appendFileSync("log.txt", "Preview Link: " + songInfo.preview_url + "\n");
        fs.appendFileSync("log.txt", "Album: " + songInfo.album.name + "\n");
        }
        else {
            console.log("Song not found.");

            fs.appendFileSync("log.txt", "Song not found." + "\n");
        }
    }
    else {
        console.log(err);
    }
};

// Handle movie-this command
function movie() {
    var movieName = "";

    if (args.length === 0) {
        movieName = "Mr. Nobody";
    }
    else {
        movieName = args[0];

        for (var i = 1; i < args.length; i++) {
            movieName = movieName + "+" + args[i];
        }
    }

    // Run a request to the OMDb API with the movie specified
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&r=json&tomatoes=true";
    request(queryUrl, omdbResponse);
};

// Display and log response from OMDb API call
function omdbResponse(err, resp, body) {

    if (!err && resp.statusCode === 200) {
        if (JSON.parse(body).Title) {
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Year: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Country: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).tomatoRating);
            console.log("Rotten Tomatoes URL: " + JSON.parse(body).tomatoURL);

            fs.appendFileSync("log.txt", "Title: " + JSON.parse(body).Title + "\n");
            fs.appendFileSync("log.txt", "Year: " + JSON.parse(body).Year + "\n");
            fs.appendFileSync("log.txt", "IMDB Rating: " + JSON.parse(body).imdbRating + "\n");
            fs.appendFileSync("log.txt", "Country: " + JSON.parse(body).Country + "\n");
            fs.appendFileSync("log.txt", "Language: " + JSON.parse(body).Language + "\n");
            fs.appendFileSync("log.txt", "Plot: " + JSON.parse(body).Plot + "\n");
            fs.appendFileSync("log.txt", "Actors: " + JSON.parse(body).Actors + "\n");
            fs.appendFileSync("log.txt", "Rotten Tomatoes Rating: " + JSON.parse(body).tomatoRating + "\n");
            fs.appendFileSync("log.txt", "Rotten Tomatoes URL: " + JSON.parse(body).tomatoURL + "\n");
        }
        else {
            console.log("Movie not found.");

            fs.appendFileSync("log.txt", "Movie not found." + "\n");
        }
    }
    else {
        console.log(err);
    }
};

// Handle do-what-it-says command
function random() {
    fs.readFile("random.txt", "utf8", readFileResult);
};

// Call LIRI main function with command and arguments read from random.txt file
function readFileResult(err, data) {
    if (!err) {
        var cmdArray = data.split(",");

        command = cmdArray[0].toLowerCase();
        args = cmdArray.slice(1);

        if (command === "my-tweets" || command === "spotify-this-song" || command === "movie-this") {
            liriMain();
        }
        else {
            console.log("Command not valid.");

            fs.appendFileSync("log.txt", "Command not valid." + "\n");
        }
    }
    else {
        console.log(err);
    }
};

// Run LIRI main function
liriMain();