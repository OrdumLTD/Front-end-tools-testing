import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { ListItem, ListItemLabel } from "baseui/list";
import { StyledLink } from "baseui/link";

const LINKS: [string, string][] = [
  ["/create-applicant", "Create Applicant Profile"],  
];

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>ORDUM</title>
      </Head>

      <ol>
        <p>hello</p>
        {LINKS.map(([href, label], index) => (
          <ListItem key={label} artwork={() => index + 1}>
            <ListItemLabel>
              <Link href={href} passHref>
                <StyledLink>{label}</StyledLink>
              </Link>
            </ListItemLabel>
          </ListItem>
        ))}
      </ol>
    </div>
  );
};

export default Home;