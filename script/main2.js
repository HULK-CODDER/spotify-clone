let playlist_section = document.querySelector(".playlist_section");
let yourplaylist = document.getElementById("yourplaylist_1");
let previous = document.querySelector(".songbutoons").children[0];
let play = document.querySelector(".songbutoons").children[1];
let next = document.querySelector(".songbutoons").children[2];
let name_of_playingsong = document.querySelector(".name_duration").children[0];
let time_of_playingsong = document.querySelector(".name_duration").children[1];
let seekbar = document.querySelector(".seekbar");
let seekbar_circle = document.querySelector(".circle");
let volume = document.getElementById("volume");
let volume_button = document.querySelector(".volume").children[0];

let currentSongs = [];
let currentIndex = 0;
let audio = new Audio();
document.body.appendChild(audio);

// ------------------ HELPERS ------------------
function setSongName(name) {
    name_of_playingsong.innerHTML = name;
}

function formatTime(seconds) {
    if (isNaN(seconds)) return "00:00";
    seconds = Math.floor(seconds);
    let m = String(Math.floor(seconds / 60)).padStart(2, "0");
    let s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
}

function playSong(index) {
    if (!currentSongs[index]) return;
    currentIndex = index;

    audio.src = currentSongs[index].url;
    audio.play();

    setSongName(currentSongs[index].name);
    play.src = "images/icons/pause.svg";
}

// ------------------ GLOBAL CONTROLS ------------------
next.onclick = () => {
    if (currentIndex < currentSongs.length - 1) {
        playSong(currentIndex + 1);
    }
};

previous.onclick = () => {
    if (currentIndex > 0) {
        playSong(currentIndex - 1);
    }
};

play.onclick = () => {
    if (audio.paused) {
        audio.play();
        play.src = "images/icons/pause.svg";
    } else {
        audio.pause();
        play.src = "images/icons/play.svg";
    }
};

// ------------------ AUDIO EVENTS ------------------
audio.addEventListener("timeupdate", () => {
    time_of_playingsong.innerHTML =
        `${formatTime(audio.currentTime)}/${formatTime(audio.duration)}`;

    seekbar_circle.style.left =
        (audio.currentTime / audio.duration) * 100 + "%";
});

// SEEK
seekbar.addEventListener("click", (e) => {
    let percent = e.offsetX / seekbar.clientWidth;
    audio.currentTime = percent * audio.duration;
});

// VOLUME
volume.addEventListener("input", (e) => {
    audio.volume = e.target.value / 100;
});

volume_button.onclick = () => {
    if (audio.volume === 0) {
        audio.volume = 1;
        volume.value = 100;
    } else {
        audio.volume = 0;
        volume.value = 0;
    }
};

// ------------------ FETCH FUNCTIONS ------------------
async function get_songs_artist(url) {
    let res = await fetch(url);
    let text = await res.text();

    let div = document.createElement("div");
    div.innerHTML = text;

    let a = div.getElementsByTagName("a");

    let songs = [];

    for (let i = 0; i < a.length; i++) {
        if (a[i].href.endsWith(".mp3")) {
            songs.push({
                name: a[i].href.split("songs/")[2].replaceAll("%20", " "),
                url: a[i].href
            });
        }
    }

    return songs;
}

async function getartist() {
    let res = await fetch("http://127.0.0.1:5500/songs/artists/");
    let text = await res.text();

    let div = document.createElement("div");
    div.innerHTML = text;

    let li = div.getElementsByTagName("li");

    let artists = [];

    for (let i = 1; i < li.length; i++) {
        let link = li[i].querySelector("a").href;

        let res2 = await fetch(link);
        let text2 = await res2.text();

        let d2 = document.createElement("div");
        d2.innerHTML = text2;

        let files = d2.getElementsByTagName("a");

        let img, json, songsFolder;

        for (let f of files) {
            if (f.href.endsWith(".jpg")) img = f.href;
            if (f.href.endsWith(".json")) json = f.href;
            if (f.href.endsWith("songs")) songsFolder = f.href;
        }

        let meta = await (await fetch(json)).json();

        artists.push({
            img,
            title: meta.title,
            desc: meta.desc,
            songsFolder
        });
    }

    return artists;
}

// ------------------ MAIN ------------------
(async function () {
    let artist_section = document.getElementById("popular_artists").children[1];

    let artists = await getartist();

    for (let artist of artists) {

        let html = `
        <div class="play_cards artist_cards">
            <div class="card_img">
                <img src="${artist.img}">
                <svg class="artist_svg" width="100" height="100">
                    <circle cx="50" cy="50" r="45" fill="#22c55e"/>
                    <polygon points="42,32 42,68 68,50" fill="black"/>
                </svg>
            </div>
            <h2>${artist.title}</h2>
            <p>${artist.desc}</p>
        </div>`;

        artist_section.insertAdjacentHTML("beforeend", html);

        let card = artist_section.lastElementChild;

        card.querySelector(".artist_svg").onclick = async () => {

            let songs = await get_songs_artist(artist.songsFolder);

            currentSongs = songs;
            currentIndex = 0;

            // build playlist UI
            playlist_section.innerHTML = `
                <div class="song_list"><ul></ul></div>
            `;

            let ul = playlist_section.querySelector("ul");

            songs.forEach((s, i) => {
                ul.insertAdjacentHTML("beforeend", `
                    <li>
                        <img src="images/icons/music_icon.svg">
                        <p>${s.name}</p>
                        <img class="playBtn" data-i="${i}" src="images/icons/play2.svg">
                    </li>
                `);
            });

            document.querySelectorAll(".playBtn").forEach(btn => {
                btn.onclick = () => {
                    playSong(Number(btn.dataset.i));
                };
            });
        };
    }
})();