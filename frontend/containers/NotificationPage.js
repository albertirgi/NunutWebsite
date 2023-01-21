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
    dataIndex: 'id_notif',
    key: 'id_notif',
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'Picture',
    dataIndex: 'picture',
    key: 'picture',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  },
  
  {
    title:'Action',
    dataIndex:'action',
    key:'action',
},
];
export default function NotificationPage() {
  const [DataRetrivied, setDataRetrivied] = useState();
  const apiUrlNotification = `${envConfig.URL_API_REST}/notification`;
  let NotificationAll;
  function pullNotification(){
    fetch(apiUrlNotification)
      .then((respone) => respone.json())
      .then((responData) => {
        NotificationAll = responData.data?.map(function (data) {
          return {
            key: data.id,
            id_notif: data.id,
            title: data.title,
            picture:data.image,
            description: data.description,
            action:
                <a href="">
                    <Button>
                        Delete
                    </Button>

                </a>

          };
        });
        setDataRetrivied(NotificationAll);
      });
  }
  useEffect(() => {
    
    pullNotification();
  }, []);
  return (
    <LayoutContentWrapper style={{ height: '100vh' }}>
       <LayoutContent style={{maxHeight:"100vh"}}>
          <Row style={rowStyle} gutter={gutter} justify="start">
              <Col md={20} sm={20} xs={20} style={colStyle}>
                <h1 style={{fontWeight:"bold", fontSize:"20px"}}>
                  Notification
                </h1>
              </Col>
              <Col md={4} sm={4} xs={4} style={colStyle}>
                <Button>
                  Add Notification
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
