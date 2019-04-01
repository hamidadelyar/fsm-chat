# Finite State Machine Chatbot

A chatbot implementation using a Finite State Machine (FSM).

## Getting Started

The key file in this application is the Chat.js file. This contains the core logic of the chatbot (Where the FSM is created). 

A simple conversation flow, represented in a JSON object.

```
const convFlow = [
    {
        name: "greetings",
        response: {
            messages: [
                "Hey there my name is Hamid. I'm a programmer!", 
                "You can select from the options below"
            ],
            buttons: ["how old are you?", "blog"]
        }
    },
    {
        name: "how old are you?",
        response: {
            messages: [
                "I'm current 24 years old", 
                "what else do you want to know?"
            ],
            buttons: ["what is your blog about?", "blog"]
        }
    },
    {
        name: "what is your blog about?",
        response: {
            messages: [
                "My blog is about tech and programming", 
                "what else do you want to know?"
            ],
            buttons: ["how old are you", "blog"]
        }
    },
    {
        name: "default",
        response: {
            messages: ["Sorry didn't understand"],
            buttons: ["greetings"]
        }
    }
];
```

This is the input to the chatbot, after which it will create an orchestrator, with each conversation step represented as a state in our finite state machine. If none of the states match, it will go into our incomprehension state (the 'default' state).

I will improve the way we define our conversation flows once I get some more time.

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

