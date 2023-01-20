import React from 'react';
import Head from 'next/head';

import { withAuthSync } from '../../authentication/auth.utils';
import DashboardLayout from '../../containers/DashboardLayout/DashboardLayout';
import NotificationPage from '../../containers/NotificationPage';

export default withAuthSync(() => (
  <>
    <Head>
      <title>Notification</title>
    </Head>
    <DashboardLayout>
     <NotificationPage></NotificationPage>
    </DashboardLayout>
  </>
));
