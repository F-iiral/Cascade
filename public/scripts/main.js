import { createMessageElement } from "./message.js";

const socket = new WebSocket("ws://" + window.location.host + "/ws");

let messageBuffer = ""; // Buffer to accumulate chunked text

socket.onopen = () => {
    console.log("WebSocket connection opened");
    socket.send("Can you send me some formatted text?");
};

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.action === "message") {
        messageBuffer += data.content;
    
        const parent = document.getElementById("newMessage");
        if (parent) {
            parent.innerHTML = "";
            const messageElement = createMessageElement(data.author, messageBuffer, "left");
            parent.appendChild(messageElement);
        }
    } else if (data.action === "done") {
        const parent = document.getElementById("content");
        const oldMessage = document.getElementById("newMessage");
        const newMessage = document.createElement("div");
    
        newMessage.id = "newMessage";
        if (oldMessage)
            oldMessage.id = "";
    
        parent.appendChild(newMessage);
        messageBuffer = "";
    }  
};

// Send Messages
document.getElementById('sendButton').addEventListener('click', () => {
    const messageInput = document.getElementById('messageInput');
    const content = messageInput.value;

    const grandParent = document.getElementById("content");
    const newMessage = document.createElement("div");
    const oldMessage = document.getElementById("newMessage");
    if (oldMessage) {
        oldMessage.innerHTML = "";
        const messageElement = createMessageElement("User", content, "right");
        oldMessage.appendChild(messageElement);
    }
    newMessage.id = "newMessage";
    if (oldMessage)
        oldMessage.id = "";
    grandParent.append(newMessage)

    if (content.trim() !== "") {
        fetch('api/message', {
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
            console.log('Message sent successfully:', data);
            messageInput.value = ""; // Clear input after sending
        })
        .catch(error => {
            console.error('Error sending message:', error);
        });
    }
});