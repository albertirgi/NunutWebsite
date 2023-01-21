import React, { Component, useEffect, useState } from 'react';
import LayoutContentWrapper from '@iso/components/utility/layoutWrapper';
import LayoutContent from '@iso/components/utility/layoutContent';
import { Row, Col,Table, Button } from "antd";
import basicStyle from "@iso/assets/styles/constants";
import envConfig from '../env-config';
const { rowStyle, colStyle, gutter } = basicStyle;

const columns = [
  
  {
    title: 'Id',
    dataIndex: 'id_user',
    key: 'id_user',
  },
  {
    title: 'Full Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'NIK',
    dataIndex: 'nik',
    key: 'nik',
  },
  {
    title: 'Phone',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  
  },
  

];
const dataSource = [
  {
    key: '1',
    id_user: '1',
    name: 'John Brown',
    nik: '514514514',
    phone: '08123456789',
    email: 'email@gmail.com',
  },
  {
    key: '2',
    id_user: '2',
    name: 'Jim Green',
    nik: '514514514',
    phone: '08123456789',
    email: 'email@gmail.com',
  },
  {
    title:'Action',
    dataIndex:'action',
    key:'action',
},
];
export default function ListUserPage() {
  const [DataRetrivied, setDataRetrivied] = useState();
  const apiUrluser = `${envConfig.URL_API_REST}/user`;
  let userAll;
  function pulluser(){
    fetch(apiUrluser)
      .then((respone) => respone.json())
      .then((responData) => {
        console.log("responData",responData);
        userAll = responData.users?.map(function (data) {
          return {
            key: data.id,
            id_user: data.id,
            name: data.name,
            nik: data.nik,
            phone: data.phone,
            email: data.email,
            action:
                <a href="">
                    <Button>
                        Delete
                    </Button>

                </a>
          };
        });
        setDataRetrivied(userAll);
      });
  }
  useEffect(() => {
    pulluser();
  }, []);


  return (
    <LayoutContentWrapper style={{ height: '100vh' }}>
      <LayoutContent style={{maxHeight:"100vh"}}>
          <Row style={rowStyle} gutter={gutter} justify="start">
              <Col md={24} sm={24} xs={24} style={colStyle}>
                <h1 style={{fontWeight:"bold", fontSize:"20px"}}>
                  List User
                </h1>
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
