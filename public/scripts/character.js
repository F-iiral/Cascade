import { deactiveInputBar, activateInputBar, editCharacter, loadAllMessages, createNewCharacter, deleteCharacter, clearMessagesLocally } from "./listeners.js";

export function createCharacterElement(id, name, description, tagline) {
    const container = document.createElement("div");
    container.className = "character-button-container";

    const nameElement = document.createElement("div");
    nameElement.className = "character-name";
    nameElement.textContent = name;

    const taglineElement = document.createElement("div");
    taglineElement.className = "character-tagline";
    taglineElement.textContent = tagline;

    container.onclick = () => {
        deactiveInputBar();
        createCharacterEditorElement(id, name, description, tagline)
    };

    container.appendChild(nameElement);
    container.appendChild(taglineElement);
    container.appendChild(taglineElement);

    return container;
}

function createCharacterInterfaceElement(id, name, description, tagline) {
    const container = document.createElement("div");

    // Name
    const nameContainer = document.createElement("div")
    nameContainer.className = "";

    const nameHeader = document.createElement("p");
    nameHeader.className = "character-edit-header"
    nameHeader.textContent = "Character Name"

    const nameEdit = document.createElement("textarea");
    nameEdit.value = name;
    nameEdit.placeholder = name;
    nameEdit.id = `nameEdit-${id}`;
    nameEdit.className = "input-bar-character-editor";
    nameEdit.cols = 5;
    nameEdit.rows = 1;
    nameEdit.wrap = "hard";
    nameEdit.spellcheck = "true";

    nameContainer.append(nameHeader)
    nameContainer.append(nameEdit)

    // Tagline
    const taglineContainer = document.createElement("div")
    taglineContainer.className = "";

    const taglineHeader = document.createElement("p");
    taglineHeader.className = "character-edit-header"
    taglineHeader.textContent = "Character Tagline"

    const taglineEdit = document.createElement("textarea");
    taglineEdit.value = tagline;
    taglineEdit.placeholder = tagline;
    taglineEdit.id = `taglineEdit-${id}`;
    taglineEdit.className = "input-bar-character-editor";
    taglineEdit.cols = 5;
    taglineEdit.rows = 1;
    taglineEdit.wrap = "hard";
    taglineEdit.spellcheck = "true";

    taglineContainer.append(taglineHeader)
    taglineContainer.append(taglineEdit)

    // Description
    const descriptionContainer = document.createElement("div")
    nameContainer.className = "";

    const descriptionHeader = document.createElement("p");
    descriptionHeader.className = "character-edit-header"
    descriptionHeader.textContent = "Character Description"

    const descriptionEdit = document.createElement("textarea")
    descriptionEdit.value = description;
    descriptionEdit.placeholder = description;
    descriptionEdit.id = `descriptionEdit-${id}`;
    descriptionEdit.className = "input-bar-character-editor";
    descriptionEdit.cols = 5;
    descriptionEdit.rows = 10;
    descriptionEdit.wrap = "hard";
    descriptionEdit.spellcheck = "true";
    descriptionEdit.maxLength = 2056;

    descriptionContainer.append(descriptionHeader)
    descriptionContainer.append(descriptionEdit)

    container.append(nameContainer)
    container.append(taglineContainer)
    container.append(descriptionContainer)

    return container;
}
export function createCharacterEditorElement(id, name, description, tagline) {
    const parent = document.getElementById("content");
    parent.innerHTML = "";

    const container = createCharacterInterfaceElement(id, name, description, tagline);

    const buttonsContainer = document.createElement("div")
    buttonsContainer.className = "button-container"
    buttonsContainer.style = "width: 60vw;"

    const editButton = document.createElement("button");
    editButton.className = "button";
    editButton.innerHTML = '<span class="material-symbols-outlined">save</span>';
    editButton.onclick = (event) => {
        event.stopPropagation();
        editCharacter(id);
    };

    const cancelButton = document.createElement("button");
    cancelButton.className = "button";
    cancelButton.innerHTML = '<span class="material-symbols-outlined">cancel</span>';
    cancelButton.onclick = (event) => {
        event.stopPropagation();
        activateInputBar();
        loadAllMessages();
    };

    const deleteButton = document.createElement("button");
    deleteButton.className = "button";
    deleteButton.innerHTML = '<span class="material-symbols-outlined dangerous-button">delete</span>';
    deleteButton.onclick = (event) => {
        event.stopPropagation();
        deleteCharacter(id);
        clearMessagesLocally();
        loadAllMessages();
        activateInputBar();
    };

    buttonsContainer.appendChild(editButton);
    buttonsContainer.appendChild(cancelButton);
    buttonsContainer.appendChild(deleteButton);

    container.append(buttonsContainer)
    parent.append(container)

    return container;
}
export function createCharacterCreatorElement() {
    const parent = document.getElementById("content");
    parent.innerHTML = "";

    // TODO: need better names
    const container = createCharacterInterfaceElement("new", "Character Name", "Character Description", "Character Tagline");

    const buttonsContainer = document.createElement("div")
    buttonsContainer.className = "button-container"
    buttonsContainer.style = "width: 60vw;"

    const editButton = document.createElement("button");
    editButton.className = "button";
    editButton.innerHTML = '<span class="material-symbols-outlined">save</span>';
    editButton.onclick = (event) => {
        event.stopPropagation();
        createNewCharacter();
    };

    const cancelButton = document.createElement("button");
    cancelButton.className = "button";
    cancelButton.innerHTML = '<span class="material-symbols-outlined">cancel</span>';
    cancelButton.onclick = (event) => {
        event.stopPropagation();
        activateInputBar();
        loadAllMessages();
    };

    buttonsContainer.appendChild(editButton);
    buttonsContainer.appendChild(cancelButton);

    container.append(buttonsContainer)
    parent.append(container)

    return container;
}