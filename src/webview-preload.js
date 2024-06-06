document.addEventListener("keydown", function (e) {
    if (e.ctrlKey && e.key === "r") {
        e.preventDefault();
        window.location.reload();
    } else if (e.key === "F5") {
        e.preventDefault();
        window.location.reload();
    }
});
