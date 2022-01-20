/* eslint-disable no-unused-vars */

const switchTo = (currentID, nextID) => {
    // currentID = "child-log-in"
    // nextID = "admin-log-in"

    document.getElementById(currentID).classList.add("hidden");
    document.getElementById(nextID).classList.remove("hidden");
};

const accessStringSubmit = (event) => {
    event.preventDefault();

    let data = {};

    let accessStr = document.getElementById('child-str').value;
    if (accessStr === ''){
        console.log('Please put in a valid institue log in string.');
        return;
    }

    data['access-str'] = accessStr;

    fetch('/login', {
        method: 'POST',
        body: data,
    }).then((res) =>{
        if (res.ok) {
            return res.json();
        } else {
            throw new Error(res.status);
        }
    }).then((resData) => {
        // {"school-name": "St Mary's Primary School"}
        let schoolName = resData['school-name'];
        document.getElementById('school-name').innerText = schoolName;
        switchTo('child-log-in', 'participant-details');
    }).catch((err) =>{
        console.error(err);
    });
}
