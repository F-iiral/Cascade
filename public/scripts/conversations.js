import { switchConversation, editConversation, deleteConversation, activateInputBar } from "./listeners.js";

export function createConversationElement(id, name, characters) {
    const container = document.createElement("div");
    container.className = "conversation-button-container";

    const nameElement = document.createElement("div");
    nameElement.className = "conversation-name";
    nameElement.textContent = name;

    const charactersPreview = document.createElement("div");
    charactersPreview.className = "conversation-characters";
    charactersPreview.textContent = characters.map(char => char.name).join(", ");

    container.onclick = () => {
        activateInputBar();
        switchConversation(id);
    };

    // Buttons container
    const buttonsContainer = document.createElement("div");
    buttonsContainer.className = "button-container";

    const editButton = document.createElement("button");
    editButton.className = "button";
    editButton.innerHTML = '<span class="material-symbols-outlined" style="font-size: 16px;">edit</span>';
    editButton.onclick = (event) => {
        event.stopPropagation();
        editConversation(Number.parseInt(container.parentElement.id));
    };

    const deleteButton = document.createElement("button");
    deleteButton.className = "button";
    deleteButton.innerHTML = '<span class="material-symbols-outlined" style="font-size: 16px;">delete</span>';
    deleteButton.onclick = (event) => {
        event.stopPropagation();
        deleteConversation(Number.parseInt(container.parentElement.id));
    };

    buttonsContainer.appendChild(editButton);
    buttonsContainer.appendChild(deleteButton);

    container.appendChild(nameElement);
    container.appendChild(charactersPreview);
    container.appendChild(buttonsContainer);

    return container;
}