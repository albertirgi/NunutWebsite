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
    dataIndex: 'id_driver',
    key: 'id_driver',
  },
  {
    title:'Full Name',
    dataIndex:'full_name',
    key:'full_name',
  },
  {
    title: 'NIK',
    dataIndex: 'nik',
    key: 'nik',
  },
  {
    title: 'Phone Number',
    dataIndex: 'phone_number',
    key: 'phone_number',
  },
  {
    title:'Driver License',
    dataIndex:'driver_license',
    key:'driver_license',
  },
  {
    title:'Agreement',
    dataIndex:'agreement',
    key:'agreement',
  },
  {
    title:'Image',
    dataIndex:'image',
    key:'image',
  },
  
  

];

export default function ListDriverPage() {
  const [DataRetrivied, setDataRetrivied] = useState();
  const apiUrlDriver = `${envConfig.URL_API_REST}/driver?user`;
  let DriverAll;
  function pullDriver(){
    fetch(apiUrlDriver)
      .then((respone) => respone.json())
      .then((responData) => {
        DriverAll = responData.data?.map(function (data) {
          return {
            key: data.id,
            id_driver: data.id,
            full_name: data.fullname,
            nik:data.nik,
            phone_number: data.phone,
            driver_license:<a href={data.drivingLicense.toString()} target="_blank">
              <Button>
                Click to Open
              </Button>

            </a>,
            agreement:<a href={data.aggrementLetter.toString()} target="_blank">
            <Button>
              Click to Open
            </Button>

          </a>,
            image:<a href={data.image.toString()} target="_blank">
            <Button>
              Click to Open
            </Button>

          </a>,

          };
        });
        setDataRetrivied(DriverAll);
      });
  }
  useEffect(() => {
    
    pullDriver();
  }, []);
  return (
    <LayoutContentWrapper style={{ height: '100vh' }}>
      <LayoutContent style={{maxHeight:"100vh"}}>
          <Row style={rowStyle} gutter={gutter} justify="start">
              <Col md={24} sm={24} xs={24} style={colStyle}>
                <h1 style={{fontWeight:"bold", fontSize:"20px"}}>
                  Driver
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
