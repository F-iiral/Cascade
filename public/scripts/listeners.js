import { createMessageElement } from "./message.js";
import { getConversationId, setConversationId, setUserTurnState } from "./main.js";
import { createConversationElement } from "./conversations.js";

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

// Clear Chat
document.getElementById('clearButton').addEventListener('click', clearMessages);

// Start new Conversation
document.getElementById('newConversationButton').addEventListener('click', () => {
    clearMessagesLocally();

    fetch('api/account/conversation/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            { 
                characters: null, // TODO: This needs to send over a list of characters
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
        setUserTurnState(true);
        setConversationId(data.id);
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
    input.style.minWidth = "49vw";

    message.textContent = "";
    message.appendChild(input);

    const sendButton = document.createElement('button');
    sendButton.className = "button"
    sendButton.innerHTML = '<span class="material-symbols-outlined" style="font-size: 16px;">edit</span>';
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
    cancelButton.innerHTML = '<span class="material-symbols-outlined" style="font-size: 16px;">cancel</span>';
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

    loadAllMessages();
}

export function loadAllMessages() {
    const parent = document.getElementById("content")
    parent.innerHTML = "";

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

export function loadAllConversations() {
    const parent = document.getElementById("sidebar")

    fetch('api/account/conversation', {
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
        console.log(data)

        for (let conversation of data) {
            if (conversation == {})
                continue
         
            const containerDiv = document.createElement("div")
            const messageElement = createConversationElement(conversation.id, conversation.name, conversation.characters);
            containerDiv.appendChild(messageElement)
            containerDiv.id = conversation.id

            parent.append(containerDiv)
        }

        const newConversation = document.createElement("div");
        newConversation.id = "newConversation";
        parent.append(newConversation)
    })
    .catch(error => {
        console.error('Error sending message:', error);
    });
}

export function switchConversation(id) {
    clearMessagesLocally();
    setConversationId(id);

    fetch('api/account/conversation/switch', {
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
        
        // This is a stupid way to do this but it is just on localhost so who cares :3
        loadAllMessages();
    })
    .catch(error => {
        console.error('Error sending message:', error);
    });
}
export function editConversation(id) {
    const conversationName = document.getElementById(id.toString()).children[0].children[0];
    const originalHTMLContent = conversationName.innerHTML;
    const originalContent = conversationName.textContent;

    const input = document.createElement('textarea');
    input.value = originalContent;
    input.id = `edit-${id}`;
    input.className = "inputBar";
    input.cols = 5;
    input.wrap = "hard";
    input.spellcheck = "true";
    input.style.minWidth = "12vw";

    conversationName.textContent = "";
    conversationName.appendChild(input);

    const sendButton = document.createElement('button');
    sendButton.className = "button"
    sendButton.innerHTML = '<span class="material-symbols-outlined" style="font-size: 16px;">edit</span>';
    sendButton.onclick = () =>  {
        const updatedName = input.value;

        fetch('api/account/conversation', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    "id": id,
                    "name": updatedName
                }
            )
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            conversationName.textContent = updatedName;
        })
        .catch(error => {
            console.error('Error sending message:', error);
        });
    };
    
    const cancelButton = document.createElement('button');
    cancelButton.className = "button"
    cancelButton.innerHTML = '<span class="material-symbols-outlined" style="font-size: 16px;">cancel</span>';
    cancelButton.onclick = () => {
        conversationName.innerHTML = originalHTMLContent;
    };

    // Append the send and cancel buttons next to the input
    conversationName.appendChild(sendButton);
    conversationName.appendChild(cancelButton);
}
export function deleteConversation(id) {
    const conversation = document.getElementById(id.toString());
    if (conversation) {
        conversation.remove();
    }
    if (id === getConversationId()) {
        clearMessagesLocally();
    }

    fetch('api/account/conversation', {
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

export function clearMessages() {
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
        clearMessagesLocally();
    })
    .catch(error => {
        console.error('Error sending message:', error);
    });
}
export function clearMessagesLocally() {
    const parent = document.getElementById("content");
    parent.innerHTML = "";

    const newMessage = document.createElement("div");
    newMessage.id = "newMessage";
    parent.append(newMessage)

    setUserTurnState(true);
}