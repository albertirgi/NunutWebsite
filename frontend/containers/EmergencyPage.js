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
  Select
} from "antd";
import basicStyle from "@iso/assets/styles/constants";
import envConfig from '../env-config';
import DetailModals from "@iso/components/Feedback/Modal";
import DetailModalStyle from "@iso/containers/Feedback/Modal/Modal.styles";
import WithDirection from "@iso/lib/helpers/rtl";
import { Textarea, InputGroup } from "@iso/components/uielements/input";
//notification
import notifications from "@iso/components/Feedback/Notification";
import NotificationContent from "@iso/containers/Feedback/Notification/Notification.styles";
const isoDetailModal = DetailModalStyle(DetailModals);
const DetailModal = WithDirection(isoDetailModal);
const { rowStyle, colStyle, gutter } = basicStyle;
const columns = [
  // {
  //   title: 'Id',
  //   dataIndex: 'id_report',
  //   key: 'id_report',
  //   align: 'center',
  // },
  {
    title: 'No',
    dataIndex: 'no',
    key: 'no',
    align: 'center',
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    align: 'center',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    align: 'center',
  },
  // {
  //   title:'Id Ride Share',
  //   dataIndex:'id_ride_share',
  //   key:'id_ride_share',
  //   align: 'center',
  // },
  {
    title:'Id User',
    dataIndex:'id_user',
    key:'id_user',
    align: 'center',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    align: 'center',
  },
  {
    title:'Action',
    dataIndex:'action',
    key:'action',
    align: 'center',
},

];


export default function EmergencyPage() {
  const [DataRetrivied, setDataRetrivied] = useState();
  const apiUrlReport = `${envConfig.URL_API_REST}/report?user`;
  let ReportAll;
  const [isDataChanged, setIsDataChanged] = useState(false);

  const SendFeedback = (report_id) => {
    const [title, setTitle] = useState("Report Title");
    const [description, setDescription] = useState("Report Description");
    const [status, setStatus] = useState("ACCEPTED");
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
          status: status,
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
            color: "#000000",
            backgroundColor: " #FAD14B",
            fontSize: "16px",
            padding: "8px 12px",
            height: "36px",
            borderRadius: "8px",
          }}
          onClick={() => {
            showModalDetailKR();
          }}
        >
          Feedback Report
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
                <h5 className="label-input">Status</h5>
                <div className="isoInputWrapper">
                  <Select
                    defaultValue="ACCEPTED"
                    style={{ width: "100%" }}
                    onChange={(e) => setStatus(e)}
                    options={[
                      { value: "ACCEPTED", label: "Accept" },
                      { value: "DECLINED", label: "Decline" },
                    ]}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </DetailModal>
      </div>
    );
  };
  
  function pullReport(){
    var number = 1;
    const token = localStorage.getItem("token");
    fetch(apiUrlReport,{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((respone) => respone.json())
      .then((responData) => {
        ReportAll = responData.data?.map(function (data) {
          return {
            key: data.report_id,
            id_report: data.report_id,
            no : number++,
            title: data.title,
            description: data.description,
            //id_ride_share:data.ride_request_id,
            id_user:data.user_id.user_id,
            status: data.status,
            action:[ <Row>
              <Col md={16} sm={16} xs={16} className="" align="center">
                <SendFeedback report_id={data.report_id}></SendFeedback>
              </Col>
            </Row>
            ]

          };
        });
        setDataRetrivied(ReportAll);
      });
  }
  useEffect(() => {
    
    pullReport();
  }, []);
  return (
    <LayoutContentWrapper style={{ height: '100vh' }}>
      <LayoutContent style={{maxHeight:"100vh"}}>
          <Row style={rowStyle} gutter={gutter} justify="start">
              <Col md={24} sm={24} xs={24} style={colStyle}>
                <h1 style={{fontWeight:"bold", fontSize:"20px"}}>
                  Report From User
                </h1>
              </Col>
              {/* <Col md={4} sm={4} xs={4} style={colStyle}>
                <Button>
                  Add Notification
                </Button>
                
              </Col> */}
          </Row>
          <Row style={rowStyle} gutter={gutter} justify="start">
              <Col md={24} sm={24} xs={24} style={colStyle}>
                <Table dataSource={DataRetrivied} columns={columns} />
              
              </Col>
          </Row>   
      </LayoutContent>
    </LayoutContentWrapper>
  );
}
