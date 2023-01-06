import React from 'react';
import Head from 'next/head';

import { withAuthSync } from '../../authentication/auth.utils';
import DashboardLayout from '../../containers/DashboardLayout/DashboardLayout';
import EmergencyPage from '../../containers/EmergencyPage';

export default withAuthSync(() => (
  <>
    <Head>
      <title>Emergency Report</title>
    </Head>
    <DashboardLayout>
      <EmergencyPage />
    </DashboardLayout>
  </>
));
