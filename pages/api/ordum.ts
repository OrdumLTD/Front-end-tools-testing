import { create, signCertificate } from "@phala/sdk";
import { Keyring } from "@polkadot/api";
import { ContractPromise } from "@polkadot/api-contract";
import { NextApiHandler } from "next";
import metadata from "../../lib/ordumtest.json";
import { createApi } from "../../lib/polkadotApi";

const endpoint = "wss://poc5.phala.network/ws";
const baseURL = "https://poc5.phala.network/tee-api-1";
const contractId =
  "0xccb694ea67dd03adf882d8386cf5293cbf7b8a30f899466132484b76c1a6f455";

const ordum: NextApiHandler = async (req, res) => {
  const api = await createApi(endpoint);
  const contract = new ContractPromise(
    (await create({ api, baseURL, contractId })).api,
    metadata,
    contractId
  );
  const keyring = new Keyring({ type: "sr25519" });
  const alice = keyring.addFromUri("//Alice");

  if (req.method === "GET") {
    const certificateData = await signCertificate({
      api,
      pair: alice,
    });

    const { output } = await contract.query.getTest(certificateData as any, {});
    await api.disconnect();
    return res.status(200).json(output?.toJSON());
  }

  if (req.method === "POST") {
    const hash = await contract.tx.testFn({}).signAndSend(alice);
    await api.disconnect();
    return res.status(200).json(hash);
  }
};

export default ordum;
