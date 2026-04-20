const express = require('express');
const cors = require('cors');
const { Rcon } = require('rcon-client');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/give-reward', async (req, res) => {
    const { player, amount, secret } = req.body;
    if (secret !== "Bachia22@") return res.status(403).send("Wrong Secret");

    try {
        const rcon = await Rcon.connect({
            host: "51.89.64.91",
            port: 50102, // შენი RCON პორტი
            password: "Bachia22@"
        });
        await rcon.send(`eco give ${player} ${amount}`);
        await rcon.end();
        res.send("OK");
    } catch (err) {
        res.status(500).send("Error: " + err.message);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Bridge is running on port " + PORT));
