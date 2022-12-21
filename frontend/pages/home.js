import Head from 'next/head';
import React from 'react';
import Link from 'next/link';
import ComproLayout from '../containers/ComproLayout/ComproLayout';
import { Row, Col } from "antd";
const { rowStyle, colStyle, gutter } = basicStyle;
import basicStyle from "@iso/assets/styles/constants";
export default () => (
    <>
        <Head>
            <title>Home</title>
        </Head>
        <ComproLayout identifier="home" content={
            <>
                <div>
                    <h1>
                        Home
                    </h1>
                </div>

            </>   
        }>
            
        </ComproLayout>
    </>
);