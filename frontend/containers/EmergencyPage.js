import React, { Component, useEffect, useState } from 'react';
import LayoutContentWrapper from '@iso/components/utility/layoutWrapper';
import LayoutContent from '@iso/components/utility/layoutContent';
import { Row, Col, Table, Button } from "antd";
import basicStyle from "@iso/assets/styles/constants";
import envConfig from '../env-config';
const { rowStyle, colStyle, gutter } = basicStyle;
const columns = [
  {
    title: 'Id',
    dataIndex: 'id_report',
    key: 'id_report',
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title:'Id Ride Share',
    dataIndex:'id_ride_share',
    key:'id_ride_share',
  },
  {
    title:'Id User',
    dataIndex:'id_user',
    key:'id_user',
  },
  

];


export default function EmergencyPage() {
  const [DataRetrivied, setDataRetrivied] = useState();
  const apiUrlReport = `${envConfig.URL_API_REST}/report`;
  let ReportAll;
  function pullReport(){
    fetch(apiUrlReport)
      .then((respone) => respone.json())
      .then((responData) => {
        ReportAll = responData.data?.map(function (data) {
          return {
            key: data.id,
            id_report: data.id,
            title: data.title,
            description: data.description,
            id_ride_share:data.ride_request,
            id_user:data.user,


          };
        });
        setDataRetrivied(ReportAll);
      });
  }
  useEffect(() => {
    
    pullReport();
  }, []);
  return (
    <LayoutContentWrapper style={{ height: '100vh' }}>
      <LayoutContent style={{maxHeight:"100vh"}}>
          <Row style={rowStyle} gutter={gutter} justify="start">
              <Col md={24} sm={24} xs={24} style={colStyle}>
                <h1 style={{fontWeight:"bold", fontSize:"20px"}}>
                  Report From User
                </h1>
              </Col>
              {/* <Col md={4} sm={4} xs={4} style={colStyle}>
                <Button>
                  Add Notification
                </Button>
                
              </Col> */}
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
