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
    //   title: 'Map Id',
    //   dataIndex: 'map_id',
    //   key: 'map_id',
    //   align: 'center',
    // },
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      align: 'center',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
        title:'Latitude',
        dataIndex:'latitude',
        key:'latitude',
        align: 'center',
      },
    {
      title: 'Longitude',
      dataIndex: 'longitude',
      key: 'longitude',
      align: 'center',
    },
    
    {
        title:'Action',
        dataIndex:'action',
        key:'action',
        align: 'center',
    },
  ];




export default function MapsPage() {
  const [isDataChanged, setIsDataChanged] = useState(false);
  const [DataRetrivied, setDataRetrivied] = useState();
  const apiMaps = `${envConfig.URL_API_REST}/map`;
  //console.log("Data : ", DataRetrivied);

   function DeleteDataMaps(id) {
    const token = localStorage.getItem("token");
     fetch(`${envConfig.URL_API_REST}/map/${id}`, {
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
  //NOTIF CONFIRM DELETE
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
              DeleteDataMaps(a);
              if(isDataChanged === false)
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
          <h3 style={{ fontWeight: "bold" }}>Delete Location</h3>
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

  const AddMapsModal = () => {
    function StoreMaps() {
        let data = {
            name: NamaLokasiController,
            latitude: LatitudeController,
            longitude: LongitudeController,
        };
        const token = localStorage.getItem("token");
        fetch(`${envConfig.URL_API_REST}/map`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        })
        .then((res) => res.json())
        .then((result) => {
        // if (result.statusCode == 401 && result.message == "Unauthorized") {
        // }
        // console.log("result : ", result);
        //setButtonAddMapsCount(ButtonAddMapsCount + 1);
        
        
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
        StoreMaps();
        // setButtonAddCounter(buttonAddCounter + 1);
        //setButtonAddMapsCount(ButtonAddMapsCount + 1);
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
    const [NamaLokasiController, setNamaLokasiController] = useState("");
    const [LatitudeController, setLatitudeController] = useState("");
    const [LongitudeController, setLongitudeController] = useState("");
    return (
        <div>
            <ButtonAntd type="primary" onClick={showModalDetailKR} style={{
              backgroundColor: "#FAD14B",
              borderColor: "#000000",
              marginBottom: "15px",
              color: "#000000",
              borderRadius: "8px",
            }}>
                Add Maps
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
                            <h5 className="label-input">Nama Lokasi</h5>
                            <div className="isoInputWrapper">
                                <InputGroup size="large" style={{ marginBottom: "15px" }}>
                                    <Input
                                        placeholder="Nama Lokasi"
                                        style={{ width: "100%" }}
                                        value={NamaLokasiController}
                                        onChange={(e) => setNamaLokasiController(e.target.value)}

                                    />
                                </InputGroup>
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row style={rowStyle} gutter={gutter} justify="start">
                    <Col md={12} sm={12} xs={12} style={colStyle}>
                        <div className="isoSignInForm">
                            <h5 className="label-input">Latitude</h5>
                            <div className="isoInputWrapper">
                              <InputGroup size="large" style={{ marginBottom: "15px" }}>
                                  <Input
                                      placeholder="Latitude"
                                      style={{ width: "100%" }}
                                      value={LatitudeController}
                                      onChange={(e) => setLatitudeController(e.target.value)}
                                  />
                              </InputGroup>
                            </div>
                        </div>
                        
                    </Col>
                    <Col md={12} sm={12} xs={12} style={colStyle}>
                        <div className="isoSignInForm">
                            <h5 className="label-input">Longitude</h5>
                            <div className="isoInputWrapper">
                                <InputGroup size="large" style={{ marginBottom: "15px" }}>
                                    <Input
                                        placeholder="Longitude"
                                        style={{ width: "100%" }}
                                        value={LongitudeController}
                                        onChange={(e) => setLongitudeController(e.target.value)}
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
  
  let MapsAll;
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(apiMaps,{
      method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
    })
      .then((respone) => respone.json())
      .then((responData) => {
        var number = 1;
        MapsAll = responData.data?.map(function (data) {
          return {
              key: data.map_id,
              //map_id: data.map_id,
              no : number++,
              name: data.name,
              longitude: data.longitude,
              latitude: data.latitude,
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
                    NotificationConfirmDelete(data.map_id);
                  }}
                >
                  Delete 
                </Button>

          };
        });
        setDataRetrivied(MapsAll);
      });
      if(isDataChanged == true){
        setIsDataChanged(false);
      }
  }, [isDataChanged == true && DataRetrivied]);



  return (
    <LayoutContentWrapper >
      <LayoutContent >
          <Row style={rowStyle} gutter={gutter} justify="start">
              <Col md={20} sm={20} xs={20} style={colStyle}>
                <h1 style={{fontWeight:"bold", fontSize:"20px"}}>
                  Maps
                </h1>
              </Col>
              <Col md={4} sm={4} xs={4} style={colStyle}>
                {/* <Button>
                  Add Maps
                </Button> */}
                <AddMapsModal />
                
              </Col>
          </Row>
          <Row style={rowStyle} gutter={gutter} justify="start">
              <Col md={24} sm={24} xs={24} style={colStyle}>
                <Table dataSource={DataRetrivied} columns={columns} pagination={false}/>
              
              </Col>
          </Row>   
      </LayoutContent>
    </LayoutContentWrapper>
  );
}