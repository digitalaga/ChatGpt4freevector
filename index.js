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

app.get('/freechatgptonline', async (req, res) => {
    const text = req.query.text;
    if (!text) return res.status(400).send('Text is required');
    try {
        const result = await generate(text);
        res.send(result.reply);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

async function generate(q) {
    try {
        const { data } = await axios("https://www.freechatgptonline.com/wp-json/mwai-ui/v1/chats/submit", {
            method: "post",
            data: {
                botId: "default",
                newMessage: q,
                stream: false
            },
            headers: {
                Accept: "text/event-stream",
                "Content-Type": "application/json"
            }
        });
        return data;
    } catch (err) {
        console.log(err.response.data);
        return { reply: err.response.data.message };
    }
}
