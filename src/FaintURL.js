class FaintURL {
    constructor(url) {
        this.url = url;
        this.parseURL();
    }

    parseURL() {
        const urlPattern =
            /^(fatp:\/\/)?(([^:/?#]*)(?::([0-9]+))?)?([^?#]*)(\?[^#]*)?(#.*)?$/;
        const matches = this.url.match(urlPattern);

        this.protocol = matches[1] || "";
        this.hostname = matches[3] || "";
        this.port = matches[4] || "";
        this.pathname = matches[5] || "";
        this.search = matches[6] || "";
        this.hash = matches[7] || "";
    }

    get href() {
        return this.url;
    }

    get host() {
        return this.hostname + (this.port ? ":" + this.port : "");
    }

    toString() {
        return this.url;
    }
}

module.exports = FaintURL;
