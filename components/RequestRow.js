import React, { Component } from "react";
import { Table, Button } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import Campaign from "../ethereum/campaign";
import { withRouter } from "next/router";

export default withRouter(
  class RequestRow extends Component {
    onApprove = async () => {
      const accounts = await web3.eth.getAccounts();
      const campaign = Campaign(this.props.address);
      await campaign.methods.approveRequest(this.props.id).send({
        from: accounts[0],
      });

      this.props.router.replace(this.props.router.asPath);
    };
    onFinalize = async () => {
      const accounts = await web3.eth.getAccounts();
      const campaign = Campaign(this.props.address);
      await campaign.methods.finilizeRequest(this.props.id).send({
        from: accounts[0],
      });
      this.props.router.replace(this.props.router.asPath);
    };
    render() {
      const { id, request, approverCount } = this.props;
      const { Row, Cell } = Table;
      const readyToFinalize = request.approvalCount > approverCount / 2;
      return (
        <Row disabled={request.isComplete} positive={readyToFinalize && !request.isComplete}>
          <Cell>{id}</Cell>
          <Cell>{request.description}</Cell>
          <Cell>{web3.utils.fromWei(request.value, "ether")}</Cell>
          <Cell>{request.recipient}</Cell>
          <Cell>
            {request.approvalCount}/{approverCount}
          </Cell>
          <Cell>
            {request.isComplete ? <p className="items" >Approved</p> : (
              <Button
                color="green"
                basic
                content="Approve"
                onClick={this.onApprove}
              />
            )}
          </Cell>
          <Cell>
            <Button
              color="teal"
              basic
              content="Finalize"
              onClick={this.onFinalize}
            />
          </Cell>
        </Row>
      );
    }
  }
);
