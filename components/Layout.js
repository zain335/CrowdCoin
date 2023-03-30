import React from "react";
import { NavBar } from "./NavBar";
import { Container } from "semantic-ui-react";
import Head from "next/head";

export default (props) => {
  return (
    <Container>
      <Head>
        <link
          async
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css"
        />
      </Head>
      <NavBar />
      {props.children}
    </Container>
  );
};
