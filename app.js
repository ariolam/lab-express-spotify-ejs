require("dotenv").config();

const express = require("express");
const expressLayouts = require("express-ejs-layouts");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
    .catch((error) =>
        console.log(
            "Something went wrong when retrieving an access token",
            error
        )
    );
// Our routes go here:
app.get("/", (request, response) => {
    response.render("home");
});

app.get("/artist-search", async (request, response) => {
    const searchArtist = request.query.artistName;
    console.log(searchArtist);
    try {
        const data = await spotifyApi.searchArtists(
            JSON.stringify(searchArtist)
        );
        // console.log(data.body.artists.items[0].images[0].url);
        // console.log(data.body.artists);
        response.render("artist-search-results", {
            artists: data.body.artists.items,
        });
    } catch (error) {
        console.log(error);
    }
});
app.get("/albums/:artistId", async (request, response, next) => {
    const { artistId } = request.params;
    // console.log(artistId);
    try {
        const data = await spotifyApi.getArtistAlbums(artistId);
        console.log(data.body.items);
        response.render("albums", { albums: data.body.items });
    } catch (error) {
        console.log(error);
    }
});
app.get("/tracks/:albumId", async (request, response, next) => {
    const { albumId } = request.params;
    // console.log(albumId);
    try {
        const data = await spotifyApi.getAlbumTracks(albumId);
        console.log(data.body.items);
        response.render("tracks", { tracks: data.body.items });
    } catch (error) {
        console.log(error);
    }
});

app.listen(3000, () =>
    console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
