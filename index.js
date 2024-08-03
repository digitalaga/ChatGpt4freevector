import express from 'express';
import axios from 'axios';
import path from 'path';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(path.resolve(), 'public', 'index.html'));
});

app.get('/gptchatly', async (req, res) => {
    const text = req.query.text;
    if (!text) return res.status(400).send('Text is required');
    try {
        const response = await getgptchatlyResponse(text);
        res.send(response.chatGPTResponse);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

function generateRandomIP() {
    const octet = () => Math.floor(256 * Math.random());
    return `${octet()}.${octet()}.${octet()}.${octet()}`;
}

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
        return response.data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}
