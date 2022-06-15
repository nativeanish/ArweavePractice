import Arweave from "arweave";
import { JWKInterface } from "arweave/node/lib/wallet";
import { LoggerFactory, SmartWeaveNodeFactory } from "redstone-smartweave";
import fs from "fs";
import path from "path";
import { helloState } from "./hello";
(async () => {
  const arweave = Arweave.init({
    host: "testnet.redstone.tools",
    port: 443,
    protocol: "https",
  });
  LoggerFactory.INST.logLevel("error");
  const smartweave = SmartWeaveNodeFactory.forTesting(arweave);
  const wallet = await arweave.wallets.generate();
  const walletAddress = await arweave.wallets.jwkToAddress(wallet);
  await addFunds(arweave, wallet);
  const contractSrc = fs.readFileSync(
    path.join(__dirname + "/../dist/hello.js"),
    "utf8"
  );
  const stateFromFile: helloState = JSON.parse(
    fs.readFileSync(path.join(__dirname + "/../dist/initial.json"), "utf8")
  );
  const initialState = {
    ...stateFromFile,
    ...{
      owner: walletAddress,
    },
  };
  const contracTxId = await smartweave.createContract.deploy({
    wallet,
    initState: JSON.stringify(initialState),
    src: contractSrc,
  });
  console.log(contracTxId);
})();

async function addFunds(arweave: Arweave, wallet: JWKInterface) {
  const walletaddress = await arweave.wallets.getAddress(wallet);
  await arweave.api.get(`/mint/${walletaddress}/10000000000000000`);
}
