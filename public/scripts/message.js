import ReactDOM from "react-dom";
import {parseFormattedText} from "./markdown.js"

export function createMessageElement(author, content, align = "left") {
    const container = document.createElement("div");
    container.className = `message-container ${align === "right" ? "align-right" : "align-left"}`;

    const authorElement = document.createElement("div");
    authorElement.className = "message-author";
    authorElement.textContent = author;

    const messageContent = document.createElement("div");
    messageContent.className = "message-content";
    ReactDOM.render(parseFormattedText(content), messageContent);

    container.appendChild(authorElement);
    container.appendChild(messageContent);

    return container;
}