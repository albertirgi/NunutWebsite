import React, { Component, useEffect, useState } from 'react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import Input from '@iso/components/uielements/input';
import Checkbox from '@iso/components/uielements/checkbox';
import Button from '@iso/components/uielements/button';
import IntlMessages from '@iso/components/utility/intlMessages';
import jwtConfig from '@iso/config/jwt.config';
import FirebaseLogin from '@iso/containers/FirebaseForm/FirebaseForm';
import Auth0 from '../../authentication/Auth0';
import authActions from '../../authentication/actions';
import SignInStyleWrapper from '../../styled/SignIn.styles';
import IconNunut from '@iso/assets/images/nunut/nunut-icon.png';
import LogoNunut from '@iso/assets/images/nunut/nunut-logo.png';
import Head from 'next/head';
import envConfig from '../../env-config';
import DetailModals from "@iso/components/Feedback/Modal";
import DetailModalStyle from "@iso/containers/Feedback/Modal/Modal.styles";
import WithDirection from "@iso/lib/helpers/rtl";
import {
  Button as ButtonAntd,
  Row,
  Col
} from "antd";
import basicStyle from "@iso/assets/styles/constants";
const isoDetailModal = DetailModalStyle(DetailModals);
const DetailModal = WithDirection(isoDetailModal);
const { login } = authActions;
const { rowStyle, colStyle, gutter } = basicStyle;
export default function SignInPage(props) {
  const dispatch = useDispatch();
  const router = useRouter();
  const handleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJCbEw1d1pYcDh3TWtiU0twSUdYbEFuWllLTUozIiwidXNlckVtYWlsIjoic2FzdHJhZ2FudGVuZ0BnbWFpbC5jb20iLCJpYXQiOjE2Nzk4MjcwMzMsImV4cCI6MTcxMTM2MzAzM30.HY79ScmJCe-7hgOA2FjRUY1flHoPkTjePCt4AHUYQeE",
      "token"
    );
    dispatch(login(true));
  };

  // const handleJWTLogin = () => {
  //   const { jwtLogin, history } = props;
  //   const userInfo = {
  //     username:
  //       (process.browser && document.getElementById('inputUserName').value) ||
  //       '',
  //     password:
  //       (process.browser && document.getElementById('inpuPassword').value) ||
  //       '',
  //   };
  //   // jwtLogin(history, userInfo);
  // };
  const [Email, setEmail] = React.useState("");
  const [Password, setPassword] = React.useState("");
  const [counterBtn, setCounterBtn] = React.useState(0);

  const apiLogin = `${envConfig.URL_API_REST}login`;

  //ModalKeyResultDetail
  const [stateAddMaps, setStateAddMaps] = React.useState({
    visible: false,
    message: "",
  });

  const showModalDetailKR = () => {
    setStateAddMaps({
      visible: true,
      loading: false,
      message: "Email or Password is wrong",
    });
  };

  const handleCancelDetailKR = () => {
    setStateAddMaps({ visible: false });
  };

  function Login(email, pass) {
    let data = {
      email: email,
      password: pass,
    };
    fetch(apiLogin, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status == 200) {
          localStorage.setItem("token", result.data.token);
          dispatch(login(true));
          // router.push("/dashboard");
        } else {
          showModalDetailKR();
        }
      });
  }
  return (
    <SignInStyleWrapper className="isoSignInPage">
      <Head>
        <title>Login</title>
      </Head>
      <DetailModal
        visible={stateAddMaps.visible}
        title="Error Occured"
        onOk={handleCancelDetailKR}
        onCancel={handleCancelDetailKR}
        width={400}
        footer={[
          <ButtonAntd key="back" onClick={handleCancelDetailKR}>
            Ok
          </ButtonAntd>,
        ]}
      >
        <Row style={rowStyle} gutter={gutter} justify="start">
          <Col md={24} sm={24} xs={24} style={colStyle}>
            <div className="isoSignInForm">
              <h4 className="label-input">{stateAddMaps.message}</h4>
            </div>
          </Col>
        </Row>
      </DetailModal>
      <div className="isoLoginContentWrapper">
        <div className="isoLoginContent">
          <div className="isoLogoWrapper">
            <img src={LogoNunut} alt="Nunut" height={140} />
          </div>

          <div className="isoSignInForm">
            <div className="isoInputWrapper">
              <Input
                id="inputUserName"
                size="large"
                placeholder="Username"
                style={{ borderRadius: "15px", border: "1px solid #efefef" }}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="isoInputWrapper">
              <Input
                id="inpuPassword"
                size="large"
                type="password"
                placeholder="Password"
                style={{ borderRadius: "15px", border: "1px solid #efefef" }}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="isoInputWrapper isoCenter">
              <Button
                style={{
                  backgroundColor: "#FAD14B",
                  border: "1px solid #000000",
                  borderRadius: "5px",
                }}
                type="primary"
                onClick={() => {
                  Login(Email, Password);
                  setCounterBtn(counterBtn + 1);
                }}
                //onClick={jwtConfig.enabled ? handleJWTLogin : handleLogin}
              >
                <p
                  style={{
                    color: "#000000",
                  }}
                >
                  Login
                </p>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SignInStyleWrapper>
  );
}