import React, { Component, useState } from 'react';
import LayoutContentWrapper from '@iso/components/utility/layoutWrapper';
import LayoutContent from '@iso/components/utility/layoutContent';
import { Row, Col } from "antd";
import basicStyle from "@iso/assets/styles/constants";
import { Layout } from 'antd';
import ComproLayoutHolder from './ComproLayout.styles';
import NavigationBar from '../../components/NavigationBar/navbar';
const { rowStyle, colStyle, gutter } = basicStyle;
const { Content, Footer } = Layout;
import nunutLogoPlain from '@iso/assets/images/nunut/nunut-logo-plain.png';

import homeBg from '@iso/assets/images/nunut/home-bg.png';
import aboutBg from '@iso/assets/images/nunut/about-bg.png';
import joinBg from '@iso/assets/images/nunut/join-bg.png';
import NunutFooter from '../../components/Footer/footer';


export default function ComproLayout ({children, identifier, content}){
    const [identifierNavbar, setIdentifierNavbar] = useState(identifier);
    const navbarData = () => {
        let items;
        switch(identifierNavbar){
            case 'home':
                items = [
                    {name: 'Home', link: '/', status: 'active'},
                    {name: 'About', link: '/about', status: ''},
                    {name: 'Join Us', link: '/join', status: ''},
                ]
                break;
            case 'about':
                items = [
                    {name: 'Home', link: '/', status: ''},
                    {name: 'About', link: '/about', status: 'active'},
                    {name: 'Join Us', link: '/join', status: ''},
                ]
                break;
            case 'join':
                items = [
                    {name: 'Home', link: '/', status: ''},
                    {name: 'About', link: '/about', status: ''},
                    {name: 'Join Us', link: '/join', status: 'active'},
                ]
                break;
            default:
                items = [
                    {name: 'Home', link: '/', status: 'active'},
                    {name: 'About', link: '/about', status: ''},
                    {name: 'Join Us', link: '/join', status: ''},
                ]
                break;
            }
        return items;
    }
    const Begron = () => {
        let bg;
        switch(identifierNavbar){
            case 'home':
                bg = homeBg;
                break;
            case 'about':
                bg = aboutBg;
                break;
            case 'join':
                bg = joinBg;
                break;
            default:
                bg = homeBg;
                break;
        }
        return bg;
    }
    return(
        <ComproLayoutHolder>
            <Layout style={{ height: '100vh'}}>
                <NavigationBar logo={nunutLogoPlain} data={navbarData()}  content={content} 
                backgroundImage={Begron()}/>
                {children}
                <NunutFooter></NunutFooter>
            </Layout>
        </ComproLayoutHolder>
    );
}