
// ------dark theme --------
const button = document.querySelector("#theme-btn");

function setTheme(dark) {
    document.body.classList.toggle("dark", dark);
    button.textContent = dark ? "Light mode" : "Dark mode";
    localStorage.setItem("fintracker:dark", dark);
}

button.addEventListener("click", function() {
    setTheme(!document.body.classList.contains("dark"));
});

setTheme(localStorage.getItem("fintracker:dark") === "true");
