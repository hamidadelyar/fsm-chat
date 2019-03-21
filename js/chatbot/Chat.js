class Chat {
  state;

  constructor() {
    this.state = "greetings";
  }

  setResponse(response) {
    return {
      messages: response.messages,
      buttons: response.buttons
    };
  }

  orchestrator(event) {
    let response;

    switch (this.state) {
      case "greetings":
        response = {
          messages: ["Hey there", "What can I help with?"],
          buttons: ["about", "blog"]
        };

        if (event) this.setState(response.buttons, event);

        return this.setResponse(response);
      case "about":
        response = {
          messages: ["This is my portfolio", "I have the following projects"],
          buttons: ["blog", "greetings"]
        };

        if (event) this.setState(response.buttons, event);

        return this.setResponse(response);
      default:
        response = {
          messages: ["Sorry didn't understand"],
          buttons: ["about"]
        };

        if (event) this.setState(response.buttons, event);

        return this.setResponse(response);
    }
  }

  getResponse() {
    return this.orchestrator();
  }

  talk(event = null) {
    if (event) {
      this.orchestrator(event);
    }

    return this.getResponse();
  }

  setState(nextStates, event) {
    // finds the next state
    const nextState = nextStates.find(
      item => item.toLowerCase() === event.toLowerCase()
    );
    // set state otherwise keep it at current state
    if (nextState) this.state = nextState;
    else this.state = "incomprehension";
  }
}
