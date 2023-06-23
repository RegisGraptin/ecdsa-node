
const secp = require("ethereum-cryptography/secp256k1")
const { toHex } = require("ethereum-cryptography/utils")

let randomPrivateKey = secp.secp256k1.utils.randomPrivateKey();

console.log(toHex(randomPrivateKey))

let publicKey = secp.secp256k1.getPublicKey(randomPrivateKey);

console.log("Public key:", toHex(publicKey));
