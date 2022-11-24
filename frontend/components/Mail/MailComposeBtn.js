import React from 'react';
import IntlMessages from '../utility/intlMessages';
import MailComposeBtnWrapper from './MailComposeBtn.style';

export default function MailComposeBtn(props) {
  return (
    <MailComposeBtnWrapper className="isoComposeBtnWrapper">
      <button
        type="button"
        onClick={event => {
          props.changeComposeMail(true);
          if (props.onDrawerClose) {
            props.onDrawerClose();
          }
        }}
      >
        <IntlMessages id="email.compose" />
      </button>
    </MailComposeBtnWrapper>
  );
}
