const express = require('express');
const cors = require('cors');
const { Rcon } = require('rcon-client');

const app = express();
app.use(cors());
app.use(express.json());

const RCON_CONFIG = {
    host: "51.89.64.91",
    port: 50062, // ახალი RCON პორტი
    password: "Bachia22@"
};

app.get('/get-balance/:player', async (req, res) => {
    try {
        const rcon = await Rcon.connect(RCON_CONFIG);
        const response = await rcon.send(`eco info ${req.params.player}`);
        await rcon.end();
        
        console.log("RCON Response:", response);

        const cleanResponse = response.replace(/,/g, '');
        // ვეძებთ ბალანსს, რომელიც ჩვეულებრივ ბოლო ციფრია პასუხში
        const match = cleanResponse.match(/(\d+(\.\d+)?)/g);
        
        let balance = 0;
        if (match && match.length > 0) {
            balance = parseFloat(match[match.length - 1]);
        }
        
        res.json({ balance });
    } catch (err) {
        console.error("Balance Error:", err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/give-reward', async (req, res) => {
    const { player, amount, secret } = req.body;
    if (secret !== "Bachia22@") return res.status(403).send("Wrong Secret");

    try {
        const rcon = await Rcon.connect(RCON_CONFIG);
        await rcon.send(`eco give ${player} ${amount}`);
        await rcon.end();
        res.send("OK");
    } catch (err) {
        console.error("Reward Error:", err);
        res.status(500).send(err.message);
    }
});

app.get('/', (req, res) => res.send("Bridge Online (Port 50062)"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log("Bridge running"));
