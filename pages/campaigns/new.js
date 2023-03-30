import React, { Component } from "react";
import Layout from "../../components/Layout";
import { Form, Button, Input, Message } from "semantic-ui-react";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import Router from "next/router";

export default class CampaignNew extends Component {

  state = {
    minimumContribution: "",
    errorMessage: "",
    isLoading: false,
  };

  onSubmit = async (event) => {
    event.preventDefault();

    
    this.setState({ isLoading: true });
    this.setState({ errorMessage: "" });
    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods
        .createCampaign(this.state.minimumContribution)
        .send({ from: accounts[0] });
      //   this.props.history.push(`/campaigns/${this.state.minimumContribution}`);
      Router.push('/');
      
    } catch (err) {
      this.setState({ errorMessage: err.message });
      this.setState({ isLoading: false });
    }
    this.setState({ isLoading: false });
  };

  render() {
    return (
      <div>
        <Layout>
          <h3>Create a Campaign</h3>
          <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
            <Form.Field>
              <label>Minimum Contribution</label>
              <Input
                label="wei"
                labelPosition="right"
                value={this.state.minimumContribution}
                onChange={(event) =>
                  this.setState({ minimumContribution: event.target.value })
                }
              />
            </Form.Field>

            {/* <Form.Field>
            <Checkbox label="I agree to the Terms and Conditions" />
          </Form.Field> */}
            <Message
              error
              header="Something went wrong"
              content={this.state.errorMessage}
            />
            <Button type="submit" primary loading={this.state.isLoading}>
              Create
            </Button>
          </Form>
        </Layout>
      </div>
    );
  }
}
