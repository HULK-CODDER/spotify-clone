let trending_show=document.getElementById("trending_songs").children[0].children[1]
let popular_alnums_and_singles_show=document.getElementById("popular_alnums_and_singles").children[0].children[1]
let popular_radio_show=document.getElementById("popular_radio").children[0].children[1]
let featured_charts_show=document.getElementById("featured_charts").children[0].children[1]
let popular_artists_show=document.getElementById("popular_artists").children[0].children[1]


let trending_div=document.getElementById("trending_songs").children[1]
let popular_alnums_and_singles_div=document.getElementById("popular_alnums_and_singles").children[1]
let popular_radio_div=document.getElementById("popular_radio").children[1]
let featured_charts_div=document.getElementById("featured_charts").children[1]
let popular_artists_div=document.getElementById("popular_artists").children[1]



trending_show.addEventListener('click', () => {
  trending_div.classList.toggle("hero")
});
popular_alnums_and_singles_show.addEventListener('click', () => {
  popular_alnums_and_singles_div.classList.toggle("hero")
});
popular_radio_show.addEventListener('click', () => {
  popular_radio_div.classList.toggle("hero")
});
featured_charts_show.addEventListener('click', () => {
  featured_charts_div.classList.toggle("hero")
});
popular_artistsshow.addEventListener('click', () => {
  popular_artists_div.classList.toggle("hero")
});
