# Finite State Machine Chatbot

A chatbot implementation using a Finite State Machine (FSM).

![FSM Chatbot in Action](./bot.gif)

### Prerequisites

You will need to have Node and NPM installed.

### To Run

To install, run the command below.

```
npm install
```

After all the package dependancies have been installed, run the command below to start up the application.

```
gulp
```

## How To Use

- The key file in this application is the Chat.js file. This contains the core logic of the chatbot (Where the FSM is created). 

- The page-controller.js has several responsibilities:
    - Creates an instance of the Chat class
    - Supplies the Conversation Flow object to the instance of the Chat class
    - Creates a chat window within a Shadow DOM 
    - Displays interactipns between the user and the bot within a chat window

Below is a simple conversation flow, represented in a JSON object.

```js
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
            messages: [
                "I'm working on it!",
                "Select another option"
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
```

This is the input to the chatbot, after which it will create an orchestrator, with each conversation step (object in the array) represented as a state in our finite state machine. If none of the states match, it will go into our incomprehension state.

So, to pass this into our Chat class, we first will need to create an instance and then pass our object in.

```js
const bot = new Chat(convFlow);
```

To send events (states) to our FSM chatbot, we use the talk() method within the Chat class. You can see an example of how it is implemented in the page-controller.js

```js
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
```