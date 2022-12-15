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
    dataIndex: 'id_parkir',
    key: 'id_parkir',
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
    title: 'Subtitle',
    dataIndex: 'subtitle',
    key: 'subtitle',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  },
  

];

export default function ParkingPage() {
  const [DataRetrivied, setDataRetrivied] = useState();
  const apiUrlParking = `${envConfig.URL_API_REST}/parking-slot`;
  let ParkingAll;
  function pullParking(){
    fetch(apiUrlParking)
      .then((respone) => respone.json())
      .then((responData) => {
        ParkingAll = responData.data?.map(function (data) {
          return {
            key: data.id,
            id_parkir: data.id,
            title: data.title,
            picture: data.image,
            subtitle: data.subtitle,
            description: data.description,
          };
        });
        setDataRetrivied(ParkingAll);
      });
  }
  useEffect(() => {
    pullParking();
  }, []);
  
  return (
    <LayoutContentWrapper style={{ height: '100vh' }}>
      <LayoutContent style={{maxHeight:"100vh"}}>
          <Row style={rowStyle} gutter={gutter} justify="start">
              <Col md={20} sm={20} xs={20} style={colStyle}>
                <h1 style={{fontWeight:"bold", fontSize:"20px"}}>
                  Parking Spot
                </h1>
              </Col>
              <Col md={4} sm={4} xs={4} style={colStyle}>
                <Button>
                  Add Parking Spot
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
