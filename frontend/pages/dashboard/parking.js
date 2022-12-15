import React from 'react';
import Head from 'next/head';

import { withAuthSync } from '../../authentication/auth.utils';
import DashboardLayout from '../../containers/DashboardLayout/DashboardLayout';
import ParkingPage from '../../containers/ParkingPage';

export default withAuthSync(() => (
  <>
    <Head>
      <title>Parking</title>
    </Head>
    <DashboardLayout>
     <ParkingPage></ParkingPage>
    </DashboardLayout>
  </>
));
