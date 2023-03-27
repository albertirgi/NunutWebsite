import React from 'react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import Input from '@iso/components/uielements/input';
import Checkbox from '@iso/components/uielements/checkbox';
import Button from '@iso/components/uielements/button';
import IntlMessages from '@iso/components/utility/intlMessages';
import jwtConfig from '@iso/config/jwt.config';
import FirebaseLogin from '@iso/containers/FirebaseForm/FirebaseForm';
import Auth0 from '../authentication/Auth0';
import authActions from '../authentication/actions';
import SignInStyleWrapper from '../styled/SignIn.styles';
import IconNunut from '@iso/assets/images/nunut/nunut-icon.png';
import LogoNunut from '@iso/assets/images/nunut/nunut-logo.png';
import Head from 'next/head';

const { login } = authActions;
export default function SignInPage(props) {
  const dispatch = useDispatch();
  const router = useRouter();
  const handleLogin = e => {
    e.preventDefault();
    localStorage.setItem(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJCbEw1d1pYcDh3TWtiU0twSUdYbEFuWllLTUozIiwidXNlckVtYWlsIjoic2FzdHJhZ2FudGVuZ0BnbWFpbC5jb20iLCJpYXQiOjE2Nzk4MjcwMzMsImV4cCI6MTcxMTM2MzAzM30.HY79ScmJCe-7hgOA2FjRUY1flHoPkTjePCt4AHUYQeE",
      "token"
    );
    dispatch(login(true));
  };

  const handleJWTLogin = () => {
    const { jwtLogin, history } = props;
    const userInfo = {
      username:
        (process.browser && document.getElementById('inputUserName').value) ||
        '',
      password:
        (process.browser && document.getElementById('inpuPassword').value) ||
        '',
    };
    localStorage.setItem(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJCbEw1d1pYcDh3TWtiU0twSUdYbEFuWllLTUozIiwidXNlckVtYWlsIjoic2FzdHJhZ2FudGVuZ0BnbWFpbC5jb20iLCJpYXQiOjE2Nzk4MjcwMzMsImV4cCI6MTcxMTM2MzAzM30.HY79ScmJCe-7hgOA2FjRUY1flHoPkTjePCt4AHUYQeE",
      "token"
    );
    // jwtLogin(history, userInfo);
  };

  return (
    
    <SignInStyleWrapper  className="isoSignInPage">
      
      <Head>
        <title>Login</title>
      </Head>
      <div className="isoLoginContentWrapper">
        <div className="isoLoginContent">
          <div className="isoLogoWrapper">
            {/* <Link href="/dashboard">
              <a>
                {/* <IntlMessages id="page.signInTitle" />
                
              </a>
            </Link> */}
            <img src={LogoNunut} alt="Nunut" height={140}/>
          </div>

          <div className="isoSignInForm">
            <div className="isoInputWrapper">
              <Input
                id="inputUserName"
                size="large"
                placeholder="Username"
                
                style={{borderRadius: '15px', border: '1px solid #efefef'}}
              />
            </div>

            <div className="isoInputWrapper">
              <Input
                id="inpuPassword"
                size="large"
                type="password"
                placeholder="Password"
                style={{borderRadius: '15px', border: '1px solid #efefef'}}
              />
            </div>

            <div className="isoInputWrapper isoCenter">
              
              <Button
                style={{
                  backgroundColor: '#FAD14B',
                  border:"1px solid #000000",
                  borderRadius: "5px",

                }}
                type="primary"
                onClick={jwtConfig.enabled ? handleJWTLogin : handleLogin}
              >
                <p style={{
                  color: '#000000',
                }}>Login</p>
              </Button>
            </div>

          </div>
        </div>
      </div>
    </SignInStyleWrapper>
  );
}
