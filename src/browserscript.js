/* $("#urlbox");
$("#openurl").click(function () {
    var url = $("#urlbox").val();
    $("#webview").attr("src", url);
});
 */

// $(document).ready(function () {
//     const webview = $("#webview");

//     const loadstart = () => {
//         setTimeout(() => {
//             $("#loader").css("width");
//         }, 100);
//     };
// });

onload = () => {
    const webview = document.querySelector("#webview");
    const indicator = document.querySelector(".indicator");

    const loadstart = () => {
        indicator.innerText = "loading...";
    };

    const loadstop = () => {
        indicator.innerText = "";
    };

    webview.addEventListener("did-start-loading", loadstart);
    webview.addEventListener("did-stop-loading", loadstop);
};
