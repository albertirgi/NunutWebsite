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
  //   dataIndex: 'id_driver',
  //   key: 'id_driver',
  //   align: 'center',
  // },
  {
    title: 'No',
    dataIndex: 'no',
    key: 'no',
    align: 'center',
  },
  {
    title:'Full Name',
    dataIndex:'full_name',
    key:'full_name',
    align: 'center',
  },
  {
    title:'KTP',
    dataIndex:'KTP',
    key:'KTP',
    align: 'center',
  },
  {
    title:'Driving License',
    dataIndex:'driving_license',
    key:'driving_license',
    align: 'center',
  },
  {
    title:'Agreement Letter',
    dataIndex:'agreement_letter',
    key:'agreement_letter',
    align: 'center',
  },
  {
    title:'Driver Image',
    dataIndex:'driver_image',
    key:'driver_image',
    align: 'center',
  },
  {
    title:'Driver Status',
    dataIndex:'driver_status',
    key:'driver_status',
    align:'center',
    textAlign:'center',
  },
  {
    title:'Action',
    dataIndex:'action',
    key:'action',
    align: 'center',
  },
  

];

function getFileNameOnURL(url) {
  return url?.substring(url.lastIndexOf('/') + 1);
}

export default function ListDriverPage() {
  var number = 1;
  const token = localStorage.getItem("token");
  const [DataRetrivied, setDataRetrivied] = useState();
  const apiUrlDriver = `${envConfig.URL_API_REST}/driver?user`;
  let DriverAll;
  function pullDriver(){
    
    fetch(apiUrlDriver,{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((respone) => respone.json())
      .then((responData) => {
        DriverAll = responData.data?.map(function (data) {
          return {
            key: data.driver_id,
            // id_driver: data.driver_id,
            no : number++,
            full_name: data.name,
            KTP: <a href={"https://ayonunut.com/api/v1/file/" + getFileNameOnURL(data?.student_card.toString())} target="_blank">
              <Button> 
                Click to Open
              </Button>
            </a>,
            driving_license: <a href={"https://ayonunut.com/api/v1/file/" + getFileNameOnURL(data?.driving_license?.toString())} target="_blank">
              <Button>
                Click to Open
              </Button>
            </a>,
            agreement_letter:<a href={"https://ayonunut.com/api/v1/file/" + getFileNameOnURL(data?.agreement_letter?.toString())} target="_blank">
            <Button> 
              Click to Open
            </Button>
            </a>,
            driver_image:<a href={"https://ayonunut.com/api/v1/file/" + getFileNameOnURL(data?.driver_image?.toString())} target="_blank">
            <Button> 
              Click to Open
            </Button>
            </a>,
            driver_status: data.status,
            action: <Button onClick={
              () => {
                
              }
            }>
              Edit
            </Button>

          };
        });
        setDataRetrivied(DriverAll);
      });
  }
  useEffect(() => {
    
    pullDriver();
  }, []);
  return (
    <LayoutContentWrapper >
      <LayoutContent >
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
                <Table dataSource={DataRetrivied} columns={columns} pagination={false}/>
              
              </Col>
          </Row>   
      </LayoutContent>
    </LayoutContentWrapper>
  );
}
