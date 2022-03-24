/* eslint-disable no-unused-vars */

// swtich pages in one html
const switchTo = (currentID, nextID) => {
    document.getElementById(currentID).classList.add("hidden");
    document.getElementById(nextID).classList.remove("hidden");
};

// copy input text function for admin password change
const copyText = () =>{
    let newPasscode = document.getElementById("newPassword");
    navigator.clipboard.writeText(newPasscode.innerText);
    document.getElementById("copy-text-btn").innerText="Copied!"
}

// pop up function for admin password change
const hidePopUp = () =>{
    document.getElementById("staticBackdrop").style.display = "none";
}

// wall colour event wall colour change
const changeGreenBg = () =>{
    document.getElementById("game-bg").style.backgroundImage = "url('/img/green-bg.png')";
}

const changeYellowBg = () =>{
    document.getElementById("game-bg").style.backgroundImage = "url('/img/yellow-bg.png')";
}

const changeOrangeBg = () =>{
    document.getElementById("game-bg").style.backgroundImage = "url('/img/orange-bg.png')";
}

const changePinkBg = () =>{
    document.getElementById("game-bg").style.backgroundImage = "url('/img/pink-bg.png')";
}

const changePurpleBg = () =>{
    document.getElementById("game-bg").style.backgroundImage = "url('/img/purple-bg.png')";
}

const changeBlueBg = () =>{
    document.getElementById("game-bg").style.backgroundImage = "url('/img/blue-bg.png')";
}

// audio-slider play and pause function
let x = document.getElementById("bell-audio"); 
let y = document.getElementById("tutorial-audio");

const audioSwitch=() =>{ 
    if (x.paused) {
        x.play();
        document.getElementById("bell-icon").classList.remove("fa-play");
        document.getElementById("bell-icon").classList.add("fa-pause");
    }else{
        x.pause();
        x.currentTime = 0;
        document.getElementById("bell-icon").classList.remove("fa-pause");
        document.getElementById("bell-icon").classList.add("fa-play");
    }
} 

const tutorialAudioSwitch=() =>{ 
    if (y.paused) {
        y.play();
        document.getElementById("bell-icon").classList.remove("fa-play");
        document.getElementById("bell-icon").classList.add("fa-pause");
    }else{
        y.pause();
        y.currentTime = 0;
        document.getElementById("bell-icon").classList.remove("fa-pause");
        document.getElementById("bell-icon").classList.add("fa-play");
    }
} 

const switchVolume=(e) =>{
    x.volume = document.getElementById("bell-slider").value/100;
    console.log(x.volume);
}

const audioDone=() =>{
    document.getElementById("bell-icon").classList.remove("fa-pause");
    document.getElementById("bell-icon").classList.add("fa-play");
}
