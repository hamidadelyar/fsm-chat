class Chat {
  constructor() {
    this.state = "greetings";
  }

  /**
   * @description format our response from the chatbot
   * @param {*} response 
   * @param {String} event - identifies what state we should go to next from the current state
   */

  setResponse(response, event) {
    if(event) this.setState(response.buttons, event);

    return {
        messages: response.messages,
        buttons: response.buttons
      };
  }

  /**
   * @description A finite state machine, representing the orchestration layer of our chatbot
   * @param {String} event - identifies what state we should go to next from the current state
   */
  orchestrator(event) {
    let response;

    switch (this.state) {
      case "greetings":
        response = {
          messages: ["Hey there", "What can I help with?"],
          buttons: ["about", "blog"]
        };

        return this.setResponse(response, event);
      case "about":
        response = {
          messages: ["This is my portfolio", "I have the following projects"],
          buttons: ["blog", "greetings"]
        };

        return this.setResponse(response, event);
      default:
        response = {
          messages: ["Sorry didn't understand"],
          buttons: ["about"]
        };

        return this.setResponse(response, event);
    }
  }

  /**
   * @description don't change the state, just see what the response should be for the state that we're in
   */
  getResponse() {
    return this.orchestrator();
  }

  /**
   * @description talk to the chatbot
   * @param {String} event 
   */
  talk(event = '') {
    if (event) {
      this.orchestrator(event);
    }

    return this.getResponse();
  }

  /**
   * @description Sets the next state according by checking the possible next states to see if event is in it
   * @param {Array} nextStates 
   * @param {String} event 
   */
  setState(nextStates, event) {
    const nextState = nextStates.find(
      item => item.toLowerCase() === event.toLowerCase()
    );

    // update the state or set to incomprehension
    if (nextState) this.state = nextState;
    else this.state = "incomprehension";
  }
}
