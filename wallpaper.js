document.addEventListener("mousemove", (e) => {
    const div = document.getElementById("interactive-div");
    const { clientX: x, clientY: y } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const deltaX = (x - centerX) / centerX;
    const deltaY = (y - centerY) / centerY;
    const rotateX = deltaY * 13;
    const rotateY = deltaX * -13;
    div.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});

const overlay = document.getElementById("overlay");
const video = document.getElementById("bg-video");
const audio = document.getElementById("bg-audio");

overlay.addEventListener("click", () => {
    overlay.style.display = "none";
    video.style.display = "block";
    video.muted = false;
    audio.muted = false;
    setTimeout(() => {
        video.play();
        audio.play();
    }, 100);
});

audio.onplay = () => {
    console.log("Audio started playing!");
};

audio.onerror = (e) => {
    console.error("Error playing audio:", e);
};

function changeWallpaperAndMusic() {
    const video = document.getElementById("bg-video");
    const audio = document.getElementById("bg-audio");
    const videoSource = document.getElementById("video-source");
    const audioSource = document.getElementById("audio-source");
    const songTitle = document.getElementById("song-title");
    const songArtist = document.getElementById("song-artist");
    const songCover = document.getElementById("song-cover");

    const date = new Date();
    //const day = date.getDay();
    const day = 5;
    const filePath = `/resources/aboutme/${["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"][day]}.mp3`;

    videoSource.src = filePath.replace(".mp3", ".mp4");
    audioSource.src = filePath;

    video.load();
    audio.load();

    // Fetch the MP3 file as an ArrayBuffer and extract metadata
    fetch(filePath)
        .then(response => response.arrayBuffer())
        .then(buffer => {
            jsmediatags.read(new Blob([buffer]), {
                onSuccess: function(tag) {
                    songTitle.textContent = tag.tags.title || "Unknown Title";
                    songArtist.textContent = tag.tags.artist || "Unknown Artist";

                    if (tag.tags.picture) {
                        let picture = tag.tags.picture;
                        let base64String = "";
                        for (let i = 0; i < picture.data.length; i++) {
                            base64String += String.fromCharCode(picture.data[i]);
                        }
                        let imageUrl = `data:${picture.format};base64,${btoa(base64String)}`;
                        songCover.src = imageUrl;
                    } else {
                        songCover.src = "resources/default-cover.png";
                    }
                },
                onError: function(error) {
                    console.error("error reading metadata:", error);
                    songTitle.textContent = "unkown title";
                    songArtist.textContent = "unkown artist";
                    songCover.src = "resources/default-cover.png";
                }
            });
        })
        .catch(error => {
            console.error("Failed to load MP3 file:", error);
        });
}

changeWallpaperAndMusic();