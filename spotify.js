async function fetchDiscordActivity() {
    const userId = "1193474968193863761";
    const response = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
    const data = await response.json();

    if (data.success) {
        const user = data.data;
        const spotify = user.spotify;
        if (spotify) {
            document.getElementById("spotify-info").classList.remove("hidden");
            document.getElementById("spotify-cover").src = spotify.album_art_url;
            document.getElementById("spotify-song").textContent = spotify.song;
            document.getElementById("spotify-artist").textContent = spotify.artist;
        } else {
            document.getElementById("spotify-info").classList.add("hidden");
        }
    }
}

window.onload = function() {
    fetchDiscordActivity();
    setInterval(fetchDiscordActivity, 10000);
}
