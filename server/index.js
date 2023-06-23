const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const secp = require("ethereum-cryptography/secp256k1")
const { hexToBytes } = require("ethereum-cryptography/utils")

app.use(cors());
app.use(express.json());

const balances = {
  "02a48691d389dc86a61989e89ed6994193b63c087e2d9f9a652fecb6e1aa6b6175": 100, // ed47872187932e2b292978d46f22461b8a2450befa1a88e1da61e195d2f0483b
  "03d2a29a7c66102f011b8fc3c4516671ca5dd1b32bdef17a7e41d8d3cc96d5e553": 50, // ce8f01f65996c0f8731c60615b838e412baa8dc2402a5e9fea0318878f38d6e6
  "02fbdb9e3f212ac27c73f4e562d3dd4b549c006133051dc702279886d53329d922": 75, // f60d070fc2c32769b9c1b09c60b9a1b1a735e4986abf733870494768eb222c42
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, proof, hash } = req.body;

  const valid_tx = secp.secp256k1.verify(proof, hash, sender)

  if (!valid_tx) {
    res.status(400).send({ message: "Unauthorized!" });
    return;
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
