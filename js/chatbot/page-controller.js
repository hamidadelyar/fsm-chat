// initialize variables
let shadowRootDoc;
const convFlow = [
  {
    id: "greetings",
    response: {
      messages: [
        "Hello visitor, welcome to my site, what can I help you with?",
        "You can select from any of the below buttons"
      ],
      buttons: [
        {
          state: "howOld",
          display: "how old are you?"
        },
        {
          state: "blogAbout",
          display: "What is your blog about?"
        }
      ]
    }
  },
  {
    id: "howOld",
    response: {
      messages: [
        "I was born in December 1994, I will let you do the math!",
        "what else do you want to know?"
      ],
      buttons: [
        {
          state: "blogAbout",
          display: "what is your blog about?"
        },
        {
          state: "blog",
          display: "blog"
        }
      ]
    }
  },
  {
    id: "blogAbout",
    response: {
      messages: [
        "My blog is about tech and programming, visit it and you can find out!",
        "what else do you want to know?"
      ],
      buttons: [
        {
          state: "howOld",
          display: "How old are you?"
        },
        {
          state: "postMore",
          display: "Why don't you post more?"
        }
      ]
    }
  },
  {
    id: "postMore",
    response: {
      messages: ["I'm working on it!", "Select another option"],
      buttons: [
        {
          state: "howOld",
          display: "How old are you?"
        },
        {
          state: "postMore",
          display: "Why don't you post more?"
        }
      ]
    }
  },
  {
    id: "incomprehension",
    response: {
      messages: ["Sorry didn't understand"],
      buttons: [
        {
          state: "greetings",
          display: "greetings"
        }
      ]
    }
  }
];
const bot = new Chat(convFlow);
const timeDelay = 400;

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
 * @param {String} userMsg - This is what we will display in the chat window
 * @param {String} state - This is the 'event' that we will pass to our FSM
 */
async function sendUserMessageToBot(userMsg, state) {
  // display the users message on the chat
  displayMessageOnChat(false, userMsg);

  const response = bot.talk(state);
  showTypingIndicator();
  await timer(timeDelay);
  displayMessageOnChat(true, response);
  hideTypingIndicator();
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

function timer(ms) {
  return new Promise(res => setTimeout(res, ms));
}

/**
 * @description Create message elements
 * @param {HTMLElement} messageContainer - container to add new elements to
 * @param {Array<String>} messages - array of messages to add
 */
async function addMessages(messageContainer, messages) {
  for (let i = 0; i < messages.length; i++) {
    const messageElem = document.createElement("div");
    messageElem.className = "message";
    messageElem.innerText = messages[i];
    messageContainer.appendChild(messageElem);
    scrollToBottom();
    await timer(timeDelay);
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
    const state = buttons[b].state;
    buttonElem.className = "convButton";
    buttonElem.innerText = buttons[b].display;
    buttonElem.setAttribute(
      "onClick", 
      `sendQuickReply(this, '${escapeStringQuotations(buttons[b].display)}', '${state}')`
    )
    buttonElem.setAttribute("state", state);
    buttonContainer.appendChild(buttonElem);
  }
  messageContainer.appendChild(buttonContainer);
  scrollToBottom();
}

/**
 * @description Display Message on chat
 * @param {Boolean} isAgentMsg
 * @param {Object} content - recieved from the server
 * @param {Boolean} hideComponent - whether buttons/forms should be hidden for this message or not. Only shown if it is the latest message
 */
async function displayMessageOnChat(isAgentMsg, content, hideComponent) {
  const chatMessageWindow = shadowRootDoc.getElementById("chat-messages");

  const messageContainer = document.createElement("div");
  messageContainer.className = isAgentMsg
    ? "message-wrapper bot"
    : "message-wrapper user";

  chatMessageWindow.appendChild(messageContainer);

  if (isAgentMsg) {
    const messages = content.messages ? content.messages : null;
    const buttons = content.buttons ? content.buttons : null;
    // render text message
    if (messages) addMessages(messageContainer, messages);
    await timer(timeDelay * messages.length);
    if (buttons) addButtons(messageContainer, buttons);
  } else {
    const messageElem = document.createElement("div");
    messageElem.className = "message";
    messageElem.innerText = content;
    messageContainer.appendChild(messageElem);
  }
}

/**
 * @description takes the value from a clicked button and sends message to server, as if user has typed it. After, all of the buttons are hidden
 * @param {HTMLElement} data - the html element that has been clicked
 */
function sendQuickReply(node, text, state) {
  // hide buttons once clicked
  const buttonContainer = node.parentNode;
  buttonContainer.parentNode.removeChild(buttonContainer);
  sendUserMessageToBot(text, state);
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
 * @description A function that escapes quotations in a string
 * @param unformattedString
 */
function escapeStringQuotations(unformattedString) {
  const formattedString = unformattedString.toString().replace(new RegExp("'", 'g'), "\\'");
  return formattedString.replace(new RegExp('"', 'g'), "\\'");
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
  botTitle.innerHTML = "Chatbot";
  const botImage = document.createElement("div");
  botImage.className = "bot-image";
  chatHeader.appendChild(botImage);
  chatHeader.appendChild(botTitle);

  const closeBtn = document.createElement("div");
  closeBtn.className = "chat-header-btn close";
  closeBtn.setAttribute("onclick", "closeChat()");

  chatHeader.appendChild(closeBtn);

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
