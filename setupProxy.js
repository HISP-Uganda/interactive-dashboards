const express = require("express");
let cors = require("cors");

const { createProxyMiddleware } = require("http-proxy-middleware");

let sessionCookie = "";
const onProxyReq = (proxyReq) => {
    if (sessionCookie) {
        proxyReq.setHeader("cookie", sessionCookie);
    }
};
const onProxyRes = (proxyRes) => {
    const proxyCookie = proxyRes.headers["set-cookie"];
    if (proxyCookie) {
        sessionCookie = proxyCookie;
    }
};
// proxy middleware options
const options = {
    // target: "https://eidsr.health.go.ug",
    // target: "https://dev.ndpme.go.ug/ndpdb",
    // target: "http://localhost:8080",
    // target: "https://tests.dhis2.hispuganda.org/hmis/",
    target: "https://hmis-tests.health.go.ug",
    // target: "https://hmis-repo.health.go.ug/repo",
    // target: "https://tests.dhis2.stephocay.com/sia",
    // target: "https://etracker.moh.gov.rw/individualrecords",
    // target: "https://epivac.health.go.ug",
    // target: "https://train.ndpme.go.ug/ndpdb",
    // target: "https://play.dhis2.org/2.38.4.3",
    onProxyReq,
    onProxyRes,
    changeOrigin: true, // needed for virtual hosted sites
    auth: undefined,
    logLevel: "debug",
};

// create the proxy (without context)
const exampleProxy = createProxyMiddleware(options);

const app = express();
app.use(
    cors({
        credentials: true,
        origin: ["http://localhost:3000"],
    })
);
app.use("/", exampleProxy);
app.listen(3002);
