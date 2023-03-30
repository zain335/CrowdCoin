import React, { Component } from "react";
import { Card, Button, Dimmer, Loader, Segment } from "semantic-ui-react";
import Layout from "../components/Layout";
import Link from "next/link";

import factory from "../ethereum/factory";

export default class CampaignIndex extends Component {
  state = {
    isLoading: true, // set the initial state of loading to true
  };

  static async getInitialProps(props) {
    const campaigns = await factory.methods.getDeployedCampaigns().call();
    return { campaigns };
  }

  componentDidMount() {
    this.setState({ isLoading: false }); // set isLoading to false once the campaigns have been fetched from the factory
  }

  renderCampaigns() {
    const items = this.props.campaigns.map((address) => {
      return {
        header: address,
        description: (<Link href={`/campaigns/${address}`} legacyBehavior><a>View Campaign</a></Link>),
        fluid: true,
      };
    });

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <div>
          {this.state.isLoading ? (
            <Segment>
              <Dimmer active inverted>
                <Loader size="large">Loading</Loader>
              </Dimmer>
            </Segment>
          ) : (
            <div>
              <h3>Open Campaigns</h3>

              <Link href="/campaigns/new">
                <Button
                  content="Create Campaign"
                  icon="add circle"
                  labelPosition="left"
                  primary
                  floated="right"
                />
              </Link>
              {this.renderCampaigns()}
            </div>
          )}
        </div>
      </Layout>
    );
  }
}
