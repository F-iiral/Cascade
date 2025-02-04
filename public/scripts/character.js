import { deactiveInputBar, activateInputBar, editCharacter, loadAllMessages, createNewCharacter, deleteCharacter, selectCharacter, clearMessagesLocally } from "./listeners.js";

export function createCharacterElement(id, name, description, tagline, avatar) {
    const container = document.createElement("div");
    container.className = "character-button-container";

    const infoContainer = document.createElement("div");
    infoContainer.className = "character-info";

    let avatarElement;
    if (avatar != null) {
        avatarElement = document.createElement("img");
        avatarElement.src = `image/${avatar}`;
        avatarElement.className = "character-avatar";
    }
    else {
        avatarElement = document.createElement("span");
        avatarElement.innerHTML = "person";
        avatarElement.className = "material-symbols-outlined character-avatar";
        avatarElement.style.fontSize = "64px";
    }

    const textContainer = document.createElement("div");
    textContainer.className = "character-text";

    const nameElement = document.createElement("div");
    nameElement.className = "character-name";
    nameElement.textContent = name;

    const taglineElement = document.createElement("div");
    taglineElement.className = "character-tagline";
    taglineElement.textContent = tagline;

    container.onclick = () => {
        deactiveInputBar();
        createCharacterEditorElement(id, name, description, tagline, avatar);
    };

    textContainer.appendChild(nameElement);
    textContainer.appendChild(taglineElement);
    
    infoContainer.appendChild(avatarElement);
    infoContainer.appendChild(textContainer);
    
    container.appendChild(infoContainer);

    return container;
}

function createCharacterInterfaceElement(title, id, name, description, tagline, avatar) {
    const container = document.createElement("div");

    // Title
    const titleText = document.createElement("h1");
    titleText.textContent = title

    // Avatar
    const avatarOuterContainer = document.createElement("div")
    const avatarInnerContainer = document.createElement("div")
    avatarOuterContainer.className = "";
    avatarInnerContainer.className = "character-info";

    let avatarElement;
    if (avatar != null) {
        avatarElement = document.createElement("img");
        avatarElement.src = `image/${avatar}`;
        avatarElement.className = "character-avatar";
    }
    else {
        avatarElement = document.createElement("span");
        avatarElement.innerHTML = "person";
        avatarElement.className = "material-symbols-outlined character-avatar";
        avatarElement.style.fontSize = "64px";
    }

    const avatarHeader = document.createElement("p");
    avatarHeader.className = "character-edit-header"
    avatarHeader.textContent = "Character Avatar"

    const avatarText = document.createElement("p");
    avatarText.textContent = "The Avatar for your character. This will accept any image file. Recommended size is atleast 256x256."

    const avatarInput = document.createElement("input");
    avatarInput.type = "file";
    avatarInput.accept = "image/*";
    avatarInput.id = "image-input";

    avatarInnerContainer.append(avatarElement)
    avatarInnerContainer.append(avatarInput)
    avatarOuterContainer.append(avatarHeader)
    avatarOuterContainer.append(avatarText)
    avatarOuterContainer.append(avatarInnerContainer)

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

    container.append(titleText)
    container.append(avatarOuterContainer)
    container.append(nameContainer)
    container.append(taglineContainer)
    container.append(descriptionContainer)

    return container;
}
export function createCharacterEditorElement(id, name, description, tagline, avatar) {
    const parent = document.getElementById("content");
    parent.innerHTML = "";

    const container = createCharacterInterfaceElement(`Editing "${name}"..`, id, name, description, tagline, avatar);

    const buttonsContainer = document.createElement("div")
    buttonsContainer.className = "button-container"
    buttonsContainer.style = "width: 60vw;"

    const editButton = document.createElement("button");
    editButton.className = "button";
    editButton.innerHTML = '<span class="material-symbols-outlined">save</span>';
    editButton.onclick = async (event) => {
        event.stopPropagation();
        await editCharacter(id);
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
    const container = createCharacterInterfaceElement(`Creating a new Character..`, "new", "Character Name", "Character Description", "Character Tagline", null);

    const buttonsContainer = document.createElement("div")
    buttonsContainer.className = "button-container"
    buttonsContainer.style = "width: 60vw;"

    const editButton = document.createElement("button");
    editButton.className = "button";
    editButton.innerHTML = '<span class="material-symbols-outlined">save</span>';
    editButton.onclick = async (event) => {
        event.stopPropagation();
        await createNewCharacter();
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

export async function createCharacterSelectorElement() {
    const parent = document.getElementById("content");
    parent.style.pointerEvents = "none";
    parent.style.opacity = "0.3";

    const overlay = document.createElement("div");
    overlay.className = "overlay";

    const selectorContainer = document.createElement("div");
    selectorContainer.className = "character-selector";

    const title = document.createElement("h2");
    title.innerText = "Select a Character";
    selectorContainer.appendChild(title);

    const characterList = document.createElement("div");
    characterList.className = "character-list";

    try {
        const characters = await fetch('api/account/character', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });

        characters.forEach(character => {
            const label = document.createElement("label");
            const outerContainer = document.createElement("div");
            const innerContainer = document.createElement("div");
            outerContainer.className = "character-selector-outer";
            innerContainer.className = "character-selector-inner";

            const radioButton = document.createElement("input");
            radioButton.type = "radio";
            radioButton.name = "character";
            radioButton.value = character.id;
            radioButton.onclick = () => {
                selectCharacter(character.id);
                document.body.removeChild(overlay);
                parent.style.pointerEvents = "auto";
                parent.style.opacity = "1";
            };
            
            let avatarElement;
            if (character.avatar != null) {
                avatarElement = document.createElement("img");
                avatarElement.src = `image/${character.avatar}`;
                avatarElement.className = "character-avatar-small";
            }
            else {
                avatarElement = document.createElement("span");
                avatarElement.innerHTML = "person";
                avatarElement.className = "material-symbols-outlined character-avatar-small";
                avatarElement.style.fontSize = "64px";
            }        
            
            const nameSpan = document.createElement("span");
            nameSpan.innerText = character.name;
            
            innerContainer.appendChild(avatarElement);
            innerContainer.appendChild(nameSpan);
            outerContainer.appendChild(radioButton);
            outerContainer.appendChild(innerContainer);
            label.appendChild(outerContainer);
            
            characterList.appendChild(label);
        });
    } catch (error) {
        console.error("Failed to fetch characters:", error);
    }

    selectorContainer.appendChild(characterList);
    overlay.appendChild(selectorContainer);
    document.body.appendChild(overlay);
}