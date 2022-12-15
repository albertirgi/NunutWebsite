import React, { Component, useEffect, useState } from 'react';
import LayoutContentWrapper from '@iso/components/utility/layoutWrapper';
import LayoutContent from '@iso/components/utility/layoutContent';
import { Row, Col, Table, Button } from "antd";
import basicStyle from "@iso/assets/styles/constants";
import envConfig from '../env-config';
const { rowStyle, colStyle, gutter } = basicStyle;

export default function VoucherPage() {
  
  const columns = [
    {
      title: 'Id',
      dataIndex: 'id_voucher',
      key: 'id_voucher',
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Expired At',
      dataIndex: 'expired_at',
      key: 'expired_at',
    },
    {
      title: 'Minimum',
      dataIndex: 'minimum',
      key: 'minimum',
    },
    {
      title: 'Tnc',
      dataIndex: 'tnc',
      key: 'tnc',
    },
  
  ];
  const [DataRetrivied, setDataRetrivied] = useState();
  const apiUrlVoucher = `${envConfig.URL_API_REST}/voucher`;
  let voucherAll;
  function pullVoucher(){
    fetch(apiUrlVoucher)
      .then((respone) => respone.json())
      .then((responData) => {
        
        voucherAll = responData.data?.map(function (data) {
          return {
            key: data.id,
            id_voucher: data.id,
            title: data.title,
            code: data.code,
            expired_at: data.expiredAt,
            minimum: data.minimum,
            tnc: data.tnc,
          };
        });
        setDataRetrivied(voucherAll);
      });
  }
  useEffect(() => {
    
    pullVoucher();
  }, []);
  return (
    <LayoutContentWrapper >
      <LayoutContent style={{maxHeight:"100vh"}}>
          <Row style={rowStyle} gutter={gutter} justify="start">
              <Col md={20} sm={20} xs={20} style={colStyle}>
                <h1 style={{fontWeight:"bold", fontSize:"20px"}}>
                  Voucher
                </h1>
              </Col>
              <Col md={4} sm={4} xs={4} style={colStyle}>
                <Button>
                  Add Voucher
                </Button>
              </Col>
          </Row>
          <Row style={rowStyle} gutter={gutter} justify="start">
              <Col md={24} sm={24} xs={24} style={colStyle}>
                <Table dataSource={DataRetrivied} columns={columns} />
              </Col>
          </Row>   
      </LayoutContent>
      
    </LayoutContentWrapper>
  );
}
