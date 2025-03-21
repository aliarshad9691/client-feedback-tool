require('jquery');
require('fabric');
const jszip = require("jszip");
const saveAs = require("file-saver");
const UAParser = require("ua-parser-js");
const ImageEditor = require("tui-image-editor");

let ImageEditorRef

const makeLogFile = (data) => {
    let fileData = "";
    data.forEach(log => {
        fileData += `${log.datetime} ${log.type}: ${log.value.join(" ")}\n`;
    });
    return fileData;
}


const setupImageEditor = (imageHolder, canvas) => {
    ImageEditorRef = new ImageEditor(imageHolder, {
        includeUI: {
            loadImage: {
                path: canvas.toDataURL("image/png"),
                name: 'feedbackImage',
            },
            menuBarPosition: 'bottom',
        }
    });
}

const downloadZip = (imageData, feedbackText, logsData) => {
    const uap = new UAParser();
    const uaData = uap.getResult()
    uaData.screen = {};
    uaData.screen.width = screen.width;
    uaData.screen.height = screen.height;
    uaData.body = {};
    uaData.body.width = document.body.clientWidth;
    uaData.body.height = document.body.clientHeight;

    const zip = new jszip();
    zip.file("feedback.png", imageData.split(",")[1]);
    zip.file("browserLogs.txt", makeLogFile(logsData));
    zip.file("userFeedback.txt", feedbackText);
    zip.file("browserInfo.json", JSON.stringify(uaData));
    zip.generateAsync({ type: "blob" }).then(blob => {
        saveAs(blob, "feedback.zip");
    });
}

const makeUI = (canvas, logsData) => {
    const link = document.createElement("link");
    link.href = "https://uicdn.toast.com/tui-image-editor/latest/tui-image-editor.css"
    link.rel = "stylesheet";
    document.head.appendChild(link);

    const styles = document.createElement("style");
    styles.innerHTML = `
        .tui-image-editor-load-btn, .tui-image-editor-download-btn {
            display: none;
        }
        .tui-colorpicker-palette-button {
            width: 8px;
            height: 8px;
        }
    `
    document.head.appendChild(styles);

    const popup = document.createElement("div");
    popup.id = "image-editor-popup";
    popup.style.position = "fixed";
    popup.style.top = "5%";
    popup.style.right = "10%";
    popup.style.left = "10%";
    popup.style.bottom = "5%";
    popup.style.zIndex = "1000";
    popup.style.justifyContent = "center";
    popup.style.alignItems = "center";
    popup.style.display = "flex";
    popup.style.flexDirection = "column";
    document.body.appendChild(popup);

    const image = new Image();
    image.src = canvas.toDataURL("image/png");
    image.style.width = "100%";
    image.style.height = "100%";

    popup.innerHTML = `
        <div style="height: 100%; width: 100%; flex-grow: 1; display: flex; flex-direction: column; border: 1px solid #000; padding: 10px; box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5); font-family: 'Verdana';" id="image-editor-popup-content">
            <div style="font-size: 20px; font-weight: bold; border-bottom: 1px solid #000; padding-bottom: 10px;">Leave Feedback</div>
            <div style="flex-grow: 1; display: flex; justify-content: center; align-items: center; overflow: auto;">
                <div id="image-editor-popup-image"></div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 10px;">
                <textarea style="width: 100%; height: 100px; box-sizing: border-box;" id="feedback-textarea" placeholder="Leave Comment"></textarea>
                <div style="display: flex; justify-content: flex-end;">
                    <button style="width: 100px; height: 30px; background-color: #000; color: #fff; border: none; border-radius: 5px; cursor: pointer;" id="feedback-button">Submit</button>
                </div>
            </div>
        </div>
    `
    const imageHolder = document.getElementById("image-editor-popup-image");
    setupImageEditor(imageHolder, canvas);

    const feedbackButton = document.getElementById("feedback-button");
    feedbackButton.addEventListener("click", () => {
        const feedbackText = document.getElementById("feedback-textarea").value;
        const imageData = ImageEditorRef.toDataURL();
        downloadZip(imageData, feedbackText, logsData);
    });
}

module.exports = {
    makeUI
}