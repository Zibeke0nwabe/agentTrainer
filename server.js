const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
require("dotenv").config();
const session = require('express-session');

const app = express();
const port = process.env.PORT || 3002;

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 30 * 60 * 1000 } // Session expires in 30 minutes
}));

app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({ extended: true }));  

const apiKey = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
  systemInstruction: `You are a TalkTalk customer chatting with customer service agent. You may be experiencing various issues with your service, billing, or account.

        **Possible Chat Reasons:**
        * Making a payment
        * Setting up or canceling direct debit
        * Upgrading to faster broadband
        * Disputing charges
        * Understanding a high bill
        * Opening a new account
        * Experiencing internet outages or slow speeds
        * Paying for broadband you are not using
        * Inquiring about account closure due to bereavement (account holder deceased)
        * Closing your account due to moving or switching to another provider

        **Account Information:**
        * You may be asked for your account number, landline number, or last name and postcode to verify your identity.
        * You should provide the following when asked:
            - Account number: It must start with either **9800** or **9700**.
            - Landline number: It must start with **04**.
            - Mobile number: It must start with either **07** or **08**.
            - Last name and postcode: Always provide these when asked.
        * When asked for information such as your account number or landline number, your vulnerability may affect your ability to provide it. For example, vision issues might make it difficult for you to see the numbers, and mobility challenges could make it harder to access them.
        * If you don’t have this information readily available, share whatever details you can remember, but be honest about the possibility of not recalling certain information or not being able to move and get that needed information.

        **Vulnerabilities:**
        * You may have vulnerabilities such as hearing, vision, mobility, cognitive impairments, or others.
        * These vulnerabilities may affect your ability to communicate effectively or understand the agent's instructions.
        * You may be hesitant to discuss these vulnerabilities directly.

        **Chat Behavior:**
        * As a customer, be realistic and respond like a normal human. Occasionally, express frustration, anger, confusion, or skepticism depending on the situation.
        * If you feel like you are not being helped or the call is taking too long, show signs of frustration or even anger. You don’t need to agree to everything the agent says.
        * If the agent is suggesting a solution that doesn’t make sense, question them, and don’t agree just for the sake of it. Push back if necessary and ask for clarification until the resolution makes sense to you.
        * If you're being asked to provide the same details repeatedly, you can express irritation. It's okay to feel like you're being ignored or that the agent isn't being helpful.
        * If you are given an unreasonable solution, feel free to demand a better resolution or ask to speak with a manager. Show impatience if needed.
        * Don't hesitate to express dissatisfaction with the service if it’s not resolving your issues. Feel free to complain if you think it’s necessary.

        **Important Notes:**
        * If you were unaware that Shell Energy transferred your account to TalkTalk, show your confusion and ask for clarification.
        * If you are uncertain about your current contract and its terms, ask about it in detail and challenge any vague answers you might receive.

        Now, simulate a random issue you might have when contacting TalkTalk customer service. You may get upset or frustrated depending on how things are going. Respond in a realistic manner, sometimes questioning or pushing back if the agent doesn’t seem to understand or offer an acceptable resolution. Your goal is to get a satisfactory answer and make sure your issue is resolved properly.`

});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Sessions (per-device based via uuid)
const sessionMap = new Map();

function getSession(sessionId) {
  if (!sessionMap.has(sessionId)) {
    sessionMap.set(sessionId, model.startChat({ generationConfig, history: [] }));
  }
  return sessionMap.get(sessionId);
}

// Route for session ID creation (frontend fetches this)
app.get('/session', (req, res) => {
  const sessionId = uuidv4();
  res.send({ sessionId });
});
//route protecttion
function requireAuth(req, res, next) {
  if (req.session && req.session.isAuthenticated) {
    next(); 
  } else {
    res.redirect('/login');
  }
}

// Static routes
app.get('/login', (req, res) => res.sendFile(__dirname + '/public/login.html'));
app.get('/logintl', (req, res) => res.sendFile(__dirname + '/public/TL.html'));
app.get('/loading', requireAuth, (req, res) => res.sendFile(__dirname + '/public/loading.html'));
app.get('/leader', (req, res) => res.sendFile(__dirname + '/public/DashBoard.html'));
app.get('/agent-call', (req, res) => res.sendFile(__dirname + '/public/agent-call.html'));
app.get('/voice', requireAuth, (req, res) => {
  res.sendFile(__dirname + '/public/voice.html');
});

app.get('/home', requireAuth, (req, res) => {
  res.sendFile(__dirname + '/public/home.html');
});
app.get('/chat', requireAuth, (req, res) => {
  res.sendFile(__dirname + '/public/chat.html');
});
app.get('/evaluate', requireAuth, (req, res) => {
  res.sendFile(__dirname + '/public/end.html');
});
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Logout error');
    }
    res.redirect('/login');
  });
});
//login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === process.env.LOGIN_USERNAME && password === process.env.LOGIN_PASSWORD) {
    req.session.isAuthenticated = true;  // Set session to authenticated
    console.log('Login successful');
    return res.json({ success: true });
  }

  console.log('Login failed');
  return res.json({ success: false, message: 'Incorrect username or password.' });
});
// Chat endpoint
app.post('/chat', async (req, res) => {
  const { message, sessionId } = req.body;
  try {
    const session = getSession(sessionId);
    const result = await session.sendMessage(message);
    res.send({ response: result.response.text() });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Error during chat' });
  }
});

// Voice endpoint
app.post('/voice', async (req, res) => {
  const { message, sessionId } = req.body;
  try {
    const session = getSession(sessionId);
    const result = await session.sendMessage(message);
    res.send({ response: result.response.text() });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Error during voice' });
  }
});
app.post('/evaluate', async (req, res) => {
  const { sessionId, transcript } = req.body;
  console.log("Received Transcript:", transcript);

  if (!Array.isArray(transcript) || transcript.length < 2) {
    return res.status(400).json({ error: "Transcript is missing or not an array, or there aren't enough messages." });
  }

  const conversationText = transcript.join('\n');  // Join the transcript into a single string

  const evaluationPrompt = `
    You are an AI call quality evaluator.

    Here is the full transcript between an Agent and a Customer:
    ${conversationText}

    Please evaluate the agent's performance based on the following:
    - Provide a brief summary of the customer's issue (e.g., What was the customer asking for?)
    - Summarize how the agent responded to the issue.
    - List key strengths of the agent during the call.
    - Point out areas where the agent can improve.
    - Assign a score out of 10, with an explanation for the score.

    Provide the response in a friendly and realistic tone.
  `;

  try {
    const evaluator = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",  
    });

    const result = await evaluator.generateContent(evaluationPrompt);
    const feedback = result.response.text ? result.response.text() : result.response;

    res.json({ feedback });
  } catch (error) {
    console.error("Evaluation error:", error.message);
    res.status(500).json({ error: "Evaluation failed. Please try again later." });
  }
});
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
