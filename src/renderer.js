const { ipcRenderer } = require("electron");
const $ = require("./jquery-3.7.1.min.js");

$(window).on("load", function () {
    const cjWebview = document.querySelector("#webview");

    setTitle("Fake-Net");

    $("#urlbox").keypress(function (event) {
        var keycode = event.keyCode ? event.keyCode : event.which;
        if (keycode == "13") {
            const preurl = $("#urlbox").val();
            let url = "";
            try {
                const procurl = new URL(preurl);
                url = procurl.href;
            } catch (err) {
                url = "http://" + preurl;
            }
            console.log(url);
            cjWebview.loadURL(url);
            $("#urlbox").blur();
        }
    });

    $("#minimize").click(function () {
        ipcRenderer.send("minimize");
    });
    $("#maximize").click(function () {
        ipcRenderer.send("maximize");
    });

    $("#close").click(function () {
        ipcRenderer.send("close");
    });

    $("#refresh").click(() => {
        if ($("#refresh").data("action") === "refresh") {
            cjWebview.reload();
        } else if ($("#refresh").data("action") === "stop-loading") {
            cjWebview.stop();
        }
    });

    $("#back").click(() => {
        cjWebview.goBack();
    });
    $("#forward").click(() => {
        cjWebview.goForward();
    });

    WebViewOn("did-start-loading", () => {
        $("#title-icon-loader").css("display", "block");
        $("#title-icon-loaded").css("display", "none");
        $("#refresh").data("action", "stop-loading");
        $("#icon-refresh").css("display", "none");
        $("#icon-stop-browsing").css("display", "block");
        // setTitle("Loading...");
    });
    WebViewOn("did-stop-loading", () => {
        $("#title-icon-loader").css("display", "none");
        $("#title-icon-loaded").css("display", "block");
        $("#refresh").data("action", "refresh");
        $("#icon-refresh").css("display", "block");
        $("#icon-stop-browsing").css("display", "none");
        if (cjWebview.getTitle() !== "preload.html") {
            setTitle(cjWebview.getTitle());
        } else {
            setTitle("Fake-Net");
        }
        if (!cjWebview.getURL().startsWith("file://")) {
            setUrl(cjWebview.getURL());
        } else {
            setUrl("");
        }
    });
    WebViewOn("load-commit", () => {
        if (cjWebview.getTitle() !== "preload.html") {
            setTitle(cjWebview.getTitle());
        } else {
            setTitle("Fake-Net");
        }
        if (!cjWebview.getURL().startsWith("file://")) {
            setUrl(cjWebview.getURL());
        } else {
            setUrl("");
        }
        if (cjWebview.canGoBack()) {
            $("#back").prop("disabled", false);
        } else {
            $("#back").prop("disabled", true);
        }
        if (cjWebview.canGoForward()) {
            $("#forward").prop("disabled", false);
        } else {
            $("#forward").prop("disabled", true);
        }
    });

    function onWebViewLoaded(fnc) {
        WebViewOn("dom-ready", fnc);
    }

    function WebViewOn(event, fnc) {
        cjWebview.addEventListener(event, fnc);
    }
});

function setTitle(title) {
    window.document.title = title;
    $("#title").text(title);
}

function setUrl(url) {
    $("#urlbox").val(url);
}
