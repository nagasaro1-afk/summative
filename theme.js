//theme.js
// ------dark theme --------
const button = document.querySelector("#theme-btn");
// Turns dark mode on (true) or off (false)
function setTheme(dark) {
    document.body.classList.toggle("dark", dark); // adds or remove the "dark "class
    button.textContent = dark ? "Light mode" : "Dark mode"; // button text changes
    localStorage.setItem("fintracker:dark", dark);// remember
}

button.addEventListener("click", function() {
    setTheme(!document.body.classList.contains("dark"));
});

setTheme(localStorage.getItem("fintracker:dark") === "true");
