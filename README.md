# liri-node-app
LIRI is a Language Interpretation and Recognition Interface. LIRI is a command line node app that takes in parameters and gives you back data. Valid commands for LIRI are my-tweets, spotify-this-song, movie-this, and do-what-it-says.

What each command does:
node liri.js my-tweets '\<Twitter screen name here\>' will show the last 20 tweets and when they were created. If no screen name is provided the program defaults to my screen name.

node liri.js spotify-this-song '\<song name here\>' will show informaiton about the song from Spotify. If no song is provided the program defaults to "The Sign" by Ace of Base.

node liri.js movie-this '\<movie name here\>' will show information about the movie from OMDb. If no movie is provided the program defaults to "Mr. Nobody".

node liri.js do-what-it-says takes the text inside of random.txt and uses it to call on of LIRI's commands.
