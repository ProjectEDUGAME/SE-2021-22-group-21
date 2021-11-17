const switchTo = (currentID, nextID) => {
    // currentID = "child-log-in"
    // nextID = "admin-log-in"

    document.getElementById(currentID).classList.add("hidden");
    document.getElementById(nextID).classList.remove("hidden");
}
