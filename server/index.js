const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require("ethereum-cryptography/secp256k1");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");

const secp256k1 = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");

app.use(cors());
app.use(express.json());

const balances = {
  "0346db38cc2474f23e5a08037abc1279507c569bfd9ae0b4903e84d6e4cb7ecb68": 100,
  "02e7b1a3b42bd783590b78e8f4f475a63b2f33e459817ca607e844413af2928cdc": 50,
  "03c71aa4660793de7aad67fe99991f54e1d5d49221d4bb6d10df0a9f5d91ff6e62": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  // Todo: get a signature from the client-side application

  const { sender, msg, signature } = req.body;
  const hashMsg = keccak256(Uint8Array.from(msg));
  const { amount, recipient } = msg;

  console.log(signature);
  // console.log(sender, toHex(hashMsg), signature);

  const isSigned = secp.secp256k1.verify(
    { ...signature, r: BigInt(signature.r), s: BigInt(signature.s) },
    hashMsg,
    sender
  );
  console.log("isSigned: ", isSigned);

  if (!isSigned) res.status(400).send({ message: "Bad signature!" });

  //recover the public address from the signature

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
