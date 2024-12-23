const inputText = document.getElementById("inputT")
const messagesContainer = document.getElementById('messages');
const form = document.getElementById("form")


function sendMessage(message) {

    if(ws.readyState === WebSocket.OPEN){
        ws.send(message)
    }else{
        console.log("WebSocket connection is not open, Try again later...")
    }
}



const ws = new WebSocket(`ws://${window.location.hostname}:3939`);



form.addEventListener("submit", (e)=>{
    e.preventDefault()

    sendMessage(inputText.value)
})


ws.onopen = () =>{
    console.log("connected to the server")
    
    
}


ws.onmessage = (e)=>{
    const messages = e.data.split('\n')
    messagesContainer.innerHTML = '';


    messages.forEach((message) => {
        const messageElement = document.createElement('p');
        messageElement.textContent = message;
        messagesContainer.appendChild(messageElement);
    });
    
}



ws.onclose = () =>{
    console.log("Disconnected from the server")
}