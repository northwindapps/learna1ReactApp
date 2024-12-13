const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
const { PythonShell } = require("python-shell");
const { spawn } = require("child_process");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.get('/test', async (req, res) => {
  
  res.status(200).send("bye");
});

app.get('/donut', async (req, res) => {
  PythonShell.run('donut_inference.py', {
    args: ['./receipt1.png'], // Pass the image file path as an argument
  }).then(messages => {
    console.log('Inference Result:', messages);
    res.status(200).send("ok");
  }).catch(err => {
    console.log('Error during inference:', err);
    res.status(500).send('Error during inference.');
  });
});

app.post('/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4', // or 'gpt-3.5-turbo'
        messages: [{ role: 'user', content: message }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    res.json({ reply: response.data.choices[0].message.content });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error communicating with OpenAI API');
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
