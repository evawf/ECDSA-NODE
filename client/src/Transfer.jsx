import { useState } from "react";
import server from "./server";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  // const messageHash = (message) => keccak256(utf8ToBytes(message));
  // const signMessage = (msg) =>
  //   secp256k1.sign(messageHash(msg), privateKey, { recovered: true });

  async function transfer(evt) {
    evt.preventDefault();

    const msg = { amount: parseInt(sendAmount), recipient };
    const hashMsg = keccak256(Uint8Array.from(msg));
    const signature = await secp256k1.sign(hashMsg, privateKey);
    console.log(signature.toCompactHex());
    console.log(signature.recovery);

    // const stringifyBigInts = (obj) => {
    //   for (let prop in obj) {
    //     let value = obj[prop];
    //     if (typeof value === "bigint") {
    //       obj[prop] = value.toString();
    //     } else if (typeof value === "object" && value !== null) {
    //       obj[prop] = stringifyBigInts(value);
    //     }
    //   }
    //   return obj;
    // };

    console.log({
      sender: address,
      hashMsg: hashMsg,
      signature: signature.toCompactHex(),
    });

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        msg: msg,
        //signature: stringifyBigInts(signature),
        signature: signature.toCompactHex(),
      });
      setBalance(balance);
    } catch (ex) {
      console.log(ex);
      // alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
