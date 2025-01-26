import { switchConversation } from "./listeners.js";

export function createConversationElement(id, name, characters) {
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "conversation-button-container";

    const nameElement = document.createElement("div");
    nameElement.className = "conversation-name";
    nameElement.textContent = name;

    const charactersPreview = document.createElement("div");
    charactersPreview.className = "conversation-characters";
    charactersPreview.textContent = characters.map(char => char.name).join(", ");

    buttonContainer.onclick = () => {
        switchConversation(id);
    };

    buttonContainer.appendChild(nameElement);
    buttonContainer.appendChild(charactersPreview);

    return buttonContainer;
}