import React, { Component, useEffect, useState } from 'react';
import LayoutContentWrapper from '@iso/components/utility/layoutWrapper';
import LayoutContent from '@iso/components/utility/layoutContent';
import { Row, Col, Table, Button } from "antd";
import basicStyle from "@iso/assets/styles/constants";
import envConfig from '../env-config';
const { rowStyle, colStyle, gutter } = basicStyle;
const columns = [
  // {
  //   title: 'Id',
  //   dataIndex: 'id_report',
  //   key: 'id_report',
  //   align: 'center',
  // },
  {
    title: 'No',
    dataIndex: 'no',
    key: 'no',
    align: 'center',
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    align: 'center',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    align: 'center',
  },
  // {
  //   title:'Id Ride Share',
  //   dataIndex:'id_ride_share',
  //   key:'id_ride_share',
  //   align: 'center',
  // },
  {
    title:'Id User',
    dataIndex:'id_user',
    key:'id_user',
    align: 'center',
  },
  {
    title:'Action',
    dataIndex:'action',
    key:'action',
    align: 'center',
},

];


export default function EmergencyPage() {
  const [DataRetrivied, setDataRetrivied] = useState();
  const apiUrlReport = `${envConfig.URL_API_REST}/report?user`;
  let ReportAll;
  function pullReport(){
    var number = 1;
    fetch(apiUrlReport)
      .then((respone) => respone.json())
      .then((responData) => {
        ReportAll = responData.data?.map(function (data) {
          return {
            key: data.report_id,
            //id_report: data.report_id,
            no : number++,
            title: data.title,
            description: data.description,
            //id_ride_share:data.ride_request_id,
            id_user:data.user_id,
            action:[ <Row>
              <Col md={16} sm={16} xs={16} className="" align="center">
                <Button
                  size="small"
                  style={{
                    backgroundColor: "none",
                    border: "none",
                    color: "#000000",
                    backgroundColor: " #FAD14B",
                    fontSize: "16px",
                    padding: "8px 12px",
                    height: "36px",
                    borderRadius: "8px",
                  }}
                  onClick={() => {
                    
                  }}
                >
                  Feedback Report
                </Button>
              </Col>
              <Col md={4} sm={4} xs={4} className="" >
                <Button
                  size="small"
                  style={{
                    backgroundColor: "none",
                    border: "none",
                    color: "#FAD14B",
                    backgroundColor: "#000000",
                    fontSize: "16px",
                    padding: "8px 12px",
                    height: "36px",
                    borderRadius: "8px",
                  }}
                  onClick={() => {
                    
                  }}
                >
                  Decline Report
                </Button>
              </Col>
            </Row>
            ]

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
