import React, { Component, useEffect, useState } from 'react';
import LayoutContentWrapper from '@iso/components/utility/layoutWrapper';
import LayoutContent from '@iso/components/utility/layoutContent';
import {
  Button as ButtonAntd,
  Row,
  Col,
  DatePicker,
  Menu,
  Tooltip,
  InputNumber,
  Spin,
  Progress,
  Input,
  Table,
  Button,
  } from "antd";
import DetailModals from "@iso/components/Feedback/Modal";
import DetailModalStyle from "@iso/containers/Feedback/Modal/Modal.styles";
import basicStyle from "@iso/assets/styles/constants";
import WithDirection from "@iso/lib/helpers/rtl";
import envConfig from '../env-config';
import { Textarea, InputGroup } from "@iso/components/uielements/input";
//notification
import notifications from "@iso/components/Feedback/Notification";
import NotificationContent from "@iso/containers/Feedback/Notification/Notification.styles";
const isoDetailModal = DetailModalStyle(DetailModals);
const DetailModal = WithDirection(isoDetailModal);

  const { rowStyle, colStyle, gutter } = basicStyle;
  const columns = [
    // {
    //   title: 'Payout Id',
    //   dataIndex: 'payout_id',
    //   key: 'payout_id',
    // },
    // {
    //   title: 'Transaction Id',
    //   dataIndex: 'transaction_id',
    //   key: 'transaction_id',
    // },
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      align: "center",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      align: "center",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      align: "center",
    },
    {
      title: "Ride Request ID",
      dataIndex: "ride_request_id",
      key: "ride_request_id",
      align: "center",
    },
    {
      title: "User ID",
      dataIndex: "user_id",
      key: "user_id",
      align: "center",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      align: "center",
    },
  ];

  export default function FeedbackReportPage() { 
    const [DataRetrivied, setDataRetrivied] = useState();
    const apiUrlPayout = `${envConfig.URL_API_REST}/payout`;
    let NotificationAll;

    const [isDataChanged, setIsDataChanged] = useState(false);

    const SendFeedback = (report_id) => {
      const [title, setTitle] = useState("Report Title");
      const [description, setDescription] = useState("Report Description");
      function feedbackReport(report_id_data) {
        const apiUrlFeedback = `${envConfig.URL_API_REST}report/feedback/${report_id_data}`;
        const token = localStorage.getItem("token");
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: title,
            description: description,
          }),
        };
        fetch(apiUrlFeedback, requestOptions)
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            setIsDataChanged(true);
          });
      }

      //ModalKeyResultDetail
      const [stateAddMaps, setStateAddMaps] = React.useState({
        visible: false,
      });

      const showModalDetailKR = () => {
        setStateAddMaps({
          visible: true,
          loading: false,
        });
      };
      const handleOkDetailKR = () => {
        feedbackReport(report_id.report_id);
        if (isDataChanged == false) {
          setIsDataChanged(true);
        }

        setStateAddMaps({ loading: true });
        setTimeout(() => {
          setStateAddMaps({ loading: false, visible: false });
        }, 2000);
      };

      const handleCancelDetailKR = () => {
        setStateAddMaps({ visible: false });
      };

      return (
        <div>
          <Button
            size="small"
            style={{
              backgroundColor: "none",
              border: "none",
              color: "#FAD14B",
              backgroundColor: "#000000",
              fontSize: "16px",
              padding: "8px 12px",
              height: "36px",
              borderRadius: "8px",
            }}
            onClick={() => {
              showModalDetailKR();
            }}
          >
            Send Feedback
          </Button>
          <DetailModal
            visible={stateAddMaps.visible}
            title="Add Detail Feedback"
            onOk={handleOkDetailKR}
            onCancel={handleCancelDetailKR}
            width={400}
            footer={[
              <ButtonAntd key="back" onClick={handleCancelDetailKR}>
                Cancel
              </ButtonAntd>,
              <ButtonAntd
                key="submit"
                type="primary"
                loading={stateAddMaps.loading}
                onClick={handleOkDetailKR}
              >
                Submit
              </ButtonAntd>,
            ]}
          >
            <Row style={rowStyle} gutter={gutter} justify="start">
              <Col md={24} sm={24} xs={24} style={colStyle}>
                <div className="isoSignInForm">
                  <h5 className="label-input">Title</h5>
                  <div className="isoInputWrapper">
                    <InputGroup size="large" style={{ marginBottom: "15px" }}>
                      <Input
                        placeholder="Feedback Title"
                        style={{ width: "100%" }}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </InputGroup>
                  </div>
                  <h5 className="label-input">Description</h5>
                  <div className="isoInputWrapper">
                    <InputGroup size="large" style={{ marginBottom: "15px" }}>
                      <Input
                        placeholder="Feedback Description"
                        style={{ width: "100%" }}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </InputGroup>
                  </div>
                </div>
              </Col>
            </Row>
          </DetailModal>
        </div>
      );
    };

    function pullReportRequest() {
      var number = 1;
      const token = localStorage.getItem("token");
      const apiUrlReport = `${envConfig.URL_API_REST}/report`;
      fetch(apiUrlReport, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((respone) => respone.json())
        .then((responData) => {
          NotificationAll = responData.data?.map(function (data) {
            return {
              report_id: data?.report_id,
              // transaction_id: data?.transaction_id,
              no: number++,
              status: data?.status,
              user_id: data?.user_id,
              ride_request_id: data?.ride_request_id,
              title: data?.title,
              description: data?.description,
              action: [
                // <Button onClick={() => {
                //   NotificationConfirmDelete(data?.order_id);
                // }}>
                // Delete
                // </Button>,
                // <Button onClick={() => {
                //   NotificationConfirmDelete(data?.order_id);
                // }}>
                // Delete
                // </Button>
                <Row>
                  <Col md={16} sm={16} xs={16} className="" align="center">
                    <SendFeedback payout_id={data?.report_id}></SendFeedback>
                  </Col>
                </Row>,
              ],
            };
          });
          setDataRetrivied(NotificationAll);
        });
      if (isDataChanged == true) {
        setIsDataChanged(false);
      }
    }
    useEffect(() => {
      pullReportRequest();
    }, [isDataChanged == true && DataRetrivied]);
    return (
      <LayoutContentWrapper>
        <LayoutContent>
          <Row style={rowStyle} gutter={gutter} justify="start">
            <Col md={20} sm={20} xs={20} style={colStyle}>
              <h1 style={{ fontWeight: "bold", fontSize: "20px" }}>Reports</h1>
            </Col>
            <Col md={4} sm={4} xs={4} style={colStyle}></Col>
          </Row>
          <Row style={rowStyle} gutter={gutter} justify="start">
            <Col md={24} sm={24} xs={24} style={colStyle}>
              <Table
                dataSource={DataRetrivied}
                columns={columns}
                pagination={false}
              />
            </Col>
          </Row>
        </LayoutContent>
      </LayoutContentWrapper>
    );
  }