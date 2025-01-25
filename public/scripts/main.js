import { createMessageElement } from "./message.js";
import { loadAllMessages } from "./listeners.js";

const socket = new WebSocket("ws://" + window.location.host + "/ws");

let messageBuffer = "";
let userTurn = true;

export function setUserTurnState(state) {
    userTurn = !!state;
}
export function getUserTurnState() {
    return userTurn;
}

socket.onopen = () => {
    console.log("WebSocket connection opened");
};

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.action === "message") {
        messageBuffer += data.content;
    
        const parent = document.getElementById("newMessage");
        if (parent) {
            parent.innerHTML = "";
            const messageElement = createMessageElement(data.author, messageBuffer, NaN, "left");
            parent.appendChild(messageElement);
        }
    } else if (data.action === "done") {
        const parent = document.getElementById("content");
        const oldMessage = document.getElementById("newMessage");
        const newMessage = document.createElement("div");
        setUserTurnState(true);
    
        newMessage.id = "newMessage";
        if (oldMessage) {
            oldMessage.id = "";
            for (const messageChild of oldMessage.children) {
                messageChild.id = data.id
            }
        }

        parent.appendChild(newMessage);
        messageBuffer = "";
    }  
};

function checkCondition() {
    const hasMessageInput = document.getElementById("messageInput").value != "";
    const conditionMet = hasMessageInput && getUserTurnState();

    const sendButtonIcon = document.querySelector('#sendButton .material-symbols-outlined');

    if (conditionMet) {
        sendButtonIcon.textContent = 'send';
    } else {
        sendButtonIcon.textContent = 'send_and_archive';
    }
}

// Startup
loadAllMessages();
setInterval(checkCondition, 100);