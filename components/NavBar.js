import React from "react";
import { Menu } from "semantic-ui-react";
import Link from "next/link";

export const NavBar = () => {
  return (
    <Menu style={{ marginTop: "10px" }}>
      <Link href="/" legacyBehavior>
        <a className="item">CrowdCoin</a>
      </Link>
      <Menu.Menu position="right">
        <Link href={"/"} legacyBehavior>
          <a className="item">Campaign</a>
        </Link>
        <Link href={"/campaigns/new"} legacyBehavior>
          <a className="item">+</a>
        </Link>
      </Menu.Menu>
    </Menu>
  );
};
