// server.js
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

async function generateText(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating text:', error);
    return 'Error generating text.';
  }
}

function parseGeneratedText(text) {
  const parts = text.split(/1\.|2\.|3\./);
  if (parts.length < 4) {
    return { dilemma: text, options: [] };
  }

  const dilemma = parts[0].trim();
  const options = [
    parts[1] ? `1. ${parts[1].trim()}` : '',
    parts[2] ? `2. ${parts[2].trim()}` : '',
    parts[3] ? `3. ${parts[3].trim()}` : '',
  ];

  return { dilemma, options };
}

app.use(express.static('public'));

app.get('/generate', async (req, res) => {
  const prompt = 'Generate a ethical dilemna and list out three options as 1:, 2:, 3:';
  const generatedText = await generateText(prompt);
  const parsedText = parseGeneratedText(generatedText);
  res.json({parsedText});
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
