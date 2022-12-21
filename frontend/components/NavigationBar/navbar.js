import React from 'react';
import NavbarHolder from './navbar.styles';
import { Row, Col, Button } from "antd";
import basicStyle from "@iso/assets/styles/constants";
const { rowStyle, colStyle, gutter } = basicStyle;
const NavigationBar = ({logo, data, backgroundImage, content}) => {
  return (
    <NavbarHolder>
        <div className="navbar" style={{
            backgroundImage: `url(${backgroundImage})`,
        }}>
            <Row align="middle" justify="center">
                <Col md={8} sm={8} xs={8} style={colStyle}>
                    <div className="logo">
                        <img src={logo} width={80}></img>
                    </div>
                </Col>
                <Col md={8} sm={8} xs={8} style={colStyle} >
                    <nav className="nav" id="nav">
                        <ul >
                            {data.map((item =>(
                                <li >
                                    <a className={item.status} href={item.link}>{item.name}</a>
                                </li>
                            )))}
                            
                        </ul>
                    </nav>
                </Col>
                <Col md={8} sm={8} xs={8} style={colStyle}>
                    {/* DownloadButton */}
                    <Button className="DownloadButton">
                        <a href="https://play.google.com/store/apps/details?id=com.nunut.app" target="_blank">
                            Download Now !
                        </a>
                    </Button>
                </Col>
            </Row>
            <Row align="middle" justify="center">
                <Col md={24} sm={24} xs={24} style={colStyle}>
                    <div className="content">
                        {content}
                    </div>
                </Col>
            </Row>
        </div>
        
    </NavbarHolder>
  );
};

export default NavigationBar;