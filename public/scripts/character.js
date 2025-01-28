export function createCharacterElement(id, name, tagline) {
    const container = document.createElement("div");
    container.className = "character-button-container";

    const nameElement = document.createElement("div");
    nameElement.className = "character-name";
    nameElement.textContent = name;

    const taglineElement = document.createElement("div");
    taglineElement.className = "character-tagline";
    taglineElement.textContent = tagline;

    container.onclick = () => {
        createCharacterEditorElement(id, name, tagline)
    };

    container.appendChild(nameElement);
    container.appendChild(taglineElement);
    container.appendChild(taglineElement);

    return container;
}

export function createCharacterEditorElement(id, name, description) {
    const parent = document.getElementById("content");
    parent.innerHTML = "";

    const container = document.createElement("div");

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

    const descriptionContainer = document.createElement("div")
    nameContainer.className = "";

    const descriptionHeader = document.createElement("p");
    descriptionHeader.textContent = "Character Description"
    descriptionHeader.className = "character-edit-header"

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

    // Buttons container
    const buttonsContainer = document.createElement("div")
    buttonsContainer.className = "button-container"

    const editButton = document.createElement("button");
    editButton.className = "button";
    editButton.innerHTML = '<span class="material-symbols-outlined">edit</span>';
    editButton.onclick = (event) => {
        event.stopPropagation();
        console.log("saving :3")
    };

    const cancelButton = document.createElement("button");
    cancelButton.className = "button";
    cancelButton.innerHTML = '<span class="material-symbols-outlined">cancel</span>';
    cancelButton.onclick = (event) => {
        event.stopPropagation();
        console.log("canceling :3")
    };

    const deleteButton = document.createElement("button");
    deleteButton.className = "button";
    deleteButton.innerHTML = '<span class="material-symbols-outlined dangerous-button">delete</span>';
    deleteButton.onclick = (event) => {
        event.stopPropagation();
        console.log("delete :3")
    };

    buttonsContainer.appendChild(editButton);
    buttonsContainer.appendChild(cancelButton);
    buttonsContainer.appendChild(deleteButton);

    container.append(nameContainer)
    container.append(descriptionContainer)
    container.append(buttonsContainer)
    parent.append(container)

    return container;
}