import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { ListItem, ListItemLabel } from "baseui/list";
import { StyledLink } from "baseui/link";
import styles from "../styles/mainapp.module.css"

 const label =  "Sign up"
const href = "/create-applicant"

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>ORDUM</title>
      </Head>

      <div className={styles.DivHomeLog}> 
      <h2>Welcome to Ordum, Polkadot and Kusama Grant aggregator</h2>
          <button>DID</button>
          <button>
            <Link href={href} passHref>
              <StyledLink>{label}</StyledLink>
            </Link>
          </button>
        <h2>New to blockchain?</h2>
        <button>Create wallet</button>
      </div>
    </div>
  );
};

export default Home;