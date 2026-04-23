let playlist_section = document.querySelector(".playlist_section")
let yourplaylist = document.getElementById("yourplaylist_1")
let previous = document.querySelector(".songbutoons").children[0]
let play = document.querySelector(".songbutoons").children[1]
let next = document.querySelector(".songbutoons").children[2]
let name_of_playingsong = document.querySelector(".name_duration").children[0]
let time_of_playingsong = document.querySelector(".name_duration").children[1]
let seekbar = document.querySelector(".seekbar")
let seekbar_circle = document.querySelector(".circle")
let volume = document.getElementById("volume")
let volume_button = document.querySelector(".volume").children[0]
let count2 = 0;
function set_name_of_song(song_name) {
    name_of_playingsong.innerHTML = song_name;
}

function formatTime(seconds) {
    seconds = Math.floor(seconds);

    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;

    minutes = String(minutes).padStart(2, "0");
    remainingSeconds = String(remainingSeconds).padStart(2, "0");

    return `${minutes}:${remainingSeconds}`;
}


async function gettrendingsongs() {
    let trend = await fetch("http://127.0.0.1:5500/songs/trending/")
    let response_trend = await trend.text()
    let div = document.createElement("div")
    div.innerHTML = response_trend
    let trend_i = div.getElementsByTagName("li")
    let folers = []
    for (let i = 1; i < trend_i.length; i++) {
        let trend_a = trend_i[i].getElementsByTagName("a")[0].href
        let trend_a_name = trend_a.split("trending/")[1]
        folers.push(trend_a_name)
    }
    let trend_songs = []
    for (const e of folers) {
        let trend_folders = await fetch(`http://127.0.0.1:5500/songs/trending/${e}`)
        let response_folders = await trend_folders.text()
        // trend_songs.push(response_folders)
        let folder_div = document.createElement("div")
        folder_div.innerHTML = response_folders
        let folder_li = folder_div.getElementsByTagName("li")
        let folder_li_li = []
        for (let i = 1; i < folder_li.length; i++) {

            folder_li_li.push(folder_li[i].getElementsByTagName("a")[0])
        }
        // let folder_a= folder_li.getElementsByTagName("a")

        trend_songs.push(folder_li_li)


    }

    let cover_href = []
    let song_href = []
    let info_href = []
    // console.log(trend_songs.length);

    for (let i = 0; i < trend_songs.length; i++) {
        for (let j = 0; j < trend_songs[1].length; j++) {


            if (trend_songs[i][j].href.endsWith(".jpg")) {
                cover_href.push(trend_songs[i][j].href)
            }
            if (trend_songs[i][j].href.endsWith(".json")) {
                info_href.push(trend_songs[i][j].href)
            }
            if (trend_songs[i][j].href.endsWith(".mp3")) {
                song_href.push(trend_songs[i][j].href)
            }
        }

    }
    return [cover_href, song_href, info_href]
}

async function getartist() {
    let artists = await fetch("http://127.0.0.1:5500/songs/artists/")
    let response_artists = await artists.text()
    let artists_div = document.createElement("div")
    artists_div.innerHTML = response_artists
    let artist_folders = artists_div.getElementsByTagName("li")
    let artist_folder_names = []
    for (const e of artist_folders) {
        artist_folder_names.push(e.getElementsByTagName("a")[0])
    }
    let artist_songs_folder_href = []
    let artist_cover_href = []
    let artist_info_href = []
    for (let i = 1; i < artist_folder_names.length; i++) {
        let artist_cover = await fetch(`${artist_folder_names[i]}`)
        let artist_cover_response = await artist_cover.text()
        artist_cover_response_div = document.createElement("div")
        artist_cover_response_div.innerHTML = artist_cover_response
        let artist_cover_response_list = artist_cover_response_div.getElementsByTagName("li")
        let artist_cover_names = []
        for (const e of artist_cover_response_list) {
            // console.log(e.getElementsByTagName("a")[0].href);

            artist_cover_names.push(e.getElementsByTagName("a")[0])
        }
        for (let i = 0; i < artist_cover_names.length; i++) {

            // console.log(artist_cover_names[i].href);
            // console.log(artist_cover_names.length);

            if (artist_cover_names[i].href.endsWith(".jpg")) {
                artist_cover_href.push(artist_cover_names[i].href)
            }
            if (artist_cover_names[i].href.endsWith(".json")) {
                artist_info_href.push(artist_cover_names[i].href)
            }
            if (artist_cover_names[i].href.endsWith("songs")) {
                artist_songs_folder_href.push(artist_cover_names[i].href)
            }



        }
        // console.log(artist_cover_href,artist_info_href,artist_songs_folder_href);





    }
    return [artist_cover_href, artist_info_href, artist_songs_folder_href]
}

