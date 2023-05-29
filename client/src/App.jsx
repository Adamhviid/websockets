import React, { useState, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import "./App.css";

function App() {
  const [messageHistory, setMessageHistory] = useState([]);
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  const { sendMessage, lastMessage, readyState } = useWebSocket(
    "ws://localhost:8000",
    {
      onOpen: () => console.log("WebSocket Client Connected"),
    }
  );

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage, setMessageHistory]);

  const handleClickSendMessage = () => {
    sendMessage(
      JSON.stringify({
        time: new Date().toLocaleString().slice(),
        username: username,
        message: message,
      })
    );
  };

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  return (
    <div>
      <h2>Choose username</h2>
      <input type="text" onChange={(e) => setUsername(e.target.value)} />
      {username != "" ? (
        <>
          <h3>The WebSocket is currently {connectionStatus}</h3>
          <input type="text" onChange={(e) => setMessage(e.target.value)} />

          <p>
            <button
              onClick={handleClickSendMessage}
              disabled={readyState !== ReadyState.OPEN}
            >
              Send Message
            </button>
          </p>
          <ul>
            {messageHistory.map((message, i) => (
              <p key={i}>{message ? message.data : null}</p>
            ))}
          </ul>
        </>
      ) : (
        <h3>Username: {username}</h3>
      )}
    </div>
  );
}

export default App;
