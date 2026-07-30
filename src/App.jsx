import { useEffect, useRef, useState } from 'react'
import './App.css'

const startingMessages = [
  {
    id: crypto.randomUUID(),
    sender: 'robot',
    text: 'Hello! Ask me something and I will answer step by step.',
  },
]

const exampleQuestions = [
  'Can you get me todays date?',
  'Can you flip a coin?',
]

function getRobotAnswer(question) {
  const lowerQuestion = question.toLowerCase()

  if (lowerQuestion.includes('hello') || lowerQuestion.includes('hi')) {
    return 'Hello! Step 1: Type your question. Step 2: Press Send. Step 3: I will answer you here.'
  }

  if (lowerQuestion.includes('date')) {
    return `Step 1: I checked the current date from your browser. Step 2: Today is ${new Date().toLocaleDateString()}.`
  }

  if (lowerQuestion.includes('flip') && lowerQuestion.includes('coin')) {
    const coinSide = Math.random() < 0.5 ? 'heads' : 'tails'

    return `Step 1: I flipped a coin. Step 2: It landed on ${coinSide}.`
  }

  if (lowerQuestion.includes('react')) {
    return 'Step 1: React helps you build user interfaces. Step 2: You store changing data in state. Step 3: When state changes, React updates the screen.'
  }

  if (lowerQuestion.includes('chatbot')) {
    return 'Step 1: Save the user question in messages. Step 2: Create or fetch the robot reply. Step 3: Save the robot reply in messages. Step 4: Show all messages with map().'
  }

  return `Step 1: I read your question: "${question}". Step 2: I look for the best matching answer I know. Step 3: You can add more answers inside getRobotAnswer() to make me smarter.`
}

function ChatMessage({ message }) {
  const isUser = message.sender === 'user'

  return (
    <div className={`chat-message ${isUser ? 'user-message' : 'robot-message'}`}>
      {!isUser && (
        <img className="avatar" src="/robot-img.png" alt="Robot avatar" />
      )}

      <p className="message-bubble">{message.text}</p>

      {isUser && <img className="avatar" src="/user-img.png" alt="User avatar" />}
    </div>
  )
}

function ChatMessages({ messages, isRobotThinking }) {
  const messagesRef = useRef(null)

  useEffect(() => {
    const container = messagesRef.current

    if (container) {
      container.scrollTop = container.scrollHeight
    }
  }, [messages, isRobotThinking])

  return (
    <div className="chat-messages" ref={messagesRef}>
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}

      {isRobotThinking && (
        <div className="chat-message robot-message">
          <img className="avatar" src="/robot-img.png" alt="Robot avatar" />
          <p className="message-bubble thinking">Robot is thinking...</p>
        </div>
      )}
    </div>
  )
}

function ChatInput({ onSendMessage, isRobotThinking }) {
  const [inputText, setInputText] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    if (!inputText.trim() || isRobotThinking) {
      return
    }

    onSendMessage(inputText)
    setInputText('')
  }

  return (
    <div className="chat-controls">
      <div className="example-questions" aria-label="Example questions">
        {exampleQuestions.map((question) => (
          <button
            className="example-button"
            disabled={isRobotThinking}
            key={question}
            onClick={() => onSendMessage(question)}
            type="button"
          >
            {question}
          </button>
        ))}
      </div>

      <form className="chat-input-container" onSubmit={handleSubmit}>
        <input
          className="chat-input"
          placeholder="Ask the robot a question"
          value={inputText}
          onChange={(event) => setInputText(event.target.value)}
        />
        <button className="send-button" disabled={isRobotThinking}>
          Send
        </button>
      </form>
    </div>
  )
}

function App() {
  const [messages, setMessages] = useState(startingMessages)
  const [isRobotThinking, setIsRobotThinking] = useState(false)

  function handleSendMessage(question) {
    const userMessage = {
      id: crypto.randomUUID(),
      sender: 'user',
      text: question,
    }

    setMessages((currentMessages) => [...currentMessages, userMessage])
    setIsRobotThinking(true)

    setTimeout(() => {
      const robotMessage = {
        id: crypto.randomUUID(),
        sender: 'robot',
        text: getRobotAnswer(question),
      }

      setMessages((currentMessages) => [...currentMessages, robotMessage])
      setIsRobotThinking(false)
    }, 500)
  }

  return (
    <main className="app-container">
      <header className="chat-header">
        <img src="/robot-img.png" alt="" />
        <div>
          <h1>Robot Chatbot</h1>
          <p>Ask a question and the robot will answer step by step.</p>
        </div>
      </header>

      <ChatMessages messages={messages} isRobotThinking={isRobotThinking} />
      <ChatInput
        onSendMessage={handleSendMessage}
        isRobotThinking={isRobotThinking}
      />
    </main>
  )
}

export default App
