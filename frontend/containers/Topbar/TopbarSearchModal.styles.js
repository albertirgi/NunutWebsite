import Modal from '@iso/components/Feedback/Modal';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import WithDirection from '@iso/lib/helpers/rtl';

const TopbarSearchModal = styled(Modal)`
  &.ant-modal {
    top: 150px;
    padding-bottom: 0;
  }

  .ant-modal-close-x {
    width: 28px;
    height: 28px;
    line-height: 28px;
    display: none;
  }

  .ant-modal-content {
    overflow: hidden;
    border-radius: 5px;

    .ant-modal-header {
      display: none;
    }

    .ant-modal-body {
      padding: 0px;

      .isoSearchContainer {
        .ant-input-search {
          position: relative;
          border: 0;
          border-radius: 0;
          padding-left: ${(props) =>
            props['data-rtl'] === 'rtl' ? '15px' : '55px'};
          padding-right: ${(props) =>
            props['data-rtl'] === 'rtl' ? '55px' : '15px'};
          height: 60px;
          max-height: none;

          .ant-input-wrapper.ant-input-group {
            height: 100%;
            .ant-input-search-button {
              border: 0;
            }

            .ant-input-affix-wrapper {
              height: 100%;

              &.ant-input-affix-wrapper:focus,
              &.ant-input-affix-wrapper-focused {
                box-shadow: none !important;
                border: 0 !important;
              }
              .ant-input {
                font-size: 14px;
                border: 0;
                height: 100%;

                &:focus {
                  box-shadow: none;
                  outline: none;
                }

                &::-webkit-input-placeholder {
                  color: ${palette('grayscale', 0)};
                }

                &:-moz-placeholder {
                  color: ${palette('grayscale', 0)};
                }

                &::-moz-placeholder {
                  color: ${palette('grayscale', 0)};
                }
                &:-ms-input-placeholder {
                  color: ${palette('grayscale', 0)};
                }

                &:focus {
                  outline: 0;
                  box-shadow: none;
                }
              }
            }
          }

          .ant-input-prefix {
            right: ${(props) =>
              props['data-rtl'] === 'rtl' ? '20px' : 'auto'};
            left: ${(props) => (props['data-rtl'] === 'rtl' ? 'auto' : '20px')};
            height: 0;
            position: absolute;
            top: 50%;

            svg {
              color: ${palette('text', 2)};
            }
          }
        }

        .ant-input-suffix {
          .ant-input-search-icon {
            display: none;
          }
        }
      }
    }
  }
`;

export default WithDirection(TopbarSearchModal);
