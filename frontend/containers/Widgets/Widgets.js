import React from 'react';
import clone from 'clone';
import { Row, Col } from 'antd';
import LayoutWrapper from '@iso/components/utility/layoutWrapper';
import basicStyle from '@iso/assets/styles/constants';
import IsoWidgetsWrapper from './WidgetsWrapper';
import IsoWidgetBox from './WidgetBox';
import CardWidget from './Card/CardWidget';
import ProgressWidget from './Progress/ProgressWidget';
import SingleProgressWidget from './Progress/ProgressSingle';
import ReportsWidget from './Report/ReportWidget';
import StickerWidget from './Sticker/StickerWidget';
import SaleWidget from './Sale/SaleWidget';
import VCardWidget from './vCard/vCardWidget';
import SocialWidget from './SocialWidget/SocialWidget';
import SocialProfile from './SocialWidget/SocialProfileIcon';
import userpic from '@iso/assets/images/user1.png';
import { isServer } from '@iso/lib/helpers/isServer';
import {
  TableViews,
  tableinfos,
  dataList,
} from '../Tables/AntTables/AntTables';
import * as rechartConfigs from '../Charts/Recharts/config';
import StackedAreaChart from '../Charts/Recharts/Charts/StackedAreaChart';
import GoogleChart from 'react-google-charts';
import * as googleChartConfigs from '../Charts/GoogleChart/config';
import IntlMessages from '@iso/components/utility/intlMessages';
import {
  StickerWidgetUnreadMailIcon,
  StickerWidgetImgUploadIcon,
  StickerWidgetMessageIcon,
  StickerWidgetOrderIcon,
  CardWidgetNewMsgIcon,
  CardWidgetVolumeIcon,
  CardWidgetAchievementIcon,
  ProgressDownloadIcon,
  ProgressPieChartIcon,
  ProgressUploadIcon,
  SocialFacebookIcon,
  SocialTwitterIcon,
  SocialGooglePlusIcon,
  SocialLinkedinIcon,
  SocialDribbbleIcon,
} from '@iso/config/icon.config';

const tableDataList = clone(dataList);
tableDataList.size = 5;
const styles = {
  wisgetPageStyle: {
    display: 'flex',
    flexFlow: 'row wrap',
    alignItems: 'flex-start',
    overflow: 'hidden',
  },
};
const SIGNLE_PROGRESS_WIDGET = [
  {
    label: 'widget.singleprogresswidget1.label',
    percent: 70,
    barHeight: 7,
    status: 'active',
    info: true,
  },
  {
    label: 'widget.singleprogresswidget2.label',
    percent: 80,
    barHeight: 7,
    status: 'active',
    info: true,
  },
  {
    label: 'widget.singleprogresswidget3.label',
    percent: 40,
    barHeight: 7,
    status: 'active',
    info: true,
  },
  {
    label: 'widget.singleprogresswidget4.label',
    percent: 60,
    barHeight: 7,
    status: 'active',
    info: true,
  },
];

const STICKER_WIDGET = [
  {
    number: 'widget.stickerwidget1.number',
    text: 'widget.stickerwidget1.text',
    icon: <StickerWidgetUnreadMailIcon size={30} color="#ffffff" />,
    fontColor: '#ffffff',
    bgColor: '#7266BA',
  },
  {
    number: 'widget.stickerwidget1.number',
    text: 'widget.stickerwidget2.text',
    icon: <StickerWidgetImgUploadIcon size={30} color="#ffffff" />,
    fontColor: '#ffffff',
    bgColor: '#42A5F6',
  },
  {
    number: 'widget.stickerwidget1.number',
    text: 'widget.stickerwidget3.text',
    icon: <StickerWidgetMessageIcon size={30} color="#ffffff" />,
    fontColor: '#ffffff',
    bgColor: '#7ED320',
  },
  {
    number: 'widget.stickerwidget1.number',
    text: 'widget.stickerwidget4.text',
    icon: <StickerWidgetOrderIcon size={30} color="#ffffff" />,
    fontColor: '#ffffff',
    bgColor: '#F75D81',
  },
];

const SALE_WIDGET = [
  {
    label: 'widget.salewidget1.label',
    price: 'widget.salewidget1.price',
    details: 'widget.salewidget1.details',
    fontColor: '#F75D81',
  },
  {
    label: 'widget.salewidget2.label',
    price: 'widget.salewidget2.price',
    details: 'widget.salewidget2.details',
    fontColor: '#F75D81',
  },
  {
    label: 'widget.salewidget3.label',
    price: 'widget.salewidget3.price',
    details: 'widget.salewidget3.details',
    fontColor: '#F75D81',
  },
  {
    label: 'widget.salewidget4.label',
    price: 'widget.salewidget4.price',
    details: 'widget.salewidget4.details',
    fontColor: '#F75D81',
  },
];

