import Head from 'next/head';
import React from 'react';
import Link from 'next/link';
import IntlMessages from '@iso/components/utility/intlMessages';
import FourZeroFourStyleWrapper from '../styled/404.styles';
import Image from '@iso/assets/images/rob.png';
import nunutLogoPlain from '@iso/assets/images/nunut/nunut-logo-plain.png';

function FourZeroFour() {
  return (
    <FourZeroFourStyleWrapper className="iso404Page">
      <div className="iso404Content">
        <h1>
          <IntlMessages id="page404.title" />
        </h1>
        <h3>
          <IntlMessages id="page404.subTitle" />
        </h3>
        <p>
          <IntlMessages id="page404.description" />
        </p>
        <button type="button">
          <Link href="/home">
            <a className="isoMenuHolder">
              <span className="nav-text">
                <IntlMessages id="page404.backButton" style={{
                  color:"#FAD14B"
                }}/>
              </span>
            </a>
          </Link>
        </button>
      </div>

      <div className="iso404Artwork">
        <img alt="/home" src={nunutLogoPlain} height={200} />
      </div>
    </FourZeroFourStyleWrapper>
  );
}

export default () => (
  <>
    <Head>
      <title>404</title>
    </Head>
    <FourZeroFour />
  </>
);
