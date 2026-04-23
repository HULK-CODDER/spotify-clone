let mainsection=document.getElementsByTagName("main")[0]
let leftside = mainsection.children[0]
let hamburger = document.querySelector(".hamburger")


let ham = true
hamburger.addEventListener('click',()=>{
   if (ham) {
       leftside.classList.add('leftham')
        ham=false
   } else {
        leftside.classList.remove('leftham')
        ham=true
   }
})