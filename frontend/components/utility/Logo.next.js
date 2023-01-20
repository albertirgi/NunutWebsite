import React from 'react';
import Link from 'next/link';
import siteConfig from '@iso/config/site.config';
import { IoIosFlash } from 'react-icons/io';
import IconNunut from '@iso/assets/images/nunut/nunut-icon.png';
import LogoNunut from '@iso/assets/images/nunut/nunut-logo.png';
import Image from "next/image";
export default function LogoNext({ collapsed }) {
  return (
    <div className="isoLogoWrapper">
      {collapsed ? (
        <div >
          <h3>
            <Link href="/dashboard">
              <a>
                {/* <IconNunut size={27} /> */}
                <img src={IconNunut} alt="Nunut" height={40}/>
              </a>
            </Link>
          </h3>
        </div>
      ) : (
        <div >
        <h3>
          <Link href="/dashboard">
            <a>
              {/* <IconNunut size={27} /> */}
              <img src={IconNunut} alt="Nunut" height={40}/>
            </a>
          </Link>
        </h3>
      </div>
      )}
    </div>
  );
}
