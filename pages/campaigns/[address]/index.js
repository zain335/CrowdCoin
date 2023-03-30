import React, { Component } from "react";
import Layout from "../../../components/Layout";
import { withRouter } from "next/router";
import Campaign from "../../../ethereum/campaign";
import { Card, Grid, Button, GridRow } from "semantic-ui-react";
import web3 from "../../../ethereum/web3";
import ContributeForm from "../../../components/ContributeForm";
import Link from "next/link";

export default withRouter(
  class ShowCampaign extends Component {
    state = {
      address: "",
    };
    static async getInitialProps(props) {
      const campaign = Campaign(props.query.address);

      const summary = await campaign.methods.getSummary().call();

      return {
        address: props.query.address,
        balance: summary[0],
        minimumContribution: summary[1],
        reqCounter: summary[2],
        approverCount: summary[3],
        manager: summary[4],
      };
    }

    renderCards() {
      const {
        balance,
        manager,
        minimumContribution,
        reqCounter,
        approverCount,
      } = this.props;
      const items = [
        {
          header: manager,
          meta: "Address of Manager",
          description:
            "The Manager created this campaign and can create request to withdraw funds",
          style: { overflowWrap: "break-word" },
        },
        {
          header: minimumContribution,
          meta: "Minimum Contribution in wei",
          description: "You must contribute this much wei to become a approver",
          style: { overflowWrap: "break-word" },
        },
        {
          header: reqCounter,
          meta: "Number of requests",
          description: "A Request to widthdraw funds from the contract",
          style: { overflowWrap: "break-word" },
        },
        {
          header: approverCount,
          meta: "Number of approvers",
          description:
            "Number of people donated funds to this campaign and acting as approvers to process requests",
          style: { overflowWrap: "break-word" },
        },
        {
          header: web3.utils.fromWei(balance, "ether"),
          meta: "Campaigns Balance in ether",
          description: "Balance is how much funds this campaign lefts",
          style: { overflowWrap: "break-word" },
        },
      ];

      return <Card.Group items={items} />;
    }

    render() {
      return (
        <Layout>
          <h3>Campaign Details</h3>
          <Grid>
            <GridRow>
              <Grid.Column width={10}>{this.renderCards()}</Grid.Column>
              <Grid.Column width={6}>
                <ContributeForm address={this.props.address} />
              </Grid.Column>
            </GridRow>
            <Grid.Row>
              <Grid.Column>
                <Link href={`/campaigns/${this.props.address}/requests`}>
                  <Button primary>View Requests</Button>
                </Link>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Layout>
      );
    }
  }
);
