import React from 'react';
import Head from 'next/head';

import { withAuthSync } from '../../authentication/auth.utils';
import DashboardLayout from '../../containers/DashboardLayout/DashboardLayout';
import ListDriverPage from '../../containers/ListDriverPage';

export default withAuthSync(() => (
  <>
    <Head>
      <title>List Driver</title>
    </Head>
    <DashboardLayout>
     <ListDriverPage/>
    </DashboardLayout>
  </>
));
