"use strict";

const express = require("express");
const favicon = require("serve-favicon");
const bodyParser = require("body-parser");
const session = require("express-session");
const consolidate = require("consolidate");
const swig = require("swig");
const helmet = require("helmet");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const MongoClient = require("mongodb").MongoClient;
const http = require("http");
const marked = require("marked");
const app = express();
const routes = require("./app/routes");
const { port, db, cookieSecret } = require("./config/config");

MongoClient.connect(db, (err, db) => {
    if (err) {
        console.log("Error: DB: connect");
        console.log(err);
        process.exit(1);
    }
    console.log(`Connected to the database`);

    // Fix for A5 - Security MisConfig
    // Helmet secures HTTP headers
    app.use(helmet());

    // Remove x-powered-by header
    app.disable("x-powered-by");

    // Adding HTTP Headers for security
    app.use(favicon(__dirname + "/app/assets/favicon.ico"));

    // Express middleware to populate "req.body"
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: false
    }));

    // Secure session management
    app.use(session({
        secret: cookieSecret,
        saveUninitialized: true,
        resave: true,
        // Fix for A3 - XSS
        cookie: {
            httpOnly: true
        }
    }));

    // Input validation middleware using validator
    app.use((req, res, next) => {
        if (req.body && req.body.email) {
            if (!validator.isEmail(req.body.email)) {
                return res.status(400).send("Invalid email format");
            }
        }
        next();
    });

    // Register templating engine
    app.engine(".html", consolidate.swig);
    app.set("view engine", "html");
    app.set("views", `${__dirname}/app/views`);
    app.use(express.static(`${__dirname}/app/assets`));

    // Initializing marked library
    marked.setOptions({
        sanitize: true
    });
    app.locals.marked = marked;

    // Making bcrypt, jwt, validator available in routes
    app.locals.bcrypt = bcrypt;
    app.locals.jwt = jwt;
    app.locals.validator = validator;

    // Application routes
    routes(app, db);

    // Template system setup - Fix for A3 XSS
    swig.setDefaults({
        autoescape: true
    });

    // HTTP server
    http.createServer(app).listen(port, () => {
        console.log(`Express http server listening on port ${port}`);
    });

});