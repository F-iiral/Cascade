import { createMessageElement } from "./message.js";
import { setUserTurnState } from "./main.js";

// Send Messages
document.getElementById('sendButton').addEventListener('click', () => {
    const messageInput = document.getElementById('messageInput');
    const content = messageInput.value;
    const messageElement = createMessageElement("User", content, 0, "right");

    if (content.trim() !== "") {
        createNewMessage(messageElement)
    }
    fetch('api/conversation/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            { 
                content: content,
                author: "User"
            }
        )
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        messageElement.id = data.id;
        messageInput.value = "";
        setUserTurnState(false);
    })
    .catch(error => {
        console.error('Error sending message:', error);
    });
});

export function createNewMessage(messageElement) {
    const grandParent = document.getElementById("content");
    const newMessage = document.createElement("div");
    newMessage.id = "newMessage";
    const oldMessage = document.getElementById("newMessage");

    if (oldMessage) {
        oldMessage.innerHTML = "";
        oldMessage.appendChild(messageElement);
    }

    newMessage.id = "newMessage";
    if (oldMessage)
        oldMessage.id = "";
    grandParent.append(newMessage)
}
export function deleteMessage(id) {
    const message = document.getElementById(id.toString());
    if (message) {
        message.remove();
    }

    fetch('api/conversation/messages', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            {
                "id": id
            }
        )
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    })
    .catch(error => {
        console.error('Error sending message:', error);
    });
}
export function editMessage(id) {
    const message = document.getElementById(id.toString()).children[1];
    const originalHTMLContent = message.innerHTML;
    const originalContent = message.textContent;

    const input = document.createElement('textarea');
    input.value = originalContent;
    input.id = `edit-${id}`;
    input.className = "inputBar";
    input.cols = 5;
    input.wrap = "hard";
    input.spellcheck = "true";
    input.style.minWidth = "44vw";

    message.textContent = "";
    message.appendChild(input);

    const sendButton = document.createElement('button');
    sendButton.className = "button"
    sendButton.innerHTML = '<span class="material-symbols-outlined">edit</span>';
    sendButton.onclick = () =>  {
        const updatedContent = input.value;

        fetch('api/conversation/messages', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    "id": id,
                    "content": updatedContent
                }
            )
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            message.textContent = updatedContent;
        })
        .catch(error => {
            console.error('Error sending message:', error);
        });
    };
    
    const cancelButton = document.createElement('button');
    cancelButton.className = "button"
    cancelButton.innerHTML = '<span class="material-symbols-outlined">cancel</span>';
    cancelButton.onclick = () => {
        message.innerHTML = originalHTMLContent;
    };

    // Append the send and cancel buttons next to the input
    message.appendChild(sendButton);
    message.appendChild(cancelButton);
}
export function retryMessage(id) {
    fetch('api/conversation/retry', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            {
                "id": id
            }
        )
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    })
    .catch(error => {
        console.error('Error sending message:', error);
    });

    const parent = document.getElementById("content");
    parent.innerHTML = "";
    loadAllMessages();
}

export function loadAllMessages() {
    const parent = document.getElementById("content")

    fetch('api/conversation/messages', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json()
    })
    .then(data => {
        for (let message of data) {
            if (message.message.content == "")
                continue
            
            const containerDiv = document.createElement("div")
            const messageElement = createMessageElement(message.author, message.message.content, message.id, message.message.role == "user" ? "right" : "left");
            containerDiv.appendChild(messageElement)
            containerDiv.id = ""

            parent.append(containerDiv)
        }

        const newMessage = document.createElement("div");
        newMessage.id = "newMessage";
        parent.append(newMessage)
    })
    .catch(error => {
        console.error('Error sending message:', error);
    });
}

// Clear Chat
document.getElementById('clearButton').addEventListener('click', () => {
    fetch('api/conversation/clear', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const grandParent = document.getElementById("content");
        grandParent.innerHTML = "";
    })
    .catch(error => {
        console.error('Error sending message:', error);
    });
});