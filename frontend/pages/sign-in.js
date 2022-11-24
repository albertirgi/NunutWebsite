import React from "react";
import Link from "next/link";
import Head from "next/head";
import { useDispatch } from "react-redux";

import { useRouter } from "next/router";
import Input from "@iso/components/uielements/input";
import Button from "@iso/components/uielements/button";
import jwtConfig from "@iso/config/jwt.config";
import Auth0 from "../authentication/Auth0";
import FirebaseLogin from "@iso/containers/FirebaseForm/FirebaseForm";
import authActions from "../authentication/actions";
import NewSignInLayoutWrapper from "../styled/NewSignIn.styles";

const { login } = authActions;
import logo from "@iso/assets/images/Logo.png";
import { Row, Col } from "antd";
import basicStyle from "@iso/assets/styles/constants";

export default function LoginPage(props) {
    const { rowStyle, colStyle, gutter } = basicStyle;
    const dispatch = useDispatch();
  
    const handleLogin = (e) => {
      e.preventDefault();
      dispatch(login(true));
    };
  
    const handleJWTLogin = () => {
      const { jwtLogin, history } = props;
      const userInfo = {
        username:
          (process.browser && document.getElementById("inputUserName").value) ||
          "",
        password:
          (process.browser && document.getElementById("inpuPassword").value) ||
          "",
      };
      // jwtLogin(history, userInfo);
    };
    return (
      <>
        <Head>
          <title>SIgn In </title>
        </Head>
        <NewSignInLayoutWrapper>
        <Row
          style={rowStyle}
          gutter={gutter}
          justify="start"
          className="website-version"
        >
          <Col md={12} sm={12} xs={24} className="LoginContent-left">
            <Row style={rowStyle} gutter={gutter} justify="start">
              
              <Col
                md={14}
                sm={14}
                xs={14}
                style={colStyle}
                className="extraCustomClass"
              >
                <div className="ContentContainer">
                  <div className="content">
                    <h2 className="Title">Welcome</h2>
                    <p className="subtitle">
                      Single Dashboard Bussiness Support
                    </p>
                  </div>
                </div>
              </Col>
              <Col
                md={4}
                sm={4}
                xs={4}
                style={colStyle}
                className="extraCustomClass"
              >
                <div className="ButtonContainer">
                  <Link href="/">
                    <h3 className="login-btn">Login</h3>
                  </Link>
                  <Link href="/sign-up">
                    <h3 className="signup-btn">Sign up</h3>
                  </Link>
                </div>
              </Col>
            </Row>
          </Col>
          <Col
            md={12}
            sm={12}
            xs={24}
            style={colStyle}
            className="extraCustomClass"
          >
            <div className="LoginForm">
              <div className="LoginForm-header">
                <h3 className="LoginForm-title">Stay Connected</h3>
                <p className="LoginForm-subtitle">Please Login</p>
              </div>
              <div className="logo">
                <img src={logo} alt="" className="" />
              </div>
              <div className="form-group">
                <div className="isoSignInForm">
                  <div className="isoInputWrapper">
                    <Input
                      id="inputUserName"
                      size="large"
                      placeholder="Username"
                      className="isoCustomInput"
                      textAlign="center"
                    />
                  </div>
                  <div className="isoInputWrapper">
                    <Input
                      id="inpuPassword"
                      size="large"
                      type="password"
                      placeholder="Password"
                      className="isoCustomInput"
                    />
                  </div>
                </div>
                <div className="inputWrapper otherLogin">
                  <Link href="/dashboard/overview">
                    <Button
                      className="btnLogin"
                      onClick={jwtConfig.enabled ? handleJWTLogin : handleLogin}
                    >
                      <p className="btn-text">Login</p>
                    </Button>
                  </Link>
                </div>
              </div>
              <h3 className="helperText">Need Help ?</h3>
              
            </div>
          </Col>
        </Row>
        </NewSignInLayoutWrapper>
      </>
    );
  }
  