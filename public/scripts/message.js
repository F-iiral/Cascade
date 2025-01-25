import ReactDOM from "react-dom";
import { parseFormattedText } from "./markdown.js";
import { deleteMessage, editMessage, retryMessage } from "./listeners.js";

export function createMessageElement(author, content, id, align = "left") {
    const container = document.createElement("div");
    container.id = id
    container.className = `message-container ${align === "right" ? "align-right" : "align-left"}`;

    const authorElement = document.createElement("div");
    authorElement.className = "message-author";
    authorElement.textContent = author;

    const messageContent = document.createElement("div");
    messageContent.className = "message-content";
    ReactDOM.render(parseFormattedText(content), messageContent);

    // Buttons container
    const buttonsContainer = document.createElement("div");
    buttonsContainer.className = "button-container"

    const deleteButton = document.createElement("button");
    deleteButton.className = "button";
    deleteButton.innerHTML = '<span class="material-symbols-outlined" style="font-size: 16px;">delete</span>'
    deleteButton.onclick = () => {deleteMessage(Number.parseInt(container.id))};

    const editButton = document.createElement("button");
    editButton.className = "button";
    editButton.innerHTML = '<span class="material-symbols-outlined" style="font-size: 16px;">edit</span>'
    editButton.onclick = () => {editMessage(Number.parseInt(container.id))};

    const retryButton = document.createElement("button");
    retryButton.className = "button";
    retryButton.innerHTML = '<span class="material-symbols-outlined" style="font-size: 16px;">replay</span>'
    retryButton.onclick = () => {retryMessage(Number.parseInt(container.id))};

    buttonsContainer.appendChild(deleteButton);
    buttonsContainer.appendChild(editButton);
    buttonsContainer.appendChild(retryButton);

    container.appendChild(authorElement);
    container.appendChild(messageContent);
    container.appendChild(buttonsContainer);

    return container;
}