import React from 'react';
import Head from 'next/head';

import { withAuthSync } from '../../authentication/auth.utils';
import DashboardLayout from '../../containers/DashboardLayout/DashboardLayout';
import ListUserPage from '../../containers/ListUserPage';

export default withAuthSync(() => (
  <>
    <Head>
      <title>List User</title>
    </Head>
    <DashboardLayout>
      <ListUserPage></ListUserPage>
    </DashboardLayout>
  </>
));
