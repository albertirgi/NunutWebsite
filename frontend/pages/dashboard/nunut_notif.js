import React from 'react';
import Head from 'next/head';

import { withAuthSync } from '../../authentication/auth.utils';
import DashboardLayout from '../../containers/DashboardLayout/DashboardLayout';

export default withAuthSync(() => (
  <>
    <Head>
      <title>Notification</title>
    </Head>
    <DashboardLayout>
     
    </DashboardLayout>
  </>
));
