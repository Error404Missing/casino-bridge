const express = require('express');
const cors = require('cors');
const { Rcon } = require('rcon-client');

const app = express();
app.use(cors());
app.use(express.json());

const RCON_CONFIG = {
    host: "51.89.64.91",
    port: 50086,
    password: "Bachia22@"
};

// ბალანსის წამოღება
app.get('/get-balance/:player', async (req, res) => {
    try {
        const rcon = await Rcon.connect(RCON_CONFIG);
        // ვახორციელებთ ბრძანებას, რომ გავიგოთ ბალანსი
        const response = await rcon.send(`eco info ${req.params.player}`);
        await rcon.end();
        
        // ვეძებთ ციფრებს პასუხში (მაგ: "Balance: 500.00$")
        const match = response.match(/(\d+(\.\d+)?)/);
        const balance = match ? parseFloat(match[0]) : 0;
        
        res.json({ balance });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// ფულის დარიცხვა (მოგებისას)
app.post('/give-reward', async (req, res) => {
    const { player, amount, secret } = req.body;
    if (secret !== "Bachia22@") return res.status(403).send("Wrong Secret");

    try {
        const rcon = await Rcon.connect(RCON_CONFIG);
        await rcon.send(`eco give ${player} ${amount}`);
        await rcon.end();
        res.send("OK");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Bridge running"));
