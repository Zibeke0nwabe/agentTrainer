const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const bodyParser = require('body-parser');
require("dotenv").config();
const functions = require('firebase-functions');
const path = require('path');

const apiKey = 'AIzaSyBy1mBFlIvZhTk9TM7st8FbjGL7PnX6Lf0';
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

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Initialize chat session
let chatSession = model.startChat({
  generationConfig,
  history: [],
});

// Route for login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Route for TL login page
app.get('/logintl', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'TL.html'));
});

// Route for loading page
app.get('/loading', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'loading.html'));
});

// Route for voice page
app.get('/voice', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'voice.html'));
});

// Route for home page
app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// Route for leader page (dashboard)
app.get('/leader', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'DashBoard.html'));
});

// Route for agent call page
app.get('/agent-call', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'agent-call.html'));
});

// Route for chat page
app.get('/chat', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'chat.html'));
});

// Chat API route
app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const result = await chatSession.sendMessage(userMessage);
    const responseText = result.response.text();
    res.send({ response: responseText });
  } catch (error) {
    console.error("Error during chat:", error);
    res.status(500).send({ error: "Error during chat" });
  }
});
// Start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  console.log('Its working fine')
});
exports.app = functions.https.onRequest(app);