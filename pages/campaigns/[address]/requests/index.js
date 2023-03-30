import React, { Component } from "react";
import Layout from "../../../../components/Layout";
import { Button, Table } from "semantic-ui-react";
import Link from "next/link";
import { withRouter } from "next/router";
import Campaign from "../../../../ethereum/campaign";
import RequestRow from "../../../../components/RequestRow";

export default withRouter(
  class Requests extends Component {
    static async getInitialProps(props) {
      const campaign = Campaign(props.query.address);
      const totalRequests = await campaign.methods.getRequestCount().call();
      const approverCount = await campaign.methods.approverCount().call();
      const requests = await Promise.all(
        Array(parseInt(totalRequests))
          .fill()
          .map((element, index) => {
            return campaign.methods.requests(index).call();
          })
      );

      console.log(requests);
      return { requests, totalRequests, approverCount };
    }

    renderRows() {
      return this.props.requests.map((request, index) => {
        return (
          <RequestRow
            key={index}
            id={index}
            request={request}
            approverCount={this.props.approverCount}
            address={this.props.router.query.address}
          />
        );
      });
    }
    render() {
      const { Header, Row, HeaderCell, Body, Cell } = Table;
      return (
        <Layout>
          <h3>Requests</h3>
          <Link href={`${this.props.router.asPath}/new`}>
            <Button primary floated="right" style={{ marginBottom: "10px" }}>
              Create Request
            </Button>
          </Link>
          <Table>
            <Header>
              <Row>
                <HeaderCell>ID</HeaderCell>
                <HeaderCell>Description</HeaderCell>
                <HeaderCell>Ammount</HeaderCell>
                <HeaderCell>Recipient</HeaderCell>
                <HeaderCell>Approval Count</HeaderCell>
                <HeaderCell>Approve</HeaderCell>
                <HeaderCell>Finalize</HeaderCell>
              </Row>
            </Header>

            <Body>{this.renderRows()}</Body>
          </Table>

          <div>Found {this.props.totalRequests} requests</div>
        </Layout>
      );
    }
  }
);
