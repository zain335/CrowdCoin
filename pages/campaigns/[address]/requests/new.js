import React, { Component } from "react";
import Layout from "../../../../components/Layout";
import { Form, Input, Message, Button } from "semantic-ui-react";
import web3 from "../../../../ethereum/web3";
import Campaign from "../../../../ethereum/campaign";
import { withRouter } from "next/router";
import Link from "next/link";

export default withRouter(
  class NewRequest extends Component {
    state = {
      errorMessage: "",
      isloading: false,
      value: "",
      description: "",
      recipient: "",
    };

    onSubmit = async (event) => {
      event.preventDefault();
      this.setState({ isloading: true });
      this.setState({ errorMessage: "" });

      const campaign = Campaign(this.props.router.query.address);
      const { description, value, recipient } = this.state;
      try {
        const accounts = await web3.eth.getAccounts();

        await campaign.methods
          .createRequest(
            description,
            web3.utils.toWei(value, "ether"),
            recipient
          )
          .send({
            from: accounts[0],
          });
        this.setState({ isloading: false });
        this.setState({ value: "" });
        this.setState({ description: "" });
        this.setState({ recipient: "" });
      } catch (error) {
        this.setState({ errorMessage: error.message });
        console.log(error.message);
        this.setState({ isloading: false });
      }
    };

    render() {
      return (
        <Layout>
            {/* <h1>{this.props.router.query.address}</h1> */}
          <Link href={`/campaigns/${this.props.router.query.address}/requests`}>
            <Button primary content="Back" icon="arrow circle left" labelPosition="left"/>
          </Link>
          <h3>Create a Request</h3>
          <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
            <Form.Field>
              <label>Description</label>
              <Input
                value={this.state.description}
                onChange={(event) =>
                  this.setState({ description: event.target.value })
                }
              />
            </Form.Field>
            <Form.Field>
              <label>Value in Ether</label>
              <Input
                label="ether"
                labelPosition="right"
                value={this.state.value}
                onChange={(event) =>
                  this.setState({ value: event.target.value })
                }
              />
            </Form.Field>
            <Form.Field>
              <label>Recipient</label>
              <Input
                label="address"
                labelPosition="left"
                value={this.state.recipient}
                onChange={(event) =>
                  this.setState({ recipient: event.target.value })
                }
              />
            </Form.Field>
            <Message
              error
              header="Something went wrong"
              content={this.state.errorMessage}
            />
            <Button type="submit" primary loading={this.state.isloading}>
              Create Request
            </Button>
          </Form>
        </Layout>
      );
    }
  }
);
