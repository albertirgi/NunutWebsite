import React from 'react';
import Popover from '../uielements/popover';
import Popconfirm from '../Feedback/Popconfirm';
import notification from '../Notification';
import { buckets } from './MailBuckets';
import { tags } from './MailTags';
import {
  SingleMailActions,
  MailActionsWrapper,
  MailCategoryWrapper,
  MailPaginationWrapper,
  MailActionDropdown,
} from './SingleMailActions.style';
import { direction } from '@iso/lib/helpers/rtl';
import {
  MailArchiveIcon,
  MailSpamReportIcon,
  MailDeleteIcon,
  MailFolderIcon,
  MailTagIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
} from '@iso/config/icon.config';

function DeleteButton() {
  return (
    <Popconfirm
      title={`Sure to delete This mail?`}
      okText="DELETE"
      cancelText="No"
      onConfirm={() => {
        notification('error', `Deleted selected mail`, '');
      }}
    >
      <button type="button" className="mailDelete">
        <MailDeleteIcon size={16} />
      </button>
    </Popconfirm>
  );
}

function MoveMailButton() {
  const bucketOptions = buckets.map((bucket) => (
    <li
      onClick={() => {
        notification('success', `Massage Moved Successfully`, '');
      }}
      key={bucket}
    >
      {bucket}
    </li>
  ));
  const content = <MailActionDropdown>{bucketOptions}</MailActionDropdown>;
  return (
    <Popover
      title={`Move mail`}
      content={content}
      overlayClassName="mailMoveDropdown"
    >
      <button type="button" className="mailArchive">
        <MailFolderIcon size={16} />
      </button>
    </Popover>
  );
}

function SelectTagButton() {
  const tagOptions = tags.map((tag) => (
    <li
      onClick={() => {
        notification('success', `Label Added`, '');
      }}
      key={tag}
    >
      {tag}
    </li>
  ));
  const content = <MailActionDropdown>{tagOptions}</MailActionDropdown>;
  return (
    <Popover
      title={`Select tag`}
      content={content}
      overlayClassName="mailMoveDropdown"
    >
      <button type="button" className="mailReport">
        <MailTagIcon size={16} />
      </button>
    </Popover>
  );
}

export default function SingleMailActionsComponent({ mail, filterMails, selectMail, toggleListVisible }) {
  const index = filterMails.findIndex(
    (filterMail) => filterMail.id === mail.id
  );
  const toggleView = () => {
    toggleListVisible();
  };
  return (
    <SingleMailActions className="isoMailActionsController">
      {toggleListVisible ? (
        <button className="mailBackBtn" onClick={toggleView}>
          Inbox
        </button>
      ) : (
        ''
      )}
      <MailActionsWrapper className="isoMailActions">
        <button
          type="button"
          className="mailArchive"
          onClick={() => {
            notification('success', 'this mail archived');
          }}
        >
          <MailArchiveIcon size={16} />
        </button>

        <button
          type="button"
          className="mailReport"
          onClick={() => {
            notification('success', 'Reported as spam');
          }}
        >
          <MailSpamReportIcon size={16} />
        </button>

        <DeleteButton />
      </MailActionsWrapper>

      <MailCategoryWrapper className="isoMailMove">
        <MoveMailButton />
        <SelectTagButton />
      </MailCategoryWrapper>

      <MailPaginationWrapper className="isoSingleMailPagination">
        {index === 0 ? (
          ''
        ) : (
          <button
            type="button"
            className="prevPage"
            onClick={() => selectMail(filterMails[index - 1].id)}
          >
            {direction === 'rtl' ? (
              <ArrowRightIcon size={18} />
            ) : (
              <ArrowLeftIcon size={18} />
            )}
          </button>
        )}

        {index + 1 === filterMails.length ? (
          ''
        ) : (
          <button
            type="button"
            className="nextPage"
            onClick={() => selectMail(filterMails[index + 1].id)}
          >
            {direction === 'rtl' ? (
              <ArrowLeftIcon size={18} />
            ) : (
              <ArrowRightIcon size={18} />
            )}
          </button>
        )}
      </MailPaginationWrapper>
    </SingleMailActions>
  );
}
