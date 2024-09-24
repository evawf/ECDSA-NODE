import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
import { toHex } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";

const privateKey = secp256k1.utils.randomPrivateKey();

const publicKey = secp256k1.getPublicKey(privateKey);

console.log("private key: ", toHex(privateKey));
console.log("public key: ", toHex(publicKey));
console.log("addres: ", toHex(publicKey.slice(1).slice(-20)));
