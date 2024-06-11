const { ipcRenderer } = require("electron");
const $ = require("./jquery-3.7.1.min.js");
const package = require("../package.json");
const config = require("./config.js");
const store = require("./Store.js");
const FaintURL = require("./FaintURL.js");

$(window).on("load", async function () {
    // if (store.hasItem("tlds")) {
    //     store.removeItem("tlds");
    // }
    storeTLDs();
    const cjWebview = document.querySelector("#webview");

    setTitle(package.productName);

    $("#urlbox").focus(function () {
        $(this).select();
    });

    $("#urlbox").keydown(function (event) {
        if (event.keyCode === 27) {
            $("#urlbox").blur();
            cjWebview.focus();
        }
    });

    $("#urlbox").keypress(function (event) {
        var keycode = event.keyCode ? event.keyCode : event.which;
        if (keycode == "13") {
            const preurl = $("#urlbox").val();
            let url = "";
            if (preurl === "config:reload") {
                storeTLDs();
                return;
            } else if (preurl === "devtool") {
                cjWebview.openDevTools();
                return;
            }

            url = buildFaintDnsUrl(preurl);
            // console.log(url);
            cjWebview.loadURL(url);
            $("#urlbox").blur();
            cjWebview.focus();
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
        // ---
        cjWebview.focus();
        console.log(cjWebview.getURL());
    });
    WebViewOn("load-commit", () => {
        // ---
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
    window.document.title =
        title === package.productName
            ? package.productName
            : title + " - " + package.productName;
    $("#title").text(title);
}

function setUrl(url) {
    $("#urlbox").val(url);
}

function storeTLDs() {
    $.ajax({
        type: "get",
        url: config.tldsPath,
        success: function (response) {
            const data = [...response.public, ...response.private];
            store.setItem("tlds", data);
        },
    });
}

function buildFaintUrl(params) {
    return `${config.protocol}${params.get("domain_name")}.${params.get(
        "tld"
    )}${params.get("path")}`;
}

function buildFaintDnsUrl(url) {
    const parsedUrl = new FaintURL(url);
    const domain = parsedUrl.hostname.split(".")[0];
    const tld = parsedUrl.hostname.split(".")[1];
    const path = parsedUrl.pathname === "" ? "/" : parsedUrl.pathname;
    console.log({ domain, tld, path });
    let dns;
    if (!tld || !validateDomain(domain)) {
        dns = `${
            config.servePath
        }?domain_name=find&tld=faint&path=/search?text=${
            domain + path
        }&router_group=routes`;
    } else {
        dns = `${config.servePath}?domain_name=${domain}&tld=${tld}&path=${path}&router_group=routes`;
    }
    return dns;
}

function validateDomain(domain) {
    return /^(?!.*\\..*)(?!.*[^a-zA-Z0-9_-])(?!.*[_-]$)(?!^[_-])(?!^\\d+$)(?=.*[a-zA-Z])[a-zA-Z0-9_-]+$/g.test(
        domain
    );
}
