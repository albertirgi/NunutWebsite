import React from 'react';
import NavbarHolder from './navbar.styles';
import { Row, Col, Button } from "antd";
import basicStyle from "@iso/assets/styles/constants";
const { rowStyle, colStyle, gutter } = basicStyle;
import menuBurger from '@iso/assets/images/icon/menu-burger.svg';
export default function NavigationBar ({logo, data, backgroundImage, content}){
    const [onTap, setOnTap] = React.useState(false);
    const [navbarContent, setNavbarContent] = React.useState();

    function HandleNavbarContetnt(){
        let navbar;
        return navbar = <ul >
        {data.map((item =>(
            <li >
                <a className={item.status} href={item.link}>{item.name}</a>
            </li>
        )))}
        
        </ul>
    }
    return (
        <NavbarHolder>
            <div className="navbar" style={{
                backgroundImage: `url(${backgroundImage})`,
            }}>
                <Row align="middle" justify="center" className="desktop-nav">
                    <Col md={8} sm={8} xs={8} style={colStyle}>
                        <div className="logo">
                            <img src={logo} width={80}></img>
                        </div>
                    </Col>
                    <Col md={8} sm={8} xs={8} style={
                        {
                            ...colStyle,
                            
                        }
                    } className="nav-item" >
                        <nav className="nav" id="nav">
                            {HandleNavbarContetnt()}
                        </nav>
                    </Col>
                    <Col md={8} sm={8} xs={8} style={{
                        ...colStyle,
                        
                    }} className="nav-download">
                        {/* DownloadButton */}
                        <Button className="DownloadButton">
                            <a href="https://play.google.com/store/apps/details?id=com.nunut.app" target="_blank">
                                Download Now !
                            </a>
                        </Button>
                    </Col>
                </Row>
                <Row align="middle" justify="start" className="mobile-nav" style={{
                    ...rowStyle,
                    padding: "0px 20px",
                    display:"none"
                }}>
                    <Col md={2} sm={2} xs={2} style={colStyle}>
                        <div className="logo">
                            <img src={logo} width={60}></img>
                        </div>
                    </Col>
                    <Col md={20} sm={20} xs={20} style={colStyle}>
                        
                    </Col>
                    <Col md={2} sm={2} xs={2} style={colStyle}>
                        <div className="nav-toggle" onClick={() => setOnTap(!onTap)}>
                            <img src={menuBurger} width={30}></img>
                        </div>

                    </Col>
                   
                </Row>
                <Row align="middle" justify="center" className="mobile-nav-content" style={{
                    ...rowStyle,
                    padding: "0px 20px",
                    display: onTap ? "block" : "none"
                }}>
                    <Col md={24} sm={24} xs={24} style={colStyle}>
                        <nav className="nav-mobile" id="nav-mobile" >
                            {HandleNavbarContetnt()}
                        </nav>
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
