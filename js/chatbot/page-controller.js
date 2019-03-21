// initialize variables
let shadowRootDoc;
const bot = new Chat();

/**
 * @description - Scrolls to the bottom of the chat window
 */
function scrollToBottom() {
  const chatWindow = shadowRootDoc.getElementById("chat-messages");
  chatWindow.scrollBy({
    top: chatWindow.scrollHeight + 100, // could be negative value
    left: 0,
    behavior: "smooth"
  });
}

/**
 * Sends the users input to the chat server
 * @param {String} text
 */
function sendUserMessageToBot(text) {
  let userMsg;

  if (!text) {
    userMsg = shadowRootDoc.getElementById("user-input").value;
    shadowRootDoc.getElementById("user-input").value = "";
  } else {
    userMsg = text;
  }

  if (userMsg) {
    // display the users message on the chat
    displayMessageOnChat(false, userMsg);
    
    const response = bot.talk(userMsg)
    showTypingIndicator();

    setTimeout(function(){
      displayMessageOnChat(true, response);
      hideTypingIndicator()
      scrollToBottom();
    }, 500)

  }
}


/**
 * @description toggles the typing indicator to appear
 */
function showTypingIndicator() {
  const typingIndicator = shadowRootDoc.getElementById("typing-indicator");
  typingIndicator.className = "show";
}

/**
 * @description hides the typing indicator
 */
function hideTypingIndicator() {
  const typingIndicator = shadowRootDoc.getElementById("typing-indicator");
  typingIndicator.className = "hide";
}

/**
 * @description Create message elements
 * @param {HTMLElement} messageContainer - container to add new elements to
 * @param {Array<String>} messages - array of messages to add
 */
function addMessages(messageContainer, messages) {
  for (let i = 0; i < messages.length; i++) {
    const messageElem = document.createElement("div");
    messageElem.className = "message";
    messageElem.innerText = messages[i];
    messageContainer.appendChild(messageElem);
  }
}

/**
 * @description Create button elements
 * @param {HTMLElement} messageContainer - container to add new elements to
 * @param {Array<String>} buttons - array of buttons to add
 */
function addButtons(messageContainer, buttons) {
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "button-container";
  for (let b = 0; b < buttons.length; b++) {
    const buttonElem = document.createElement("button");
    buttonElem.className = "convButton";
    buttonElem.innerText = buttons[b];
    buttonElem.setAttribute(
      "onclick",
      "sendQuickReply(this, '" + buttons[b] + "')"
    );
    buttonContainer.appendChild(buttonElem);
  }
  messageContainer.appendChild(buttonContainer);
}


/**
 * @description Display Message on chat
 * @param {Boolean} isAgentMsg
 * @param {Object} content - recieved from the server
 * @param {Boolean} hideComponent - whether buttons/forms should be hidden for this message or not. Only shown if it is the latest message
 */
function displayMessageOnChat(isAgentMsg, content, hideComponent) {
  const chatMessageWindow = shadowRootDoc.getElementById("chat-messages");

  const messageContainer = document.createElement("div");
  messageContainer.className = isAgentMsg
    ? "message-wrapper bot"
    : "message-wrapper user";

  if (isAgentMsg) {
    const messages = content.messages ? content.messages : null;
    const buttons = content.buttons ? content.buttons : null;
    // render text message
    if (messages) addMessages(messageContainer, messages);
    if(buttons) addButtons(messageContainer, buttons)
  } else {
    const messageElem = document.createElement("div");
    messageElem.className = "message";
    messageElem.innerText = content;
    messageContainer.appendChild(messageElem);
  }

  chatMessageWindow.appendChild(messageContainer);
}

/**
 * @description takes the value from a clicked button and sends message to server, as if user has typed it. After, all of the buttons are hidden
 * @param {HTMLElement} data - the html element that has been clicked
 */
function sendQuickReply(node, text) {
  // hide buttons once clicked
  const buttonContainer = node.parentNode;
  buttonContainer.parentNode.removeChild(buttonContainer);
  sendUserMessageToBot(text);
}

/**
 * @description responsible for opening the chat window and initialising a new socket connection/chat session if one does not already exist
 */
function openChat(elemToHide) {
  shadowRootDoc = document.getElementById("chat-bot").shadowRoot;
  // initialise socket connection if it hasnt already been done
  elemToHide.className = "hide";
  const chatWindow = shadowRootDoc.getElementById("chat-window");
  chatWindow.className = "show";
}

/**
 * @description responsible for minimising the chat window
 */
function closeChat() {
  const chatWindow = shadowRootDoc.getElementById("chat-window");
  chatWindow.className = "hide";
  const openChatButton = shadowRootDoc.getElementById("open-chat");
  openChatButton.className = "show";
}

/**
 * @description responsible for creating the html for the chat window - this uses the Shadow DOM approach
 */
function initChatWindow() {
  const chatbot = document.createElement("div");
  chatbot.id = "chat-bot";
  document.body.appendChild(chatbot);
  shadowRoot = chatbot.attachShadow({ mode: "open" });

  const chatWindow = document.createElement("div");
  chatWindow.id = "chat-window";

  const styleLink = document.createElement("link");
  styleLink.setAttribute("rel", "stylesheet");
  styleLink.setAttribute("href", "css/chatbot.css");

  const chatHeader = document.createElement("div");
  chatHeader.className = "chat-header";

  const botTitle = document.createElement("div");
  botTitle.className = "bot-title";
  botTitle.innerHTML = "Chatbot"
  const botImage = document.createElement("div");
  botImage.className = 'bot-image';
  chatHeader.appendChild(botImage);
  chatHeader.appendChild(botTitle);

  const minimizeBtn = document.createElement("div");
  const closeBtn = document.createElement("div");
  minimizeBtn.className = "chat-header-btn minimize";
  closeBtn.className = "chat-header-btn close";

  minimizeBtn.setAttribute("onclick", "closeChat()");
  closeBtn.setAttribute("onclick", "resetConversation()");

  chatHeader.appendChild(closeBtn);
  chatHeader.appendChild(minimizeBtn);

  const chatMessageWindow = document.createElement("div");
  chatMessageWindow.id = "chat-messages";

  const typingIndicator = document.createElement("div");
  typingIndicator.id = "typing-indicator";
  const dot1 = document.createElement("span");
  const dot2 = document.createElement("span");
  const dot3 = document.createElement("span");
  typingIndicator.appendChild(dot1);
  typingIndicator.appendChild(dot2);
  typingIndicator.appendChild(dot3);
  chatMessageWindow.appendChild(typingIndicator);


  const userInputField = document.createElement("input");
  userInputField.id = "user-input";
  userInputField.setAttribute("autocomplete", "off");
  userInputField.setAttribute("placeholder", "Type your message here....");
  const submitUserMessageButton = document.createElement("button");
  submitUserMessageButton.className = "btn-chat-send";

  const openChatButton = document.createElement("div");
  openChatButton.id = "open-chat";
  openChatButton.setAttribute("onclick", "openChat(this)");

  // finalise the chat window elements
  chatWindow.appendChild(chatHeader);
  chatWindow.appendChild(chatMessageWindow);
  // add all elements to the shadow root
  shadowRoot.appendChild(openChatButton);
  shadowRoot.appendChild(chatWindow);
  shadowRoot.appendChild(styleLink);

  // shadow root doc is used elsewhere in the code to query Shadow Root DOM
  shadowRootDoc = chatbot.shadowRoot;
}

/**
 * @description Initialises the chat window
 */
(function main() {
  initChatWindow();
  // initial message to chatbot
  const response = bot.talk();
  displayMessageOnChat(true, response);
})();



