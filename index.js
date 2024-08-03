import axios from 'axios';
import cheerio from 'cheerio';
import express from 'express';
import path from 'path';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(path.resolve(), 'public', 'index.html'));
});

app.get('/gpt4free', async (req, res) => {
    const text = req.query.text;
    if (!text) return res.status(400).send('Text is required');
    try {
        let result = await generate(text);
        res.send(result);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

async function generate(q) {
    try {
        const nonceValue = JSON.parse(cheerio.load(await (await axios.get("https://gpt4free.io/chat")).data)(".mwai-chatbot-container").attr("data-system")).restNonce;
        const { data } = await axios("https://gpt4free.io/wp-json/mwai-ui/v1/chats/submit", {
            method: "post",
            data: {
                botId: "default",
                newMessage: q,
                stream: false
            },
            headers: {
                "X-WP-Nonce": nonceValue,
                "Content-Type": "application/json"
            }
        });
        return data.reply;
    } catch (err) {
        console.log(err.response.data);
        return err.response.data.message;
    }
}
