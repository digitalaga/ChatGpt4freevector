import express from 'express';
import axios from 'axios';
import path from 'path';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// Serve the main HTML file
app.get('/', (req, res) => {
    console.log('Serving index.html');
    res.sendFile(path.join(path.resolve(), 'public', 'index.html'));
});

// Handle GPT Chatly requests
app.get('/gptchatly', async (req, res) => {
    const text = req.query.text;
    if (!text) {
        console.log('Text query parameter is missing');
        return res.status(400).send('Text is required');
    }
    console.log(`Received text: ${text}`);
    try {
        const response = await getgptchatlyResponse(text);
        console.log(`Response from GPT Chatly: ${response.chatGPTResponse}`);
        res.send(response.chatGPTResponse);
    } catch (error) {
        console.error('Error during GPT Chatly request:', error.message);
        res.status(500).send(error.message);
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Function to generate a random IP address
function generateRandomIP() {
    const octet = () => Math.floor(256 * Math.random());
    return `${octet()}.${octet()}.${octet()}.${octet()}`;
}

// Function to get response from GPT Chatly
async function getgptchatlyResponse(content) {
    const headers = {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Linux; Android 11; M2004J19C Build/RP1A.200720.011) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.129 Mobile Safari/537.36 WhatsApp/1.2.3",
        Referer: "https://gptchatly.com/",
        "X-Forwarded-For": generateRandomIP()
    };
    const requestData = {
        past_conversations: [{
            role: "system",
            content: "You are a helpful assistant."
        }, {
            role: "user",
            content: content
        }]
    };
    try {
        const response = await axios.post("https://gptchatly.com/fetch-response", requestData, { headers });
        console.log('Successful response from GPT Chatly');
        return response.data;
    } catch (error) {
        console.error('Error fetching response from GPT Chatly:', error.message);
        throw error;
    }
}
