class Chat {
  constructor() {
    this.state = "greetings";
    this.event = "";
    this.callbacks = {}; // contains our cases - will be used by our pseudo switch
    this.response = "";
    this.createOrchestrator();
  }

  createOrchestrator() {
    const convFlow = [
      {
        name: "greetings",
        response: {
          messages: [
              "Hey there my name is Hamid. I'm a software engineer at Accenture", 
              "You can ask me anything from the below questions?"
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

    for (let i = 0; i < convFlow.length; i++) {
      this.addConversationStep(convFlow[i].name, convFlow[i].response);
    }
  }

  /**
   * Creates a new case in our pseudo switch, representing a state in the conversation
   * @param {*} name 
   * @param {*} response 
   */
  addConversationStep(name, response) {
    const self = this;

    this.add(name, function() {
      self.setResponse(response);
    });
  }

  /**
   * @description add cases to our pseudo switch
   * @param {*} _case
   * @param {*} fn
   */
  add(_case, fn) {
    this.callbacks[_case] = this.callbacks[_case] || [];
    this.callbacks[_case].push(fn);
  }

  /**
   * @description A Pseudo Switch Statement
   */
  pseudoSwitch() {
    if (this.callbacks[this.state]) {
      this.callbacks[this.state].forEach(function(fn) {
        fn();
      });
    } else {
      this.callbacks["default"].forEach(function(fn) {
        fn();
      });
    }
  }

  /**
   * @description format our response from the chatbot
   * @param {*} response
   */

  setResponse(response) {
    if (this.event) this.setState(response.buttons);

    this.response = {
      messages: response.messages,
      buttons: response.buttons
    };
  }

  /**
   * @description A finite state machine, representing the orchestration layer of our chatbot
   */
  orchestrator() {
    let response;

    switch (this.state) {
      case "greetings":
        response = {
          messages: ["Hey there", "What can I help with?"],
          buttons: ["about", "blog"]
        };

        return this.setResponse(response);
      case "about":
        response = {
          messages: ["This is my portfolio", "I have the following projects"],
          buttons: ["blog", "greetings"]
        };

        return this.setResponse(response);
      default:
        response = {
          messages: ["Sorry didn't understand"],
          buttons: ["about"]
        };

        return this.setResponse(response);
    }
  }

  /**
   * @description don't change the state, just see what the response should be for the state that we're in
   */
  getResponse() {
    this.event = ""; // do not want an event changing the state
    this.pseudoSwitch();
    return this.response;
  }

  /**
   * @description talk to the chatbot
   * @param {String} event - identifies what state we should go to next from the current state
   *
   */
  talk(event = "") {
    if (event) {
      this.event = event;
      this.pseudoSwitch();
    }

    return this.getResponse();
  }

  /**
   * @description Sets the next state according by checking the possible next states to see if event is in it
   * @param {Array} nextStates
   */
  setState(nextStates) {
    const nextState = nextStates.find(
      item => item.toLowerCase() === this.event.toLowerCase()
    );

    // update the state or set to incomprehension
    if (nextState) this.state = nextState;
    else this.state = "incomprehension";
  }
}
