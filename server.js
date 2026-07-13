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
const logger = require("./logger");
const rateLimit = require("express-rate-limit");
const csrf = require("csurf");
const app = express();
const routes = require("./app/routes");
const { port, db, cookieSecret } = require("./config/config");

// Rate Limiting - max 100 requests per 15 minutes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, please try again after 15 minutes.",
    handler: (req, res) => {
        logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
        res.status(429).send("Too many requests, please try again after 15 minutes.");
    }
});

// Strict rate limit for login
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: "Too many login attempts, please try again after 15 minutes.",
    handler: (req, res) => {
        logger.warn(`Login rate limit exceeded for IP: ${req.ip}`);
        res.status(429).send("Too many login attempts, please try again after 15 minutes.");
    }
});

MongoClient.connect(db, (err, db) => {
    if (err) {
        logger.error("Error: DB: connect");
        logger.error(err);
        process.exit(1);
    }
    logger.info("Connected to the database");

    // Helmet with CSP and HSTS
    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "https://ajax.googleapis.com", "https://maxcdn.bootstrapcdn.com"],
                styleSrc: ["'self'", "https://maxcdn.bootstrapcdn.com", "'unsafe-inline'"],
                imgSrc: ["'self'", "data:"],
                fontSrc: ["'self'", "https://maxcdn.bootstrapcdn.com"],
                objectSrc: ["'none'"],
                upgradeInsecureRequests: [],
            },
        },
        hsts: {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true
        }
    }));

    // Remove x-powered-by header
    app.disable("x-powered-by");

    // Apply general rate limiting
    app.use(limiter);

    // CORS Configuration
    app.use((req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:4000");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        next();
    });

    // Adding HTTP Headers for security
    app.use(favicon(__dirname + "/app/assets/favicon.ico"));

    // Express middleware
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: false
    }));

    // Secure session management
    app.use(session({
        secret: cookieSecret,
        saveUninitialized: true,
        resave: true,
        cookie: {
            httpOnly: true
        }
    }));

    // CSRF Protection
    const csrfProtection = csrf({ cookie: false });
    app.use(csrfProtection);

    // Make CSRF token available in templates
    app.use((req, res, next) => {
        res.locals.csrfToken = req.csrfToken();
        logger.info(`CSRF token generated for ${req.method} ${req.url}`);
        next();
    });

    // Apply login rate limiting
    app.use("/login", loginLimiter);

    // Input validation middleware
    app.use((req, res, next) => {
        if (req.body && req.body.email) {
            if (!validator.isEmail(req.body.email)) {
                logger.warn("Invalid email input detected: " + req.body.email);
                return res.status(400).send("Invalid email format");
            }
        }
        next();
    });

    // Log every incoming request
    app.use((req, res, next) => {
        logger.info(`${req.method} ${req.url} - IP: ${req.ip}`);
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

    // Template system setup
    swig.setDefaults({
        autoescape: true
    });

    // HTTP server
    http.createServer(app).listen(port, () => {
        logger.info(`Express http server listening on port ${port}`);
        logger.info("Application started successfully with Week 4 & 5 security enhancements");
    });

});