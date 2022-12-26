import Head from 'next/head';
import React from 'react';
import Link from 'next/link';
import ComproLayout from '../containers/ComproLayout/ComproLayout';
import { Row, Col } from "antd";
const { rowStyle, colStyle, gutter } = basicStyle;
import basicStyle from "@iso/assets/styles/constants";
import HomeLayoutHolder from '../styled/HomeHolder.style';
import apple from '@iso/assets/images/nunut/app.png';
import google from '@iso/assets/images/nunut/play.png';
export default () => (
    <>
        <Head>
            <title>Home</title>
        </Head>
        <ComproLayout identifier="home" content={
            <>
                <div>
                    <Row style={rowStyle} gutter={gutter} justify="center">
                        <Col md={24} sm={24} xs={24} style={colStyle}>
                            <h1 style={{
                                textAlign: "center",
                                fontSize: "80px",
                                fontWeight: "bold",
                                marginTop: "140px",
                                marginBottom: "0px",
                                color: "#FFFFFF"
                                
                            }}
                            className="title-home"
                            >
                                Masih sendiri?
                            </h1>
                        </Col>
                        
                    </Row>
                    <Row style={rowStyle} gutter={gutter} justify="center">
                        <Col md={24} sm={24} xs={24} style={colStyle}>
                            <p style={{
                                textAlign: "center",
                                fontSize: "20px",
                                fontWeight: "bold",
                                marginTop: "0px",
                                marginBottom: "100px",
                                color: "#FFFFFF"

                            }}
                            className="subtitle-home"
                            >
                                Bareng 
                                <span style={{
                                    color: "#FAD14B",
                                    fontWeight: "bold"
                                }}> NUNUT</span> 
                                , kamu ga akan pernah sendirian!
                            </p>
                        </Col>
                    </Row>
                </div>

            </>   
        }>
            <HomeLayoutHolder>
                <div className="content-home">

                </div>
                <div className="content-down">
                    <Row style={rowStyle} gutter={gutter} justify="center">
                        <Col md={24} sm={24} xs={24} style={colStyle}>
                            <h1 style={{
                                textAlign: "center",
                                fontSize: "80px",
                                fontWeight: "bold",
                                marginTop: "200px",
                                marginBottom: "0px",
                                color: "#FFFFFF"
                            }}>
                                Jadi, tunggu apa lagi?
                            </h1>
                        </Col>
                    </Row>
                    <Row style={rowStyle} gutter={gutter} justify="center">
                        <Col md={24} sm={24} xs={24} style={colStyle}>
                            <p style={{
                                textAlign: "center",
                                fontSize: "20px",
                                fontWeight: "bold",
                                marginTop: "0px",
                                //marginBottom: "100px",
                                color: "#FFFFFF"

                            }}>
                                Download NUNUT sekarang!
                            </p>
                        </Col>
                    </Row>
                    <Row style={{
                        ...rowStyle,
                        paddingBottom: "160px"
                    }} gutter={gutter} justify="center" align="middle">
                        <Col md={3} sm={3} xs={0} style={colStyle}>
                            
                        </Col>
                        <Col md={4} sm={4} xs={24} style={colStyle}>
                            <div style={{
                                backgroundColor: "#FFFFFF",
                                borderRadius: "50px",
                                height: "66px",
                                width: "100%",
                                textAlign: "center",
                                marginRight: "20px !important",
                                marginLeft: "20px !important",
                            }} className="directPage">
                                <Row style={{
                                    ...rowStyle,
                                    paddingTop: "8px",

                                }} gutter={gutter} justify="start" align="middle">
                                    <Col md={4} sm={4} xs={4} style={colStyle}>
                                       
                                    </Col>
                                    <Col md={5} sm={5} xs={5} style={colStyle}>
                                        <img src={apple} style={{
                                            height: "28px",
                                            marginRight: "10px"
                                        }}/>
                                    </Col>
                                    <Col md={11} sm={11} xs={11} style={{
                                        ...colStyle,
                                        textAlign: "left",
                                        paddingTop: "8px",


                                    }}>
                                        <h2 style={{
                                            fontSize: "20px",
                                            fontWeight: "bold",
                                            textAlign: "left",
                                            color: "#000000"

                                        }}>
                                            AppStore
                                        </h2>
                                    </Col>
                                    <Col md={4} sm={4} xs={4} style={colStyle}>
                                       
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                        <Col md={1} sm={1} xs={0} style={colStyle}>
                            
                        </Col>
                        <Col md={4} sm={4} xs={24} style={colStyle}>
                            <div style={{
                                backgroundColor: "#FFFFFF",
                                borderRadius: "50px",
                                height: "66px",
                                width: "100%",
                                textAlign: "center",
                                
                            }} className="directPage">
                                <Row style={{
                                    ...rowStyle,
                                    paddingTop: "8px",
                                    
                                }} gutter={gutter} justify="start" align="middle">
                                    <Col md={4} sm={4} xs={4} style={colStyle}>
                                       
                                    </Col>
                                    <Col md={5} sm={5} xs={5} style={colStyle}>
                                        <img src={google} style={{
                                            height: "28px",
                                            marginRight: "10px"
                                        }}/>
                                    </Col>
                                    <Col md={15} sm={15} xs={15} style={{
                                        ...colStyle,
                                        textAlign: "left",
                                        paddingTop: "8px",


                                    }}>
                                        <h2 style={{
                                            fontSize: "20px",
                                            fontWeight: "bold",
                                            textAlign: "left",
                                            color: "#000000"

                                        }}>
                                            Google Play
                                        </h2>
                                    </Col>
                                   
                                </Row>
                            </div>
                        </Col>
                        <Col md={4} sm={4} xs={0} style={colStyle}>
                            
                        </Col>
                    </Row>
                </div>
            </HomeLayoutHolder>
            
        </ComproLayout>

    </>
);