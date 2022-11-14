import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Layout } from 'antd';

import Sidebar from '../Sidebar/Sidebar';
import ThemeSwitcher from '@iso/containers/ThemeSwitcher/ThemeSwitcher';
import Topbar from '../Topbar/Topbar';
import siteConfig from '@iso/config/site.config';
import AppHolder from './DashboardLayout.styles';
import useWindowSize from '../../library/hooks/useWindowSize';
import appActions from '@iso/redux/app/actions';

const { Content, Footer } = Layout;
const { toggleAll } = appActions;

export default function DashboardLayout({ children }) {
  const dispatch = useDispatch();
  const appHeight = useSelector((state) => state.App.height);
  const { width, height } = useWindowSize();

  React.useEffect(() => {
    dispatch(toggleAll(width, height));
  }, [width, height, dispatch]);

  return (
    <AppHolder>
      <Layout style={{ height: '100vh' }}>
        <Topbar />

        <Layout style={{ flexDirection: 'row', overflowX: 'hidden' }}>
          <Sidebar />
          <Layout
            className="isoContentMainLayout"
            style={{
              height: appHeight,
            }}
          >
            <Content
              className="isomorphicContent"
              style={{
                padding: '70px 0 0',
                flexShrink: '0',
                background: '#f1f3f6',
                width: '100%',
              }}
            >
              {children}
            </Content>
            <Footer
              style={{
                background: '#ffffff',
                textAlign: 'center',
                borderTop: '1px solid #ededed',
              }}
            >
              {siteConfig.footerText}
            </Footer>
          </Layout>
        </Layout>
        <ThemeSwitcher />
      </Layout>
    </AppHolder>
  );
}
