import React, { Component } from "react";
import { Form, Input, Message, Button } from "semantic-ui-react";
import Campaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";
import { withRouter } from "next/router";

export default withRouter(
  class ContributeForm extends Component {
    state = { value: "", isloading: false, errorMessage: "" };

    onSubmit = async (event) => {
      event.preventDefault();
      this.setState({ isloading: true });
      this.setState({ errorMessage: "" });
      const campaign = Campaign(this.props.address);
      try {
        const accounts = await web3.eth.getAccounts();

        await campaign.methods.contribute().send({
          from: accounts[0],
          value: web3.utils.toWei(this.state.value, "ether"),
        });
        this.setState({ isloading: false });
        this.setState({ value: "" });
        this.props.router.replace(this.props.router.asPath);
      } catch (error) {
        this.setState({ errorMessage: error.message });
        console.log(error.message)
        this.setState({ isloading: false });
      }
    };
    render() {
      return (
        <div>
          <h3>Contribute ot this campaign!</h3>
          <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
            <Form.Field>
              <label>Amount to Contribute</label>
              <Input
                label="ether"
                labelPosition="right"
                value={this.state.value}
                onChange={(event) =>
                  this.setState({ value: event.target.value })
                }
              />
            </Form.Field>
            <Message
              error
              header="Something went wrong"
              content={this.state.errorMessage}
            />
            <Button type="submit" primary loading={this.state.isloading}>
              Contribute!
            </Button>
          </Form>
        </div>
      );
    }
  }
);
