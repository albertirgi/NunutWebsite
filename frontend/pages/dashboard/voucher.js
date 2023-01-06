import React from 'react';
import Head from 'next/head';

import { withAuthSync } from '../../authentication/auth.utils';
import DashboardLayout from '../../containers/DashboardLayout/DashboardLayout';
import VoucherPage from '../../containers/VoucherPage';

export default withAuthSync(() => (
  <>
    <Head>
      <title>Voucher</title>
    </Head>
    <DashboardLayout>
     <VoucherPage></VoucherPage>
    </DashboardLayout>
  </>
));
