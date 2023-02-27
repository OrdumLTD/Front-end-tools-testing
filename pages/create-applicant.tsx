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
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import { StyledLink } from "baseui/link";
import Link from "next/link";


// CSS
import styles from "../styles/mainapp.module.css";
import { Textarea } from "baseui/textarea";


const CreateApplicantProfile: Page = () => {
  const [account] = useAtom(accountAtom);
  const [certificateData, setCertificateData] = useState<CertificateData>();
  const [api, setApi] = useState<ApiPromise>();
  const [contract, setContract] = useState<ContractPromise>();
  const [applicantResult, setApplicantResult] = useState<any>();
  const [events, setEvents] = useState<any>();

  //form
  const [name, setName] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [ptype, setPtype] = useState<string>()
  const [mission, setMission] = useState<string>();
  const [size, setSize] = useState<string>();

  useEffect(() => () => {
      api?.disconnect();
    },
    [api]
  );

 /* useEffect(() => {
    setCertificateData(undefined);
  }, [account]);
*/
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



  const sizenum = size;
  const resize :number = +sizenum; 

  const onCommand = async () => {
    if (!contract || !account || !certificateData) return;
    const signer = await getSigner(account);

    const { gasRequired, storageDeposit } = await contract.query.createApplicantProfile(
      certificateData as any,
      {},
        name,
        null,
        resize,
        description,
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
        name,
        null,
        resize,
        description,
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

  const href = "/profile";
  const label = "Profile"
  return contract ? (
    <main className={styles.HomePage}>
        <button className={styles.button} disabled={!account} onClick={onSignCertificate}>
          Sign In
        </button>
        <button className={styles.btnlink}>
          <Link href={href} passHref>
              <StyledLink>{label}</StyledLink>
          </Link>
        </button>
       
      <div className={styles.FormDiv}>
        <div className={styles.createProf}>
          <h1>Sign Up</h1>
          <span>Create your profile</span>
        </div>
        <span>Are you an organisation or an individual</span>
        <div className={styles.Appl1}>
            <button className={styles.darkbtn}>Organization</button>
            <button className={styles.greybtn}>Individual</button>
        </div>
        <span>Are you an applicant or foundation</span>
        <div className={styles.Appl2}>
            <button className={styles.darkbtn}>Applicant</button>
            <button className={styles.greybtn}>Foundation</button>
        </div>
      
        <div className={styles.Form}>
        <FormControl label="Name">
          <Input
            placeholder="Ordum"
              overrides={{
                Input: {
                  style: {
                    fontFamily: "San Serif",
                    backgroundColor:"white",
                  },
                },
              }}
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          ></Input>
        </FormControl>

        <FormControl label="Description">
          <Textarea
            placeholder="Expect Chaos"
              overrides={{
                Input: {
                  style: {
                    fontFamily: "San Serif",
                    
                    backgroundColor:"white",
                    
                  },
                },
              }}
              value={description}
              onChange={(e) => setDescription(e.currentTarget.value)}
          ></Textarea>
          </FormControl>
          <FormControl label="Mission">
          <Textarea
            placeholder="Expect Chaos"
              overrides={{
                Input: {
                  style: {
                    fontFamily: "San Serif",
                    
                    backgroundColor:"white",
                    
                  },
                },
              }}
              value={mission}
              onChange={(e) => setMission(e.currentTarget.value)}
          ></Textarea>
          </FormControl>
          <FormControl label="Project Type">
          <Input
            placeholder="Public good"
              overrides={{
                Input: {
                  style: {
                    fontFamily: "San Serif",
                    
                    backgroundColor:"white",
                    
                  },
                },
              }}
              value={ptype}
              onChange={(e) => setPtype(e.currentTarget.value)}
          ></Input>
          </FormControl>
          <FormControl label="Team size">
          <Input
            placeholder="eg 2"
              overrides={{
                Input: {
                  style: {
                    fontFamily: "San Serif",
                    
                    backgroundColor:"white",
                    
                  },
                },
              }}
              value={size}
              onChange={(e) => setSize(e.currentTarget.value)}
          ></Input>
          </FormControl>
          <Button onClick={onCommand}>
          Create Profile
        </Button>
        </div>
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