const CARD_WIDGET = [
  {
    icon: <CardWidgetNewMsgIcon size={36} color="#42A5F5" />,
    number: 'widget.cardwidget1.number',
    text: 'widget.cardwidget1.text',
  },
  {
    icon: <CardWidgetVolumeIcon size={36} color="#F75D81" />,
    number: 'widget.cardwidget2.number',
    text: 'widget.cardwidget2.text',
  },
  {
    icon: <CardWidgetAchievementIcon size={36} color="#FEAC01" />,
    number: 'widget.cardwidget3.number',
    text: 'widget.cardwidget3.text',
  },
];

const PROGRESS_WIDGET = [
  {
    label: 'widget.progresswidget1.label',
    details: 'widget.progresswidget1.details',
    icon: <ProgressDownloadIcon size={24} color="#4482FF" />,
    percent: 50,
    barHeight: 7,
    status: 'active',
  },
  {
    label: 'widget.progresswidget2.label',
    details: 'widget.progresswidget2.details',
    icon: <ProgressPieChartIcon size={24} color="#F75D81" />,
    percent: 80,
    barHeight: 7,
    status: 'active',
  },
  {
    label: 'widget.progresswidget3.label',
    details: 'widget.progresswidget3.details',
    icon: <ProgressUploadIcon size={24} color="#494982" />,
    percent: 65,
    barHeight: 7,
    status: 'active',
  },
];

