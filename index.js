const html2canvas = require("html2canvas");
const { makeUI } = require("./image.popup");

const setUpLogs = () => {
    if (console.everything === undefined) {
        console.everything = [];

        console.defaultLog = console.log.bind(console);
        console.log = function () {
            console.everything.push({ "type": "log", "datetime": Date().toLocaleString(), "value": Array.from(arguments) });
            console.defaultLog.apply(console, arguments);
        }
        console.defaultError = console.error.bind(console);
        console.error = function () {
            console.everything.push({ "type": "error", "datetime": Date().toLocaleString(), "value": Array.from(arguments) });
            console.defaultError.apply(console, arguments);
        }
        console.defaultWarn = console.warn.bind(console);
        console.warn = function () {
            console.everything.push({ "type": "warn", "datetime": Date().toLocaleString(), "value": Array.from(arguments) });
            console.defaultWarn.apply(console, arguments);
        }
        console.defaultDebug = console.debug.bind(console);
        console.debug = function () {
            console.everything.push({ "type": "debug", "datetime": Date().toLocaleString(), "value": Array.from(arguments) });
            console.defaultDebug.apply(console, arguments);
        }
    }
}

const addFeedbackButton = () => {
    const feedbackTool = document.createElement("div");
    feedbackTool.id = "feedback-tool-button";
    document.body.appendChild(feedbackTool);
    feedbackTool.style.position = "fixed";
    feedbackTool.style.bottom = "10px";
    feedbackTool.style.right = "10px";
    feedbackTool.style.backgroundColor = "white";
    feedbackTool.style.padding = "10px";
    feedbackTool.style.border = "1px solid black";
    feedbackTool.style.borderRadius = "5px";
    feedbackTool.style.cursor = "pointer";
    feedbackTool.style.zIndex = "20000000";
    feedbackTool.style.fontFamily = "Verdana";
    feedbackTool.style.backgroundColor = "white";

    feedbackTool.innerHTML = `
        Feedback
    `
    feedbackTool.addEventListener("click", () => {
        html2canvas(document.body).then(canvas => {
            makeUI(canvas, console.everything);
        });
    });
}

const setupEvents = () => {
    window.onerror = function (error, url, line, column, errorObject) {
        console.error("Error: " + error + "\nURL: " + url + "\nLine: " + line + "\nColumn: " + column + "\nError Cause: " + errorObject.cause + "\nError Stack: " + errorObject.stack);
    };

    if (document.readyState !== "loading") {
        addFeedbackButton();
    } else {
        document.addEventListener("DOMContentLoaded", () => {
            addFeedbackButton();
        })
    }
}



const ClientFeedbackTool = () => {
    const feedbackTool = document.getElementById("feedback-tool-button");
    if (feedbackTool) {
        return;
    }
    setUpLogs();
    setupEvents();
}

const setContext = (context) => {
    window.CFContext = window.CFContext || {};
    window.CFContext = { ...window.CFContext, ...context };
}

const clearContext = () => {
    window.CFContext = {};
}

module.exports = {
    ClientFeedbackTool,
    setContext,
    clearContext
};