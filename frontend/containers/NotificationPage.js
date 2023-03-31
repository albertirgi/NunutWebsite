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
  Upload,
  message,
  Select
  } from "antd";
  import { Textarea, InputGroup } from "@iso/components/uielements/input";
import basicStyle from "@iso/assets/styles/constants";
import envConfig from '../env-config';
import DetailModals from "@iso/components/Feedback/Modal";
import DetailModalStyle from "@iso/containers/Feedback/Modal/Modal.styles";
import WithDirection from "@iso/lib/helpers/rtl";
import notifications from "@iso/components/Feedback/Notification";
import NotificationContent from "@iso/containers/Feedback/Notification/Notification.styles";
const isoDetailModal = DetailModalStyle(DetailModals);
const DetailModal = WithDirection(isoDetailModal);

const { rowStyle, colStyle, gutter } = basicStyle;


const columns = [
  // {
  //   title: 'Id',
  //   dataIndex: 'id_notif',
  //   key: 'id_notif',
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
    title: 'Image',
    dataIndex: 'image',
    key: 'image',
    align: 'center',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    align: 'center',
  },
  
  {
    title:'Action',
    dataIndex:'action',
    key:'action',
    align: 'center',
  },
];

function DeleteNotification(id) {
  const token = localStorage.getItem("token");
  fetch(`${envConfig.URL_API_REST}/notification/${id}`, {
  method: "DELETE",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
})
  .then((res) => res.json())
  .then((result) => {
    
  });
}




export default function NotificationPage() {
  
  const [DataRetrivied, setDataRetrivied] = useState();
  const apiUrlNotification = `${envConfig.URL_API_REST}/notification`;
  let NotificationAll;

  const [isDataChanged, setIsDataChanged] = useState(false);


  const NotificationConfirmDelete = (a) => {
    const key = `open${Date.now()}`;
    const btnClick = function () {
      notifications.close(key);
    };
    const btn = (
      <Row style={rowStyle} gutter={gutter} justify="start" >
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
              DeleteNotification(a);
              if(isDataChanged == false)
              {
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

  const AddNotifications = () => {
    function StoreNotification() {
        console.log("title", title);
        console.log("image", image);
        console.log("description", description);
        
        const formData = new FormData();
        formData.append("title", title);
        formData.append("image", image);
        formData.append("description", description);
        formData.append("isRead", isRead);
        formData.append("user_id", "");
        
        const token = localStorage.getItem("token");
        fetch(`${envConfig.URL_API_REST}notification`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
        })
        .then((res) => res.json())
        .then((result) => {
            console.log("result", result);
            console.log("formData", formData);
            setIsDataChanged(true);
        });
    } 
    const { rowStyle, colStyle, gutter } = basicStyle;
    //ModalKeyResultDetail
    const [stateAddMaps, setStateAddMaps] = React.useState({
      loading: false,
    });
    const showModalDetailKR = () => {
      setStateAddMaps({
        visible: true,
      });
    };
    const handleOkDetailKR = () => {
        StoreNotification();
        if(isDataChanged == false){
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
    const [title, setTitle] = useState("");
    const [image, setImage] = useState();
    const [description, setDescription] = useState("");
    const [isRead, setIsRead] = useState("false");
    return (
        <div>
            <ButtonAntd type="primary" onClick={showModalDetailKR} style={{
              backgroundColor: "#FAD14B",
              borderColor: "#000000",
              marginBottom: "15px",
              color: "#000000",
              borderRadius: "8px",
            }}>
                Add Notifications
            </ButtonAntd>
            <DetailModal

                visible={stateAddMaps.visible}
                title="Add Maps"
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
                            <h5 className="label-input">Judul Notifikasi</h5>
                            <div className="isoInputWrapper">
                                <InputGroup size="large" style={{ marginBottom: "15px" }}>
                                    <Input
                                        placeholder="Judul"
                                        style={{ width: "100%" }}
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}

                                    />
                                </InputGroup>
                            </div>
                        </div>
                    </Col>
                    <Col md={24} sm={24} xs={24} style={colStyle}>
                        <div className="isoSignInForm">
                            <h5 className="label-input">Upload Image Parking Place</h5>
                            <div className="isoInputWrapper">
                              
                              <Input type='file' name="image" onChange={(e) =>{
                                setImage(e.target.files[0]);
                              }} />
                            </div>
                        </div>
                    </Col>
                    <Col md={24} sm={24} xs={24} style={colStyle}>
                        <div className="isoSignInForm">
                            <h5 className="label-input">Deskripsi Notifikasi</h5>
                            <div className="isoInputWrapper">
                                <InputGroup size="large" style={{ marginBottom: "15px" }}>
                                    <Input
                                        placeholder="Deskripsi Notifikasi"
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
  }
  

  function pullNotification(){
    var number = 1;
    const token = localStorage.getItem("token");
    fetch(apiUrlNotification,{
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
            key: data.notification_id,
            //id_notif: data.notification_id,
            no : number++,
            title: data.title,
            image: <a href={data?.image.toString()} target="_blank">
              <Button>
                Click to Open
              </Button>
            </a>,
            description: data.description,
            action:
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
                    NotificationConfirmDelete(data.notification_id);
                  }}
                >
                  Delete
                </Button>

          };
        });
        setDataRetrivied(NotificationAll);
      });
      if(isDataChanged == true){
        setIsDataChanged(false);
      }
  }
  useEffect(() => {
    
    pullNotification();
  }, [isDataChanged == true && DataRetrivied ]);
  return (
    <LayoutContentWrapper style={{ height: '100vh' }}>
       <LayoutContent style={{maxHeight:"100vh"}}>
          <Row style={rowStyle} gutter={gutter} justify="start">
              <Col md={20} sm={20} xs={20} style={colStyle}>
                <h1 style={{fontWeight:"bold", fontSize:"20px"}}>
                  Notification
                </h1>
              </Col>
              <Col md={4} sm={4} xs={4} style={colStyle}>
                {/* <Button>
                  Add Notification
                </Button> */}
                <AddNotifications></AddNotifications>
              </Col>
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
