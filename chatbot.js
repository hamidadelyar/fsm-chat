let currentState = "greetings";

function chatBot(state, event) {
  let nextStates;
  let messages;

  switch (state) {
    case "greetings":
      nextStates = ["about", "blog"];
      messages = ["Hey there", "What can I help with?"];

      nextState = nextStates.find(item => item.toLowerCase() === event.toLowerCase() )
      setState(nextState);

      return setResponse(nextStates, messages);
    case "about":
      nextStates = ["blog", "help"];
      messages = ["This is my portfolio", "I have the following projects"];

      nextState = nextStates.find(item => item.toLowerCase() === event.toLowerCase() )

      setState(nextState);
      return setResponse(nextStates, messages);
    default:
      nextStates = "";
      messages = ["Oops something went wrong"];
      return setResponse(nextStates, messages);
  }
}

function setResponse(nextStates, messages) {
  return {
    messages: messages,
    buttons: nextStates
  };
}

(function dialogue() {
    printMessage(currentState, "about");
    printMessage(currentState, "blog");
})();

function printMessage(state, event) {
  const response = chatBot(state, event);
  console.log(JSON.stringify(response, null, 2));
  console.log("--------------------------");
}

function setState(state) {
  currentState = state ? state : 'incomprehension';
  console.log("state set to " + state)
}
