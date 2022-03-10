/* eslint-disable no-unused-vars */

const switchTo = (currentID, nextID) => {
    // currentID = "child-log-in"
    // nextID = "admin-log-in"

    document.getElementById(currentID).classList.add("hidden");
    document.getElementById(nextID).classList.remove("hidden");
};

// const accessStringSubmit = (event) => {
//     event.preventDefault();

//     let data = {};

//     let accessStr = document.getElementById('child-str').value;
//     if (accessStr === ''){
//         console.log('Please put in a valid institue log in string.');
//         return;
//     }

//     data['access-str'] = accessStr;

//     fetch('/login', {
//         method: 'POST',
//         body: data,
//     }).then((res) =>{
//         if (res.ok) {
//             return res.json();
//         } else {
//             throw new Error(res.status);
//         }
//     }).then((resData) => {
//         // {"school-name": "St Mary's Primary School"}
//         let schoolName = resData['school-name'];
//         document.getElementById('school-name').innerText = schoolName;
//         switchTo('child-log-in', 'participant-details');
//     }).catch((err) =>{
//         console.error(err);
//     });
// }

const copyText = () =>{
    let newPasscode = document.getElementById("newPassword");
    navigator.clipboard.writeText(newPasscode.innerText);
    document.getElementById("copy-text-btn").innerText="Copied!"
}

const hidePopUp = () =>{
    document.getElementById("staticBackdrop").style.display = "none";
}

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
