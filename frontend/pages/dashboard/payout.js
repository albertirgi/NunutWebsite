import React from 'react';
import Head from 'next/head';

import { withAuthSync } from '../../authentication/auth.utils';
import DashboardLayout from '../../containers/DashboardLayout/DashboardLayout';
import PayoutsPage from '../../containers/PayoutsPage';



export default withAuthSync(() => (
  <>
    <Head>
      <title>Payouts</title>
    </Head>
    <DashboardLayout>
     <PayoutsPage></PayoutsPage>
    </DashboardLayout>
  </>
));
