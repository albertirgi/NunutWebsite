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
import JoinLayoutHolder from '../styled/Join.styled';
import AboutLayoutHolder from '../styled/About.styled';

export default () => (
    <>
        <Head>
            <title>About Us</title>
        </Head>
        <ComproLayout identifier="about" content={
            <>
                <div>
                    <Row style={rowStyle} gutter={gutter} justify="center">
                        <Col md={24} sm={24} xs={24} style={colStyle}>
                            <h1 style={{
                                textAlign: "center",
                                fontSize: "80px",
                                fontWeight: "bold",
                                marginTop: "140px",
                                color: "#FFFFFF"
                            }}>
                               About Us
                            </h1>
                        </Col>
                        
                    </Row>
                   
                </div>

            </>   
        }>
            <AboutLayoutHolder>
                <div className="content-about">
                </div>
            </AboutLayoutHolder>
        </ComproLayout>
    </>
);