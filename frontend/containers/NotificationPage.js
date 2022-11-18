import React, { Component } from 'react';
import LayoutContentWrapper from '@iso/components/utility/layoutWrapper';
import LayoutContent from '@iso/components/utility/layoutContent';
import { Row, Col } from "antd";
import basicStyle from "@iso/assets/styles/constants";
const { rowStyle, colStyle, gutter } = basicStyle;

export default class extends Component {
  render() {
    return (
      <LayoutContentWrapper style={{ height: '100vh' }}>
        <Row style={rowStyle} gutter={gutter} justify="start">
            <Col md={12} sm={24} xs={24} style={colStyle}>
                <LayoutContent>
                </LayoutContent>
            </Col>
            <Col md={12} sm={24} xs={24} style={colStyle}>
                <LayoutContent>
                </LayoutContent>
            </Col>
        </Row>
      </LayoutContentWrapper>
    );
  }
}
