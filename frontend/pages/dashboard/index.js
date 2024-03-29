import React from 'react';
import Head from 'next/head';

import { withAuthSync } from '../../authentication/auth.utils';
import DashboardLayout from '../../containers/DashboardLayout/DashboardLayout';
import MapsPage from '../../containers/MapsPage';


export default withAuthSync(() => (
  <>
    <Head>
      <title>Maps</title>
    </Head>
    <DashboardLayout>
      <MapsPage />
    </DashboardLayout>
  </>
));
