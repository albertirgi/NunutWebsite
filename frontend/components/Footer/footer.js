import React from 'react';
import { Row, Col, Button } from "antd";
import basicStyle from "@iso/assets/styles/constants";
import iconFb from '@iso/assets/images/nunut/iconFb.png';
import iconIg from '@iso/assets/images/nunut/iconIg.png';
import iconTw from '@iso/assets/images/nunut/iconTwitter.png';
import iconTt from '@iso/assets/images/nunut/iconTiktok.png';
import nunutLogoPlain from '@iso/assets/images/nunut/nunut-logo-plain.png';
import FooterHolder from './footer.styles';

const { rowStyle, colStyle, gutter } = basicStyle;

const NunutFooter = () => {
    return (
        <FooterHolder>
            <div className="footer">
                <Row style={{
                    ...rowStyle,
                    padding: "30px 60px",
                }} gutter={gutter} align="middle">
                    <Col md={3} sm={12} xs={24} style={colStyle}>
                        <div className="logo">
                            <img src={nunutLogoPlain} width={80}></img>
                        </div>
                    </Col>
                    <Col md={5} sm={12} xs={24} style={colStyle}>
                        <div className="contact">
                            <p>
                                <b>Main Office</b>
                            </p>
                            <p>
                            Jl. Siwalankerto No. 121-131, Siwalankerto, Kec. Wonocolo, Kota SBY, Jawa Timur 60236
                            </p>
                        </div>
                    </Col>
                    <Col md={3} sm={0} xs={0} style={colStyle}></Col>
                    <Col md={4} sm={12} xs={24} style={colStyle}>
                        <div className="contact">
                            <p>
                                <b>Customer Service</b>
                            </p>
                            <a href="https://wa.me/6285195000590" target="_blank">
                                <p>
                                    <b>Phone</b> : +62 851 9500 0590
                                </p>
                            </a>
                            <a href="mailto:info@ayonunut.com" target="_blank">
                                <p>
                                    <b>Email</b> : info@ayonunut.com
                                </p>
                            </a>
                        </div>
                    </Col>
                    <Col md={9} sm={12} xs={24} style={{textAlign:"left"}} >
                        <div className="contact" >
                            <p>
                                <b>Connect with us!</b>
                            </p>
                        </div>
                        <div className="socialMedia">
                            <a href="https://www.facebook.com/#" target="_blank">
                                <img src={iconFb} width={40} className="icon"></img>
                            </a>
                            <a href="https://www.instagram.com/#" target="_blank">
                                <img src={iconIg} width={40} className="icon"></img>
                            </a>
                            <a href="https://www.twitter.com/#" target="_blank">
                                <img src={iconTw} width={40} className="icon"></img>
                            </a>
                            <a href="https://www.tiktok.com/#" target="_blank">
                                <img src={iconTt} width={40} className="icon"></img>
                            </a>
                            
                        </div>
                    </Col>
                
                    
                </Row>
            </div>
        

    </FooterHolder>
    );
}

export default NunutFooter;