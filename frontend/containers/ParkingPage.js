import React, { Component, useEffect, useState } from 'react';
import LayoutContentWrapper from '@iso/components/utility/layoutWrapper';
import LayoutContent from '@iso/components/utility/layoutContent';
import { Row, Col, Table, Button } from "antd";
import basicStyle from "@iso/assets/styles/constants";
import envConfig from '../env-config';
const { rowStyle, colStyle, gutter } = basicStyle;


const columnsParkingplace = [
  {
    title: 'Id',
    dataIndex: 'id_parkir_place',
    key: 'id_parkir_place',
  },
  {
    title: 'Parking Place Name',
    dataIndex: 'parking_place_name',
    key: 'parking_place_name',
  },
  {
    title:'Action',
    dataIndex:'action',
    key:'action',
},
];

const columsParkingBuilding = [
  {
    title: 'Id',
    dataIndex: 'id_parkir_building',
    key: 'id_parkir_building',
  },
  {
    title: 'Parking Place Name',
    dataIndex: 'parking_place_name',
    key: 'parking_place_name',
  },
  {
    title: 'Parking Building Name',
    dataIndex: 'parking_building_name',
    key: 'parking_building_name',
  },
  {
    title:'Action',
    dataIndex:'action',
    key:'action',
},
];

const columns = [
  
  {
    title: 'Id',
    dataIndex: 'id_parkir',
    key: 'id_parkir',
  },
  {
    title: 'Parking Building',
    dataIndex: 'parking_building',
    key: 'parking_building',
    
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
  {
    title:'Action',
    dataIndex:'action',
    key:'action',
},

];

export default function ParkingPage() {
  const [DataRetrivied, setDataRetrivied] = useState();
  const [DataRetrivied2, setDataRetrivied2] = useState();
  const [DataRetrivied3, setDataRetrivied3] = useState();

  const apiUrlParkingplace = `${envConfig.URL_API_REST}/parking-place`;
  let ParkingplaceAll;

  const apiUrlParkingBuilding = `${envConfig.URL_API_REST}/parking-building?parking_place`;
  let ParkingBuildingAll;

  const apiUrlParking = `${envConfig.URL_API_REST}/parking-slot?parking_building`;
  let ParkingAll;

  

  function pullParkingplace(){
    fetch(apiUrlParkingplace)
      .then((respone) => respone.json())
      .then((responData) => {
        ParkingplaceAll = responData.data?.map(function (data) {
          return {
            key: data.parking_place_id,
            id_parkir_place: data.parking_place_id,
            parking_place_name: data.name,
            action:
                <a href="">
                    <Button>
                        Delete
                    </Button>

                </a>
          };
        });
        setDataRetrivied2(ParkingplaceAll);
      });
  }

  function pullParkingBuilding(){

    
    fetch(apiUrlParkingBuilding)
      .then((respone) => respone.json())
      .then((responData) => {
        ParkingBuildingAll = responData.data?.map(function (data) {
          return {
            key: data.parking_building_id,
            id_parkir_building: data.parking_building_id,
            parking_place_name: data.parking_place_id.name,
            parking_building_name: data.name,
            action:
                <a href="">
                    <Button>
                        Delete
                    </Button>

                </a>
            
          };
        });
        
        setDataRetrivied3(ParkingBuildingAll);
      });
    console.log("data nyoba api : " ,DataRetrivied3);
  }



  function pullParking(){
    fetch(apiUrlParking)
      .then((respone) => respone.json())
      .then((responData) => {
        ParkingAll = responData.data?.map(function (data) {
          return {
            key: data.parking_slot_id,
            id_parkir: data.parking_slot_id,
            parking_building: data.parking_building_id.name,
            title: data.title,
            picture: <a href={data.image.toString()} target="_blank">
              <Button>
                Click to Open
              </Button>
            </a>,
            subtitle: data.subtitle,
            description: data.instruction,
            action:
                <a href="">
                    <Button>
                        Delete
                    </Button>

                </a>
          };
        });
        setDataRetrivied(ParkingAll);
      });
  }

  
  
  useEffect(() => {
    pullParking();
    pullParkingBuilding();
    pullParkingplace();
  }, []);
  
  return (
    <LayoutContentWrapper style={{ minHeight: '100vh' }}>
      <LayoutContent style={{minHeight:"100vh"}}>
          <Row style={rowStyle} gutter={gutter} justify="start">
              <Col md={20} sm={20} xs={20} style={colStyle}>
                <h1 style={{fontWeight:"bold", fontSize:"20px"}}>
                  Parking Place
                </h1>
              </Col>
              <Col md={4} sm={4} xs={4} style={colStyle}>
                <Button>
                  Add Parking Place
                </Button>
                
              </Col>
          </Row>
          <Row style={rowStyle} gutter={gutter} justify="start">
              <Col md={24} sm={24} xs={24} style={colStyle}>
                <Table dataSource={DataRetrivied2} columns={columnsParkingplace} />
              
              </Col>
          </Row>
          <Row style={rowStyle} gutter={gutter} justify="start">
              <Col md={20} sm={20} xs={20} style={colStyle}>
                <h1 style={{fontWeight:"bold", fontSize:"20px"}}>
                  Parking Building
                </h1>
              </Col>
              <Col md={4} sm={4} xs={4} style={colStyle}>
                <Button>
                  Add Parking Building
                </Button>
                
              </Col>
          </Row>
          <Row style={rowStyle} gutter={gutter} justify="start">
              <Col md={24} sm={24} xs={24} style={colStyle}>
                <Table dataSource={DataRetrivied3} columns={columsParkingBuilding} />
              
              </Col>
          </Row>   
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
