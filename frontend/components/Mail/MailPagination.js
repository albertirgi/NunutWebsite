import React from 'react';
import MailPagination from './MailPagination.style';
import { direction } from '@iso/lib/helpers/rtl';
import { ArrowRightIcon, ArrowLeftIcon } from '@iso/config/icon.config';

export default function MailPaginationComponent() {
  return (
    <MailPagination className="isoMailPagination">
      <button type="button" className="prevPage">
        {direction === 'rtl' ? (
          <ArrowRightIcon size={18} />
        ) : (
          <ArrowLeftIcon size={18} />
        )}
      </button>

      <button type="button" className="nextPage">
        {direction === 'rtl' ? (
          <ArrowLeftIcon size={18} />
        ) : (
          <ArrowRightIcon size={18} />
        )}
      </button>
    </MailPagination>
  );
}
