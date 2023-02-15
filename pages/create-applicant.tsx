import { CertificateData, signCertificate } from "@phala/sdk";
import type { ApiPromise } from "@polkadot/api";
import { ContractPromise } from "@polkadot/api-contract";
import { Button } from "baseui/button";
import { ButtonGroup } from "baseui/button-group";
import { toaster } from "baseui/toast";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { default as accountAtom } from "../atoms/account";
import ContractLoader from "../components/ContractLoader";
import { getSigner } from "../lib/polkadotExtension";

// CSS
import styles from "../styles/mainapp.module.css";


const CreateApplicantProfile: Page = () => {
  const [account] = useAtom(accountAtom);
  const [certificateData, setCertificateData] = useState<CertificateData>();
  const [api, setApi] = useState<ApiPromise>();
  const [contract, setContract] = useState<ContractPromise>();
  const [applicantResult, setApplicantResult] = useState<any>();
  const [events, setEvents] = useState<any>();

  useEffect(() => () => {
      api?.disconnect();
    },
    [api]
  );

  useEffect(() => {
    setCertificateData(undefined);
  }, [account]);

  const onSignCertificate = async () => {
    if (account && api) {
      try {
        const signer = await getSigner(account);

        // Save certificate data to state, or anywhere else you want like local storage
        setCertificateData(
          await signCertificate({
            api,
            account,
            signer,
          })
        );
        toaster.positive("Certificate signed", {});
      } catch (err) {
        toaster.negative((err as Error).message, {});
      }
    }
  };

  const onQuery = async () => {
    if (!certificateData || !contract) return;
    const { output } = await contract.query.getApplicantProfile(certificateData as any, {});
   
    console.log(contract.tx);
    // eslint-disable-next-line no-console
    setApplicantResult(output.toHuman())
    console.log(output.toHuman());
    toaster.info(JSON.stringify(output?.toHuman()), {});
  };

  const onCommand = async () => {
    if (!contract || !account || !certificateData) return;
    const signer = await getSigner(account);

    const { gasRequired, storageDeposit } = await contract.query.createApplicantProfile(
      certificateData as any,
      {},
      "Mrisho",
      null,
      1,
      "Legions",
      null,
      []
    );
    console.log(storageDeposit);
    
    const options = {
      // value: 0,
      gasLimit: (gasRequired as any).refTime,
      storageDepositLimit: storageDeposit.isCharge
        ? storageDeposit.asCharge
        : null,
    };

    

    contract.tx
      .createApplicantProfile(options,
        "Mrisho",
        null,
        1,
        "Legions",
        null,
        []
      )
      .signAndSend(account.address, { signer }, ({isInBlock,isCompleted,events}) => {
        if (isInBlock) {
          toaster.positive("In Block", {});
        }
        if (isCompleted) {
          toaster.positive("Completed", {});
        }
        
      });
  };

  return contract ? (
    <main className={styles.HomePage}>
      
        <Button disabled={!account} onClick={onSignCertificate}>
          Sign In
        </Button>
        <Button disabled={!certificateData} onClick={onQuery}>
          View Profile
        </Button>
        <Button disabled={!account} onClick={onCommand}>
          Create Profile
        </Button>
            
            <div>
                <p>name: {applicantResult?.Ok.name}</p>
                <p>team size: {applicantResult?.Ok.teamSize}</p>
                <p>account Id: {applicantResult?.Ok.accountId}</p>
                <p>description: {applicantResult?.Ok.description}</p>
            </div>
            
            <div> 
              <h2>Register Team</h2>
            </div>
          
    </main>
  ) : (
    <ContractLoader
      name="ORDUM"
      onLoad={({ api, contract }) => {
        setApi(api);
        setContract(contract);
      }}
    />
  );
};

CreateApplicantProfile.title = "Create Applicant Profile";

export default CreateApplicantProfile;
