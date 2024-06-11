document.addEventListener("keydown", function (e) {
    if (e.ctrlKey && e.key === "r") {
        e.preventDefault();
        window.location.reload();
    } else if (e.key === "F5") {
        e.preventDefault();
        window.location.reload();
    }
});

document.addEventListener("DOMContentLoaded", function () {
    if (document.contentType !== "text/html") {
        document.querySelector("body").style.backgroundColor =
            "rgb(15, 23, 42)";
    }
});