async function get_title(sorce) {
    let info = await fetch(`${sorce}`)
    let response_info = await info.json()
    return response_info

}
async function getsongs() {
    let a = await fetch("http://127.0.0.1:5500/songs/main_playlist/")
    let response = await a.text()
    // console.log(response);
    let div = document.createElement('div')
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    let songs = []
    let songlinks = []
    for (let i = 0; i < as.length; i++) {
        if (as[i].href.endsWith(".mp3")) {
            songs.push(as[i].href.split("songs/main_playlist/")[1])
            songlinks.push(as[i].href)
        }

    }
    return [songlinks, songs];


}
async function get_songs_artist(songs_url) {
    let songs_from_artists = await fetch(`${songs_url}`)
    let response_of_artist_url = await songs_from_artists.text()
    let artist_song_url_div = document.createElement("div")
    artist_song_url_div.innerHTML = response_of_artist_url
    let artist_anchors = artist_song_url_div.getElementsByTagName("a")
    let artist_songs_urls = []
    let artist_songs_names = []
    // console.log(artist_anchors);

    for (let i = 0; i < artist_anchors.length; i++) {
        if (artist_anchors[i].href.endsWith(".mp3")) {
            artist_songs_urls.push(artist_anchors[i].href)
            artist_songs_names.push(artist_anchors[i].href.split("songs/")[2].replaceAll("%20", " "))
        }
    }
    return [artist_songs_names, artist_songs_urls]

}
(async function main() {
    var audio = new Audio()
    document.body.appendChild(audio);
    let songs = await getsongs();
    let check_song_play = true;

    let trending_songs_section = document.getElementById("trending_songs").children[1]
    let trending_songs = await gettrendingsongs()
    let artist_section = document.getElementById("popular_artists").children[1]
    let artists_songs = await getartist()

    for (let i = 0; i < artists_songs[1].length; i++) {
        // console.log(artists_songs.length);

        let artist_heading = await get_title(artists_songs[1][i])
        let artist_description = await get_title(artists_songs[1][i])
        artist_heading = artist_heading["title"]
        artist_description = artist_description["desc"]
        let artist_img = await artists_songs[0][i]
        let artist_songs_folder = await artists_songs[2][i]

        // console.log(artist_heading,artist_img,artist_songs_folder);

        let artist_card_html = ` <div class=" play_cards artist_cards">
                        <div class="card_img">

                            <img src="${artist_img}" alt="image">
                            <!-- <button>▶</button> -->
                            <svg class="artist_svg" width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                <!-- Circular Background -->
                                <circle cx="50" cy="50" r="45" fill="#22c55e" />

                                <!-- Centered Play Icon -->
                                <polygon points="42,32 42,68 68,50" fill="black" />
                            </svg>
                        </div>
                        <h2>${artist_heading}</h2>
                        <p>${artist_description}</p>`
        artist_section.insertAdjacentHTML("beforeend", artist_card_html)

        document.querySelectorAll(".artist_cards")[document.querySelectorAll(".artist_cards").length - 1].querySelector(".artist_svg").addEventListener('click', () => {
            (async function ready() {
                count2 = 0;

                let artist_songs = await get_songs_artist(artist_songs_folder);

                function playSongAtIndex(index) {
                    if (artist_songs[1][index]) {
                        audio.src = artist_songs[1][index];
                        audio.play();
                        set_name_of_song(artist_songs[0][index]);
                        play.src = "images/icons/pause.svg";
                    }
                }

                // ✅ NEXT
                next.onclick = () => {
                    if (count2 < artist_songs[1].length - 1) {
                        count2++;
                        playSongAtIndex(count2);
                    }
                };

                // ✅ PREVIOUS
                previous.onclick = () => {
                    if (count2 > 0) {
                        count2--;
                        playSongAtIndex(count2);
                    }
                };

                // UI list
                playlist_section.innerHTML = `
        <div class="song_list">
            <ul></ul>
        </div>
    `;

                for (let i = 0; i < artist_songs[0].length; i++) {
                    let song_html = `
            <li>
                <img src="images/icons/music_icon.svg">
                <p>${artist_songs[0][i]}</p>
                <img id="art${i}" src="images/icons/play2.svg">
            </li>
        `;

                    playlist_section.querySelector("ul").insertAdjacentHTML("beforeend", song_html);

                    let btn = document.getElementById(`art${i}`);

                    btn.addEventListener("click", () => {
                        count2 = i;
                        playSongAtIndex(i);
                    });
                }
            })();
            // (
            //     async function ready() {
            //          count2 = 0;

            //         let artist_songs = await get_songs_artist(artist_songs_folder)

            //           next.onclick = () => {
            //                 if (count2 < artist_songs[1].length - 1) {
            //                     count2++;
            //                     audio.src = artist_songs[1][count2];
            //                     audio.play();
            //                     set_name_of_song(artist_songs[0][count2]);
            //                 }
            //             };

            //             previous.onclick = () => {
            //                 if (count2 > 0) {
            //                     count2--;
            //                     audio.src = artist_songs[1][count2];
            //                     audio.play();
            //                     set_name_of_song(artist_songs[0][count2]);
            //                 }
            //             };
            //         function playsong2(a) {
            //             function set_name_of_song(song_name) {
            //                 name_of_playingsong.innerHTML = `${song_name}`
            //             }

            //             // previous.addEventListener('click', () => {
            //             //         count2 -= 1;
            //             //         audio.pause()
            //             //         if (artist_songs[1][count2] !== undefined) {
            //             //             audio.src = artist_songs[1][count2]
            //             //             audio.play()
            //             //             set_name_of_song(artist_songs[0][count2])
            //             //             play.src = "images/icons/pause.svg"
            //             //         }
            //             //     })
            //             //     next.addEventListener('click', () => {
            //             //         count2 += 1;
            //             //         console.log(artist_songs[1][count2]);

            //             //         audio.pause()
            //             //         if (artist_songs[1][count2] !== undefined) {
            //             //             audio.src = artist_songs[1][count2]
            //             //             audio.play()
            //             //             set_name_of_song(artist_songs[0][count2])
            //             //             play.src = "images/icons/pause.svg"
            //             //         }

            //             //     })
            //             function songplay2(a) {

            //                 // console.log(check_song_play);


            //                 audio.src = artist_songs[1][a]
            //                 audio.play()
            //                 set_name_of_song(artist_songs[0][a])


            //                 play.src = "images/icons/pause.svg"
            //                 play.onclick = () => {
            //                     if (audio.paused) {
            //                         audio.play();
            //                         play.src = "images/icons/pause.svg";
            //                     } else {
            //                         audio.pause();
            //                         play.src = "images/icons/play.svg";
            //                     }
            //                 }

            //             }

            //             if (check_song_play) {
            //                 songplay2(a)

            //                 check_song_play = false
            //             } else {
            //                 let playing_song2 = document.getElementsByTagName("audio")[0]


            //                 playing_song2.pause()
            //                 songplay2(a)

            //             }
            //         }
            //         // console.log(artist_artist_songs[0][1]);
            //         playlist_section.innerHTML = ` <div class="song_list">
            //                       <ul>
            //                       </ul>
            //                   </div>`
            //         for (let i = 0; i < artist_songs[0].length; i++) {
            //             let song_list_html = `<li>
            //                <img src="images/icons/music_icon.svg" alt="">
            //                <p>${artist_songs[0][i]}</p>
            //                <img id="art${i}" src="images/icons/play2.svg" alt="">
            //            </li>`
            //             playlist_section.getElementsByTagName("ul")[0].insertAdjacentHTML("afterbegin", song_list_html)
            //             let artist_elements = document.querySelector(".song_list").getElementsByTagName("ul")[0].children
            //             let artist_li = artist_elements[0]
            //             let play_in_card_a = artist_li.children[2]
            //             // console.log(play_in_card_a);

            //             play_in_card_a.addEventListener('click', () => {

            //                 let id1 = play_in_card_a.id
            //                 // let id_array2 = id1.split("")
            //                 let index_song2 = id1.replace("art", "")
            //                 count2 = Number(index_song2)
            //                 playsong2(Number(index_song2))


            //             })
            //         }
            //     }
            // )()

        })

    }


    let length = trending_songs[0].length
    let playing = true
    for (let i = 0; i < length; i++) {

        let card_heading = await get_title(trending_songs[2][i])
        card_heading = card_heading['title']
        let card_description = await get_title(trending_songs[2][i])
        card_description = card_description['desc']
        let card_img = await trending_songs[0][i]
        let card_song = await trending_songs[1][i]
        let card_html = ` <div class="tempo_boxex play_cards">
                        <div class="card_img">

                            <img src="${card_img}" alt="image">
                            <!-- <button>▶</button> -->
                            <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                <!-- Circular Background -->
                                <circle cx="50" cy="50" r="45" fill="#22c55e" />

                                <!-- Centered Play Icon -->
                                <polygon points="42,32 42,68 68,50" fill="black" />
                            </svg>
                        </div>
                        <h2>${card_heading}</h2>
                        <p>${card_description}</p>`
        trending_songs_section.insertAdjacentHTML("beforeend", card_html)
        // console.log(document.getElementsByClassName("play_cards")[document.getElementsByClassName("play_cards").length-1]);

        document.getElementsByClassName("tempo_boxex")[document.getElementsByClassName("tempo_boxex").length - 1].querySelector(".card_img").getElementsByTagName("svg")[0].addEventListener('click', () => {
            audio.src = card_song;
            audio.play()
            name_of_playingsong.innerHTML = "[" + card_heading + "]" + " " + card_description
            play.src = "images/icons/pause.svg"

            // console.log(card_song);

        })

    }
    play.addEventListener('click', () => {
        if (playing) {
            console.log("paused");
            audio.pause()
            play.src = "images/icons/play.svg"
            playing = false

        } else {
            console.log("play");
            audio.play()
            play.src = "images/icons/pause.svg"
            playing = true

        }
    })



    audio.addEventListener("timeupdate", () => {
        // console.log(formatTime(audio.currentTime),formatTime(audio.duration));
        time_of_playingsong.innerHTML = `${formatTime(audio.currentTime)}/${formatTime(audio.duration)}`
        document.querySelector(".circle").style.left = (audio.currentTime / audio.duration) * 100 + "%"
    })


    seekbar.addEventListener('click', (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        seekbar_circle.style.left = percent + "%"
        audio.currentTime = ((audio.duration) * percent) / 100
    })
    volume.addEventListener('change', (e) => {
        // console.log(e.target.value);
        audio.volume = e.target.value / 100
        if (e.target.value / 100 == 0) {
            document.querySelector(".volume").children[0].src = "images/icons/mute.svg"
        } else {
            document.querySelector(".volume").children[0].src = "images/icons/volume.svg"
        }
    })
    volume_button.addEventListener('click', () => {
        if (audio.volume == 0) {
            audio.volume = 1
            volume.value = 100
            document.querySelector(".volume").children[0].src = "images/icons/volume.svg"

        } else {
            audio.volume = 0;
            volume.value = 0;
            document.querySelector(".volume").children[0].src = "images/icons/mute.svg"
        }
    })

    function playsong(a) {
        function set_name_of_song(song_name) {
            let name = song_name.split("songs/main_playlist/")[1].replaceAll("%20", " ")
            name_of_playingsong.innerHTML = `${name}`
        }
        function songplay(a) {

            // console.log(check_song_play);

            let count = 0;

            audio.src = songs[0][a - 1]
            audio.play()
            set_name_of_song(songs[0][a - 1])

            previous.addEventListener('click', () => {
                count -= 1;
                audio.pause()
                if (songs[0][(a - 1) + count] !== undefined) {
                    audio.src = songs[0][(a - 1) + count]
                    audio.play()
                    set_name_of_song(songs[0][(a - 1) + count])
                    play.src = "images/icons/pause.svg"
                }
            })
            next.addEventListener('click', () => {
                count += 1;
                audio.pause()
                if (songs[0][(a - 1) + count] !== undefined) {
                    audio.src = songs[0][(a - 1) + count]
                    audio.play()
                    set_name_of_song(songs[0][(a - 1) + count])
                    play.src = "images/icons/pause.svg"
                }

            })
            play.src = "images/icons/pause.svg"
            play.addEventListener('click', () => {
                if (audio.paused) {
                    audio.play();
                    play.src = "images/icons/pause.svg";
                } else {
                    audio.pause();
                    play.src = "images/icons/play.svg";
                }
            })

        }

        if (check_song_play) {
            songplay(a)

            check_song_play = false
        } else {
            let playing_song = document.getElementsByTagName("audio")[0]


            playing_song.pause()
            songplay(a)

        }
    }

    function reattach_button() {

        let yourplaylist_button = yourplaylist.querySelector("button")


        yourplaylist_button.addEventListener('click', () => {
            console.log("clicked");

            yourplaylist.classList.add("opened_playlist")
            yourplaylist.innerHTML = `<nav><img src="images/icons/cross.svg" alt="close"><h3>My Playlist</h3></nav><ul></ul>`
            let play_number = 0
            for (const e of songs[1]) {
                play_number += 1;
                let song_html = `
            <li>
    <img src="images/icons/music_icon.svg"  alt="">
        <p>${e.replaceAll("%20", " ")}</p>
        <img id="song_index${play_number}" src="images/icons/play2.svg" alt="">
    </li>`
                yourplaylist.querySelector("ul").insertAdjacentHTML("beforeend", song_html)
                let ul_elements = document.querySelector(".opened_playlist").getElementsByTagName("ul")[0].children
                let li = ul_elements[ul_elements.length - 1]
                let play_in_card = li.children[2]
                play_in_card.addEventListener('click', () => {
                    let id = play_in_card.id
                    let id_array = id.split("")
                    let index_song = id_array[id_array.length - 1]
                    playsong(index_song)


                })
            }
            yourplaylist.querySelector("img").addEventListener('click', () => {
                yourplaylist.classList.remove("opened_playlist")
                yourplaylist.innerHTML = ` <h1>your playlist</h1>
            <p>listent to your selected songs</p>
            <button>open playlist</button>`

                reattach_button();
            })
        })
    }
    reattach_button();

})()
