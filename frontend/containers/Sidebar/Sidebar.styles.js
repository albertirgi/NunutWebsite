import styled from 'styled-components';
import { palette } from 'styled-theme';
import { transition, borderRadius } from '@iso/lib/helpers/style_utils';
import WithDirection from '@iso/lib/helpers/rtl';

const SidebarWrapper = styled.div`
  .isomorphicSidebar {
    z-index: 1000;
    background-color: #FAD14B;
    width: 280px;
    flex: 0 0 280px;

    .scrollarea {
      height: calc(100vh - 70px);
    }

    @media only screen and (max-width: 767px) {
      width: 240px !important;
      flex: 0 0 240px !important;
    }

    &.ant-layout-sider-collapsed {
      @media only screen and (max-width: 767px) {
        width: 0;
        min-width: 0 !important;
        max-width: 0 !important;
        flex: 0 0 0 !important;
      }
    }

    .isoLogoWrapper {
      height: 70px;
      background: rgba(0, 0, 0, 0.3);
      margin: 0;
      padding: 0 10px;
      text-align: center;
      overflow: hidden;
      ${borderRadius()};

      h3 {
        a {
          font-size: 21px;
          font-weight: 300;
          line-height: 70px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #000000;
          display: block;
          text-decoration: none;
        }
      }
    }

    &.ant-layout-sider-collapsed {
      .isoLogoWrapper {
        padding: 0;

        h3 {
          a {
            font-size: 27px;
            font-weight: 500;
            letter-spacing: 0;
          }
        }
      }
    }

    .isoDashboardMenu {
      padding-top: 35px;
      padding-bottom: 35px;
      background: transparent;

      a {
        text-decoration: none;
        font-weight: 400;
      }

      .ant-menu-item {
        width: 100%;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-align: center;
        align-items: center;
        /* padding: 0 24px; */
        margin: 0;
      }

      /* &.ant-menu-dark .ant-menu-item:hover .isoMenuHolder,
      &.ant-menu-dark .ant-menu-item-active .isoMenuHolder,
      &.ant-menu-dark .ant-menu-submenu-active .isoMenuHolder,
      &.ant-menu-dark .ant-menu-submenu-open .isoMenuHolder,
      &.ant-menu-dark .ant-menu-submenu-selected .isoMenuHolder,
      &.ant-menu-dark .ant-menu-submenu-title:hover .isoMenuHolder,
      &.ant-menu-dark .ant-menu-item-selected > a,
      &.ant-menu-dark .ant-menu-item-selected > span > a,
      &.ant-menu-dark .ant-menu-item-selected > a:hover,
      &.ant-menu-dark .ant-menu-item-selected > span > a:hover {
        color: #fff !important;
      } */

      .isoMenuHolder {
        display: flex;
        align-items: center;

        svg {
          color: #000000;
          margin: ${(props) =>
            props['data-rtl'] === 'rtl' ? '0 0 0 30px' : '0 30px 0 0'};
          ${transition()};
        }
      }

      .anticon {
        font-size: 18px;
        margin-right: 30px;
        color: #000000;
        ${transition()};
      }

      .nav-text {
        font-size: 14px;
        color: #000000;
        font-weight: 400;
        ${transition()};
      }

      .ant-menu-item-selected {
        background-color: rgba(0, 0, 0, 0.4) !important;
        .anticon {
          color: #000000;
        }

        svg {
          color: #000000;
        }

        .nav-text {
          color: #000000;
        }
      }

      > li {
        &:hover {
          svg,
          .nav-text {
            color: #000000;
          }
        }
      }
    }

    .ant-menu-dark .ant-menu-inline.ant-menu-sub {
      background: #000000;
    }

    .ant-menu-submenu-inline,
    .ant-menu-submenu-vertical {
      > .ant-menu-submenu-title {
        width: 100%;
        display: flex;
        align-items: center;
        /* padding: 0 24px; */

        > span {
          display: flex;
          align-items: center;
        }

        .ant-menu-submenu-arrow {
          left: ${(props) => (props['data-rtl'] === 'rtl' ? '25px' : 'auto')};
          right: ${(props) => (props['data-rtl'] === 'rtl' ? 'auto' : '25px')};

          &:before,
          &:after {
            width: 8px;
            ${transition()};
          }

          &:before {
            transform: rotate(-45deg) translateX(3px);
          }

          &:after {
            transform: rotate(45deg) translateX(-3px);
          }

          ${'' /* &:after {
            content: '\f123';
            font-family: 'Ionicons' !important;
            font-size: 16px;
            color: #000000;
            left: ${props => (props['data-rtl'] === 'rtl' ? '16px' : 'auto')};
            right: ${props => (props['data-rtl'] === 'rtl' ? 'auto' : '16px')};
            ${transition()};
          } */};
        }

        &:hover {
          .ant-menu-submenu-arrow {
            &:before,
            &:after {
              color: #ffffff;
            }
          }
        }
      }

      .ant-menu-inline,
      .ant-menu-submenu-vertical {
        > li:not(.ant-menu-item-group) {
          padding-left: ${(props) =>
            props['data-rtl'] === 'rtl' ? '0px !important' : '74px !important'};
          padding-right: ${(props) =>
            props['data-rtl'] === 'rtl' ? '74px !important' : '0px !important'};
          font-size: 13px;
          font-weight: 400;
          margin: 0;
          color: #000000;
          ${transition()};

          &:hover {
            a {
              color: #ffffff !important;
            }
          }
        }

        .ant-menu-item-group {
          padding-left: 0;

          .ant-menu-item-group-title {
            padding-left: 100px !important;
          }
          .ant-menu-item-group-list {
            .ant-menu-item {
              padding-left: 125px !important;
            }
          }
        }
      }

      .ant-menu-sub {
        box-shadow: none;
        background-color: transparent !important;
      }
    }

    &.ant-layout-sider-collapsed {
      .nav-text {
        display: none;
      }

      .ant-menu-submenu-inline > {
        .ant-menu-submenu-title:after {
          display: none;
        }
      }

      .ant-menu-submenu-vertical {
        > .ant-menu-submenu-title:after {
          display: none;
        }

        .ant-menu-sub {
          background-color: transparent !important;

          .ant-menu-item {
            height: 35px;
          }
        }
      }
    }
  }
`;

export default WithDirection(SidebarWrapper);
