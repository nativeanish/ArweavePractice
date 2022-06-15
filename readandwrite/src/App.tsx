import React, { useEffect, useState } from "react";
import Arweave from "arweave";
import { SmartWeaveWebFactory } from "redstone-smartweave";
import { JWKInterface } from "arweave/node/lib/wallet";
const contrac = "";
const give = async () => {
  const arweave = Arweave.init({
    host: "testnet.redstone.tools",
    port: 443,
    protocol: "https",
  });
  const smartweave = SmartWeaveWebFactory.memCachedBased(arweave)
    .useArweaveGateway()
    .build();
  return smartweave;
};
const show = async (set: (as: string) => void) => {
  const smartweave = await give();
  const def = smartweave.contract(contrac);
  const de = (await def.readState()).state;
  //@ts-ignore
  if (de && de.text) {
    //@ts-ignore
    set(de.text);
  }
};
const set = async (text: string, se: (text: string) => void) => {
  const arweave = Arweave.init({
    host: "testnet.redstone.tools",
    port: 443,
    protocol: "https",
  });
  const wallet = await arweave.wallets.generate();
  addFunds(arweave, wallet);
  const smartweave = SmartWeaveWebFactory.memCachedBased(arweave)
    .useArweaveGateway()
    .build();
  const contract = smartweave.contract(contrac).connect(wallet);
  await contract.writeInteraction({
    function: "set",
    text: text,
  });
  await mineBlock(arweave);
  const de = (await contract.readState()).state;
  //@ts-ignore
  if (de && de.text) {
    //@ts-ignore
    se(de.text);
  }
};
const App = () => {
  const [text, setText] = useState<string>("");
  useEffect(() => {
    show(setText)
      .then()
      .catch((err) => console.log(err));
  }, []);
  const submit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      text: { value: string };
    };
    if (target.text.value) {
      set(target.text.value, setText)
        .catch((e) => console.log(e))
        .then();
    }
  };
  return (
    <>
      {text ? <h1>{text}</h1> : <h1>Not Text State</h1>}
      <form onSubmit={submit}>
        <input type="text" name="text" />
        <button type="submit">Change</button>
      </form>
    </>
  );
};

async function addFunds(arweave: Arweave, wallet: JWKInterface) {
  const walletaddress = await arweave.wallets.getAddress(wallet);
  await arweave.api.get(`/mint/${walletaddress}/10000000000000000`);
}
async function mineBlock(arweave: Arweave) {
  await arweave.api.get("mine");
}
export default App;
