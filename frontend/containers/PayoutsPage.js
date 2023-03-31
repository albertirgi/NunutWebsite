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
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      align: 'center',
    },
    {
        title:'Status',
        dataIndex:'status',
        key:'status',
        align: 'center',
      },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      align: 'center',
    },
    {
      title: 'Method',
      dataIndex: 'method',
      key: 'method',
      align: 'center',
    },
    {
      title: 'Info Account',
      dataIndex: 'info',
      key: 'info',
      align: 'center',
    },
    {
        title:'Action',
        dataIndex:'action',
        key:'action',
        align: 'center',
    },
  ];

  export default function PayoutsPage() { 
    const [DataRetrivied, setDataRetrivied] = useState();
    const apiUrlPayout = `${envConfig.URL_API_REST}/payout`;
    let NotificationAll;

    const [isDataChanged, setIsDataChanged] = useState(false);

    const RejectPayout = (payout_id) => {
      const [reason, setReason] = useState(
        "Your payout request has been rejected"
      );
      function UpdatePayout(payout_id_data) {
        const apiUrlPayout = `${envConfig.URL_API_REST}payout/reject`;
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJCbEw1d1pYcDh3TWtiU0twSUdYbEFuWllLTUozIiwidXNlckVtYWlsIjoic2FzdHJhZ2FudGVuZ0BnbWFpbC5jb20iLCJpYXQiOjE2Nzk4MjcwMzMsImV4cCI6MTcxMTM2MzAzM30.HY79ScmJCe-7hgOA2FjRUY1flHoPkTjePCt4AHUYQeE`,
          },
          body: JSON.stringify({
            reference_no: payout_id_data,
            status: "rejected",
            reject_reason: reason,
          }),
        };
        fetch(apiUrlPayout, requestOptions)
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
        UpdatePayout(payout_id.payout_id);
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
            Decline Payout
          </Button>
          <DetailModal
            visible={stateAddMaps.visible}
            title="Add Detail Confirmation"
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
                  <h5 className="label-input">Reject Reason</h5>
                  <div className="isoInputWrapper">
                    <InputGroup size="large" style={{ marginBottom: "15px" }}>
                      <Input
                        placeholder="Reject Reason"
                        style={{ width: "100%" }}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
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

    const ConfirmPayout = (payout_id) => {
      function UpdatePayout(payout_id_data) {
        const apiUrlPayout = `${envConfig.URL_API_REST}payout/approve`;
        const formData = new FormData();
        formData.append("reference_no", payout_id_data);
        formData.append("status", "approved");
        formData.append("image", image);
        const requestOptions = {
          method: "POST",
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJCbEw1d1pYcDh3TWtiU0twSUdYbEFuWllLTUozIiwidXNlckVtYWlsIjoic2FzdHJhZ2FudGVuZ0BnbWFpbC5jb20iLCJpYXQiOjE2Nzk4MjcwMzMsImV4cCI6MTcxMTM2MzAzM30.HY79ScmJCe-7hgOA2FjRUY1flHoPkTjePCt4AHUYQeE`,
          },
          body: formData,
        };
        fetch(apiUrlPayout, requestOptions)
          .then((response) => response.json())
          .then((data) => {
            console.log("data", data);
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
        UpdatePayout(payout_id.payout_id);
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

      const [image, setImage] = useState();

      return (
        <div>
          <Button
            size="small"
            style={{
              backgroundColor: "none",
              border: "none",
              color: "#000000",
              backgroundColor: " #FAD14B",
              fontSize: "16px",
              padding: "8px 12px",
              height: "36px",
              borderRadius: "8px",
            }}
            onClick={() => {
              // Jalankan fungsi untuk confirm payout
              showModalDetailKR();
            }}
          >
            Confirm Payout
          </Button>
          <DetailModal
            visible={stateAddMaps.visible}
            title="Add Detail Confirmation"
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
                  <h5 className="label-input">Upload Transfer Receipt</h5>
                  <div className="isoInputWrapper">
                    <Input
                      type="file"
                      name="image"
                      onChange={(e) => {
                        setImage(e.target.files[0]);
                      }}
                    />
                  </div>
                </div>
              </Col>
            </Row>
          </DetailModal>
        </div>
      );
    };

    const NotificationConfirmDelete = (a) => {
      const key = `open${Date.now()}`;
      const btnClick = function () {
        notifications.close(key);
      };
      const btn = (
        <Row style={rowStyle} gutter={gutter} justify="start">
          <Col md={12} sm={12} xs={12} className="">
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
              onClick={btnClick}
            >
              Back
            </Button>
          </Col>
          <Col md={12} sm={12} xs={12} className="">
            <Button
              size="small"
              style={{
                backgroundColor: "#FAD14B",
                color: "#000000",
                fontSize: "16px",
                border: "none",
                borderRadius: "8px",
                padding: "8px 12px",
                height: "36px",
              }}
              onClick={() => {
                // DeleteNotification(a);
                if (isDataChanged == false) {
                  setIsDataChanged(true);
                }
                btnClick();
              }}
            >
              Delete
            </Button>
          </Col>
        </Row>
      );

      notifications.open({
        style: {
          borderRadius: "8px",
          backgroundColor: "#FFFFFF",
          color: "#000000",
        },
        message: (
          <div>
            <h3 style={{ fontWeight: "bold" }}>Delete Notification</h3>
          </div>
        ),
        description: (
          <NotificationContent>
            You will delete the data permanently. Are you sure?
          </NotificationContent>
        ),
        btn,
        closeIcon: <div></div>,
        key: key,
        duration: 1000,
      });
    };

    function pullPayoutRequest() {
      var number = 1;
      fetch(apiUrlPayout, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJCbEw1d1pYcDh3TWtiU0twSUdYbEFuWllLTUozIiwidXNlckVtYWlsIjoic2FzdHJhZ2FudGVuZ0BnbWFpbC5jb20iLCJpYXQiOjE2Nzk4MjcwMzMsImV4cCI6MTcxMTM2MzAzM30.HY79ScmJCe-7hgOA2FjRUY1flHoPkTjePCt4AHUYQeE`,
        },
      })
        .then((respone) => respone.json())
        .then((responData) => {
          NotificationAll = responData.data?.map(function (data) {
            return {
              payout_id: data?.order_id,
              // transaction_id: data?.transaction_id,
              no: number++,
              status: data?.status,
              amount: data?.amount,
              method: data?.method,
              info:
                data?.beneficiary?.bank +
                " / " +
                data?.beneficiary?.account +
                " (" +
                data?.beneficiary?.name +
                ")",
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
                    <ConfirmPayout payout_id={data?.order_id}></ConfirmPayout>
                  </Col>
                  <Col md={4} sm={4} xs={4} className="">
                    <RejectPayout payout_id={data?.order_id}></RejectPayout>
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
      pullPayoutRequest();
    }, [isDataChanged == true && DataRetrivied]);
    return (
      <LayoutContentWrapper>
        <LayoutContent>
          <Row style={rowStyle} gutter={gutter} justify="start">
            <Col md={20} sm={20} xs={20} style={colStyle}>
              <h1 style={{ fontWeight: "bold", fontSize: "20px" }}>Payouts</h1>
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