const SOCIAL_PROFILE = [
  {
    url: '#',
    icon: <SocialFacebookIcon size={19} color="#3b5998" />,
  },
  {
    url: '#',
    icon: <SocialTwitterIcon size={19} color="#00aced" />,
  },
  {
    url: '#',
    icon: <SocialGooglePlusIcon size={19} color="#dd4b39" />,
  },
  {
    url: '#',
    icon: <SocialLinkedinIcon size={19} color="#007bb6" />,
  },
  {
    url: '#',
    icon: <SocialDribbbleIcon size={19} color="#ea4c89" />,
  },
];
export default function Widgets() {
  const { rowStyle, colStyle } = basicStyle;

  const chartEvents = [
    {
      eventName: 'select',
      callback(Chart) {},
    },
  ];

  const stackConfig = {
    ...rechartConfigs.StackedAreaChart,
    width: !isServer && window.innerWidth < 450 ? 300 : 500,
  };
  return (
    <LayoutWrapper>
      <div style={styles.wisgetPageStyle}>
        <Row style={rowStyle} gutter={0} justify="start">
          <Col lg={8} md={12} sm={24} xs={24} style={colStyle}>
            <IsoWidgetsWrapper>
              {/* Report Widget */}
              <ReportsWidget
                label={<IntlMessages id="widget.reportswidget.label" />}
                details={<IntlMessages id="widget.reportswidget.details" />}
              >
                {SIGNLE_PROGRESS_WIDGET.map((widget, idx) => (
                  <SingleProgressWidget
                    key={idx}
                    label={<IntlMessages id={widget.label} />}
                    percent={widget.percent}
                    barHeight={widget.barHeight}
                    status={widget.status}
                    info={widget.info} // Boolean: true, false
                  />
                ))}
              </ReportsWidget>
            </IsoWidgetsWrapper>
          </Col>

          <Col lg={16} md={12} sm={24} xs={24} style={colStyle}>
            <IsoWidgetsWrapper>
              <IsoWidgetBox>
                {/* TABLE */}
                <TableViews.SimpleView
                  tableInfo={tableinfos[0]}
                  dataList={tableDataList}
                />
              </IsoWidgetBox>
            </IsoWidgetsWrapper>
          </Col>
        </Row>

        <Row style={rowStyle} gutter={0} justify="start">
          {STICKER_WIDGET.map((widget, idx) => (
            <Col lg={6} md={12} sm={12} xs={24} style={colStyle} key={idx}>
              <IsoWidgetsWrapper>
                {/* Sticker Widget */}
                <StickerWidget
                  number={<IntlMessages id={widget.number} />}
                  text={<IntlMessages id={widget.text} />}
                  icon={widget.icon}
                  fontColor={widget.fontColor}
                  bgColor={widget.bgColor}
                />
              </IsoWidgetsWrapper>
            </Col>
          ))}
        </Row>

        <Row style={rowStyle} gutter={0} justify="start">
          {SALE_WIDGET.map((widget, idx) => (
            <Col lg={6} md={12} sm={12} xs={24} style={colStyle} key={idx}>
              <IsoWidgetsWrapper>
                {/* Sale Widget */}
                <SaleWidget
                  label={<IntlMessages id={widget.label} />}
                  price={<IntlMessages id={widget.price} />}
                  details={<IntlMessages id={widget.details} />}
                  fontColor={widget.fontColor}
                />
              </IsoWidgetsWrapper>
            </Col>
          ))}
        </Row>

        <Row style={rowStyle} gutter={0} justify="start">
          <Col lg={6} md={12} sm={12} xs={24} style={colStyle}>
            {CARD_WIDGET.map((widget, idx) => (
              <IsoWidgetsWrapper key={idx} gutterBottom={20}>
                {/* Card Widget */}
                <CardWidget
                  icon={widget.icon}
                  iconcolor={widget.iconcolor}
                  number={<IntlMessages id={widget.number} />}
                  text={<IntlMessages id={widget.text} />}
                />
              </IsoWidgetsWrapper>
            ))}
          </Col>

          <Col lg={6} md={12} sm={12} xs={24} style={colStyle}>
            {PROGRESS_WIDGET.map((widget, idx) => (
              <IsoWidgetsWrapper key={idx} gutterBottom={20}>
                {/* Progress Widget */}
                <ProgressWidget
                  label={<IntlMessages id={widget.label} />}
                  details={<IntlMessages id={widget.details} />}
                  icon={widget.icon}
                  iconcolor={widget.iconcolor}
                  percent={widget.percent}
                  barHeight={widget.barHeight}
                  status={widget.status}
                />
              </IsoWidgetsWrapper>
            ))}
          </Col>

          <Col lg={12} md={24} sm={24} xs={24} style={colStyle}>
            <IsoWidgetsWrapper>
              <IsoWidgetBox height={420} style={{ overflow: 'hidden' }}>
                <StackedAreaChart {...stackConfig} />
              </IsoWidgetBox>
            </IsoWidgetsWrapper>
          </Col>
        </Row>

        <Row style={rowStyle} gutter={0} justify="start">
          <Col md={12} sm={24} xs={24} style={colStyle}>
            <IsoWidgetsWrapper>
              <IsoWidgetBox height={470} style={{ overflow: 'hidden' }}>
                <GoogleChart
                  {...googleChartConfigs.BarChart}
                  chartEvents={chartEvents}
                />
              </IsoWidgetBox>
            </IsoWidgetsWrapper>
          </Col>

          <Col md={12} sm={24} xs={24} style={colStyle}>
            <IsoWidgetsWrapper>
              <IsoWidgetBox height={470} style={{ overflow: 'hidden' }}>
                <GoogleChart {...googleChartConfigs.Histogram} />
              </IsoWidgetBox>
            </IsoWidgetsWrapper>
          </Col>
        </Row>

        <Row style={rowStyle} gutter={0} justify="start">
          <Col lg={8} md={12} sm={12} xs={24} style={colStyle}>
            <IsoWidgetsWrapper>
              {/* VCard Widget */}
              <VCardWidget
                style={{ height: '450px' }}
                src={userpic}
                alt="Jhon"
                name={<IntlMessages id="widget.vcardwidget.name" />}
                title={<IntlMessages id="widget.vcardwidget.title" />}
                description={
                  <IntlMessages id="widget.vcardwidget.description" />
                }
              >
                <SocialWidget>
                  {SOCIAL_PROFILE.map((profile, idx) => (
                    <SocialProfile
                      key={idx}
                      url={profile.url}
                      icon={profile.icon}
                    />
                  ))}
                </SocialWidget>
              </VCardWidget>
            </IsoWidgetsWrapper>
          </Col>

          <Col lg={8} md={12} sm={12} xs={24} style={colStyle}>
            <IsoWidgetsWrapper>
              {/* Chart */}
              <IsoWidgetBox height={450} style={{ overflow: 'hidden' }}>
                <GoogleChart {...googleChartConfigs.TrendLines} />
              </IsoWidgetBox>
            </IsoWidgetsWrapper>
          </Col>

          <Col lg={8} md={24} sm={24} xs={24} style={colStyle}>
            <IsoWidgetsWrapper>
              <IsoWidgetBox height={450} style={{ overflow: 'hidden' }}>
                {/* Google Bar Chart */}
                <GoogleChart {...googleChartConfigs.ComboChart} />
              </IsoWidgetBox>
            </IsoWidgetsWrapper>
          </Col>
        </Row>
      </div>
    </LayoutWrapper>
  );
}
