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
  import DetailModals from "@iso/components/Feedback/Modal";
import DetailModalStyle from "@iso/containers/Feedback/Modal/Modal.styles";
import basicStyle from "@iso/assets/styles/constants";
import envConfig from '../env-config';
import WithDirection from "@iso/lib/helpers/rtl";
import { Textarea, InputGroup } from "@iso/components/uielements/input";
import notifications from "@iso/components/Feedback/Notification";
import NotificationContent from "@iso/containers/Feedback/Notification/Notification.styles";
import TextArea from 'antd/lib/input/TextArea';

const { rowStyle, colStyle, gutter } = basicStyle;
const isoDetailModal = DetailModalStyle(DetailModals);
const DetailModal = WithDirection(isoDetailModal);

const columnsParkingplace = [
  {
    title: 'Id',
    dataIndex: 'id_parkir_place',
    key: 'id_parkir_place',
  },
  {
    title: 'Parking Place Name',
    dataIndex: 'parking_place_name',
    key: 'parking_place_name',
  },
  {
    title: 'Parking Place Sub Name',
    dataIndex: 'parking_place_sub_name',
    key: 'parking_place_sub_name',
  },
  {
    title: 'Picture',
    dataIndex: 'picture',
    key: 'picture',
  },
  {
    title:'Action',
    dataIndex:'action',
    key:'action',
  },
];

const columsParkingBuilding = [
  {
    title: 'Id',
    dataIndex: 'id_parkir_building',
    key: 'id_parkir_building',
  },
  {
    title: 'Parking Place Name',
    dataIndex: 'parking_place_name',
    key: 'parking_place_name',
  },
  {
    title: 'Parking Building Name',
    dataIndex: 'parking_building_name',
    key: 'parking_building_name',
  },
  {
    title:'Action',
    dataIndex:'action',
    key:'action',
},
];

const columns = [
  
  {
    title: 'Id',
    dataIndex: 'id_parkir',
    key: 'id_parkir',
  },
  {
    title: 'Parking Building',
    dataIndex: 'parking_building',
    key: 'parking_building',
    
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'Picture',
    dataIndex: 'picture',
    key: 'picture',
  },
  {
    title: 'Subtitle',
    dataIndex: 'subtitle',
    key: 'subtitle',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title:'Action',
    dataIndex:'action',
    key:'action',
},

];

export default function ParkingPage() {
  const [DataRetrivied, setDataRetrivied] = useState();
  const [DataRetrivied2, setDataRetrivied2] = useState();
  const [DataRetrivied3, setDataRetrivied3] = useState();

  const [isDataChanged, setIsDataChanged] = useState(false);

  const apiUrlParkingplace = `${envConfig.URL_API_REST}/parking-place`;
  let ParkingplaceAll;

  const apiUrlParkingBuilding = `${envConfig.URL_API_REST}/parking-building?parking_place`;
  let ParkingBuildingAll;

  const apiUrlParking = `${envConfig.URL_API_REST}/parking-slot?parking_building`;
  let ParkingAll;

  const [OpsiParkingPlace, setOpsiParkingPlace] = useState();
  let OpsiParkingPlaceAll;

  const [OpsiParkingBuilding, setOpsiParkingBuilding] = useState();
  let OpsiParkingBuildingAll;


  //DELETE PARKING 
  function DeleteParkingPlace(id) {
    fetch(`${envConfig.URL_API_REST}/parking-place/${id}`, {
     method: "DELETE",
   })
     .then((res) => res.json())
     .then((result) => {
       
     });
  }

  function DeleteParkingBuilding(id) {
    fetch(`${envConfig.URL_API_REST}/parking-building/${id}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((result) => {
      
    });
  }
  function DeleteParkingSlot(id) {
    fetch(`${envConfig.URL_API_REST}/parking-slot/${id}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((result) => {
      
    });
  }

  //NOTIF CONFIRM DELETE PARKING
    //NOTIF CONFIRM DELETE PARKING PLACE
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
              DeleteParkingPlace(a);
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


  //confirm delete build
  const NotificationConfirmDeleteBuilding = (a) => {
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
              DeleteParkingBuilding(a);
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

  //confirm delete build
  const NotificationConfirmDeleteSlot = (a) => {
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
              DeleteParkingSlot(a);
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
  
  //GET DATA PARKING PLACE
  function pullParkingplace(){
    fetch(apiUrlParkingplace)
      .then((respone) => respone.json())
      .then((responData) => {
        ParkingplaceAll = responData.data?.map(function (data) {
          return {
            key: data?.parking_place_id,
            id_parkir_place: data?.parking_place_id,
            parking_place_name: data?.name,
            parking_place_sub_name: data?.sub_name,
            picture: <a href={data?.image.toString()} target="_blank">
              <Button> 
                Click to Open
              </Button>
            </a>,
            action:
              <Button onClick={
                () => {
                  NotificationConfirmDelete(data?.parking_place_id);
                }
              }>
                Delete
              </Button>
          };
        });
        OpsiParkingPlaceAll = responData.data?.map(function (data) {
          return <Option value={data?.parking_place_id} >{data?.name}</Option>;
        });
        setDataRetrivied2(ParkingplaceAll);
        setOpsiParkingPlace(OpsiParkingPlaceAll);
      });
      if(isDataChanged == true){
        setIsDataChanged(false);
      }
  }
  useEffect(() => {
    pullParkingplace();
  }, [isDataChanged == true && DataRetrivied2 ]);
  function pullParkingBuilding(){

    
    fetch(apiUrlParkingBuilding)
      .then((respone) => respone.json())
      .then((responData) => {
        ParkingBuildingAll = responData.data?.map(function (data) {
          return {
            key: data?.parking_building_id,
            id_parkir_building: data?.parking_building_id,
            parking_place_name: data?.parking_place_id?.name,
            parking_building_name: data?.name,
            action:
              <Button onClick={() => {
                NotificationConfirmDeleteBuilding(data?.parking_building_id);
              }}>
              Delete
              </Button>
            
          };
        });
        OpsiParkingBuildingAll = responData.data?.map(function (data) {
          return <Option value={data?.parking_building_id} >{data?.name}</Option>;
        });
        setOpsiParkingBuilding(OpsiParkingBuildingAll);
        setDataRetrivied3(ParkingBuildingAll);
      });
      if(isDataChanged == true){
        setIsDataChanged(false);
      }
    //console.log("data nyoba api : " ,DataRetrivied3);
  }
  useEffect(() => {
    pullParkingBuilding();
  }, [isDataChanged == true && DataRetrivied3 ]);
  function pullParking(){
    fetch(apiUrlParking)
      .then((respone) => respone.json())
      .then((responData) => {
        ParkingAll = responData.data?.map(function (data) {
          return {
            key: data?.parking_slot_id,
            id_parkir: data?.parking_slot_id,
            parking_building: data.parking_building_id?.name,
            title: data?.title,
            picture: <a href={data?.image.toString()} target="_blank">
              <Button>
                Click to Open
              </Button>
            </a>,
            subtitle: data?.subtitle,
            description: data?.instruction,
            action:
              <Button onClick={() => {
                NotificationConfirmDeleteSlot(data?.parking_slot_id);
              }}>
                Delete
              </Button>
          };
        });
        if(isDataChanged == true){
          setIsDataChanged(false);
        }
        setDataRetrivied(ParkingAll);
      });
  }
  useEffect(() => {
    pullParking();
  }, [isDataChanged == true && DataRetrivied ]);
  useEffect(() => {
    pullParking();
    pullParkingBuilding();
    pullParkingplace();
  }, []);


  //ADD PARKING PLACE MODAL
  const AddParkingPlaceModal = () => {
    function StoreParkingPlace() {
        const formData = new FormData();
        formData.append("name", NamaParkingPlaceController);
        formData.append("sub_name", SubNameParkingPlaceController);
        formData.append("image", fileList);
       
        fetch(`${envConfig.URL_API_REST}/parking-place`, {
            method: "POST",
            // headers: {
            // "Content-Type": "multipart/form-data",
            // },
            body: formData,
        })
        .then((res) => res.json())
        .then((result) => {
      
        setIsDataChanged(true);
        
        });
    } 
    const { rowStyle, colStyle, gutter } = basicStyle;

    const [StateParkingPlace, setStateParkingPlace] = React.useState({
      loading: false,
    });
    const showModalParkingPlace = () => {
      setStateParkingPlace({
        visible: true,
      });
    };
    const handleOkParkingPlace = () => {
        StoreParkingPlace();
        
        if(isDataChanged == false){
            setIsDataChanged(true);
        }

        setStateParkingPlace({ loading: true });
        setTimeout(() => {
            setStateParkingPlace({ loading: false, visible: false });
        }, 2000);
        
    };

    const handleCancelParkingPlace = () => {
        setStateParkingPlace({ visible: false });
        
    };
    const [NamaParkingPlaceController, setNamaParkingPlaceController] = useState("");
    const [SubNameParkingPlaceController, setSubNameParkingPlaceController] = useState("");
    const [fileList, setFileList] = useState();
    const [fileName, setFileName] = useState();


    
    return (
        <div>
            <ButtonAntd type="primary" onClick={showModalParkingPlace} style={{
              backgroundColor: "#FAD14B",
              borderColor: "#000000",
              marginBottom: "15px",
              color: "#000000",
              borderRadius: "8px",
            }}>
                Add Parking Place
            </ButtonAntd>
            <DetailModal

                visible={StateParkingPlace.visible}
                title="Add Parking Place"
                onOk={handleOkParkingPlace}
                onCancel={handleCancelParkingPlace}
                width={400}
                footer={[
                    <ButtonAntd key="back" onClick={handleCancelParkingPlace}>
                        Cancel
                    </ButtonAntd>,
                    <ButtonAntd
                        key="submit"
                        type="primary"
                        loading={StateParkingPlace.loading}
                        onClick={handleOkParkingPlace}
                    >
                        Submit
                    </ButtonAntd>,
                ]}
            >
                <Row style={rowStyle} gutter={gutter} justify="start">
                    <Col md={12} sm={12} xs={12} style={colStyle}>
                        <div className="isoSignInForm">
                            <h5 className="label-input">Name Parking Place</h5>
                            <div className="isoInputWrapper">
                                <InputGroup size="large" style={{ marginBottom: "15px" }}>
                                    <Input
                                        placeholder="Name Parking Place"
                                        style={{ width: "100%" }}
                                        value={NamaParkingPlaceController}
                                        onChange={(e) => setNamaParkingPlaceController(e.target.value)}

                                    />
                                </InputGroup>
                            </div>
                        </div>
                    </Col>
                    <Col md={12} sm={12} xs={12} style={colStyle}>
                        <div className="isoSignInForm">
                            <h5 className="label-input">Sub Name Parking Place</h5>
                            <div className="isoInputWrapper">
                                <InputGroup size="large" style={{ marginBottom: "15px" }}>
                                    <Input
                                        placeholder="Sub Name Parking Place"
                                        style={{ width: "100%" }}
                                        value={SubNameParkingPlaceController}
                                        onChange={(e) => setSubNameParkingPlaceController(e.target.value)}

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
                                setFileList(e.target.files[0]);
                                setFileName(e.target.files[0].name);
                              }} />
                            </div>
                        </div>
                    </Col>
                </Row>
                
            </DetailModal>
        </div>
    );
  }

  //ADD PARKING BUILDING
  const AddParkingBuildingModal = () => {

    function StoreParkingBuilding() {
      // const formData = new FormData();
      // formData.append("name", namaParkingBuildingController);
      // formData.append("parking_place_id", idParkingPlaceController);
      let data = {
        name: namaParkingBuildingController,
        parking_place_id: idParkingPlaceController,
      };
      fetch(`${envConfig.URL_API_REST}/parking-building`, {
         
          method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
          body: JSON.stringify(data),
      })
      .then((res) => res.json())
      .then((result) => {
        console.log("result : ", result);
        setIsDataChanged(true);
      
      });
    } 
    const { rowStyle, colStyle, gutter } = basicStyle;
    
    const [StateParkingBuildingModal, setStateParkingBuildingModal] = React.useState({
      loading: false,
    });
    const showModalParkingBuilding = () => {
      setStateParkingBuildingModal({
        visible: true,
      });
    };
    const handleOkParkingBuilding = () => {
      StoreParkingBuilding();
        if(isDataChanged == false){
            setIsDataChanged(true);
        }

        setStateParkingBuildingModal({ loading: true });
        setTimeout(() => {
            setStateParkingBuildingModal({ loading: false, visible: false });
        }, 2000);
        
    };

    const handleCancelParkingBuilding = () => {
        setStateParkingBuildingModal({ visible: false });
        
    };
    const [namaParkingBuildingController, setNamaParkingBuildingController] = React.useState("");
    const [idParkingPlaceController, setIdParkingPlaceController] = React.useState("");
    return (
      <div>
          <ButtonAntd type="primary" onClick={showModalParkingBuilding} style={{
            backgroundColor: "#FAD14B",
            borderColor: "#000000",
            marginBottom: "15px",
            color: "#000000",
            borderRadius: "8px",
          }}>
              Add Parking Building
          </ButtonAntd>
          <DetailModal

              visible={StateParkingBuildingModal.visible}
              title="Add Parking Building"
              onOk={handleOkParkingBuilding}
              onCancel={handleCancelParkingBuilding}
              width={400}
              footer={[
                  <ButtonAntd key="back" onClick={handleCancelParkingBuilding}>
                      Cancel
                  </ButtonAntd>,
                  <ButtonAntd
                      key="submit"
                      type="primary"
                      loading={StateParkingBuildingModal.loading}
                      onClick={handleOkParkingBuilding}
                  >
                      Submit
                  </ButtonAntd>,
              ]}
          >
              <Row style={rowStyle} gutter={gutter} justify="start">
                  <Col md={24} sm={24} xs={24} style={colStyle}>
                    <div className="isoSignInForm">
                      <h5 className="label-input">Parking Place Name</h5>

                      <Select
                        placeholder="Choose Parking Place"
                        //onChange={handleChange}
                        style={{
                          width: "100%",
                          border: "1px solid #E2E8F0",
                          borderRadius: "5px",
                        }}
                        value={idParkingPlaceController}
                        onChange={(value) => {
                          //OpsiParkingPlace = value;
                          setIdParkingPlaceController(value);
                          
                        }}
                      >
                        {OpsiParkingPlace}
                      </Select>
                      
                    </div>
                  </Col>
                  <Col md={24} sm={24} xs={24} style={colStyle}>
                    <div className="isoSignInForm">
                          <h5 className="label-input">Nama Parking Building</h5>
                          <div className="isoInputWrapper">
                              <InputGroup size="large" style={{ marginBottom: "15px" }}>
                                  <Input
                                      placeholder="Nama Parking Building"
                                      style={{ width: "100%" }}
                                      value={namaParkingBuildingController}
                                      onChange={(e) => setNamaParkingBuildingController(e.target.value)}

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


  //ADD PARKING SLOT
  const AddParkingSlotModal = () => {
    function StoreParkingSlot() {
      const formData = new FormData();
      formData.append("parking_building_id", idParkingBuilding);
      formData.append("instruction", instruction1);
      formData.append("instruction", instruction2);
      formData.append("instruction", instruction3);
      formData.append("image", image);
      formData.append("subtitle", subTitleParkingSlot);
      formData.append("title", titleParkingSlot);
      formData.append("status", status);
      // let data = {
      //   name: namaParkingBuildingController,
      //   parking_place_id: idParkingPlaceController,
      // };
      fetch(`${envConfig.URL_API_REST}/parking-slot`, {
         
          method: "POST",
          // headers: {
          //   "Content-Type": "application/json",
          // },
          body: formData,
      })
      .then((res) => res.json())
      .then((result) => {
        console.log("result : ", result);
        setIsDataChanged(true);
      
      });
    } 
    const { rowStyle, colStyle, gutter } = basicStyle;
    const [StateParkingSlotModal, setStateParkingSlotModal] = React.useState({
      loading: false,
    });
    const showModalAddParkingSlot = () => {
      setStateParkingSlotModal({
        visible: true,
      });
    };
    const handleOkAddParkingSlot = () => {
        StoreParkingSlot();
        if(isDataChanged == false){
            setIsDataChanged(true);
        }

        setStateParkingSlotModal({ loading: true });
        setTimeout(() => {
            setStateParkingSlotModal({ loading: false, visible: false });
        }, 2000);
        
    };

    const handleCancelParkingSlot = () => {
        setStateParkingSlotModal({ visible: false });
        
    };

    
    const [idParkingBuilding, setIdParkingBuilding] = React.useState("");
    const [titleParkingSlot, setTitleParkingSlot] = React.useState("");
    const [subTitleParkingSlot, setSubTitleParkingSlot] = React.useState("");
    const [instruction1, setInstruction1] = React.useState("");
    const [instruction2, setInstruction2] = React.useState("");
    const [instruction3, setInstruction3] = React.useState("");
    const [status, setStatus] = React.useState("true");
    const [image, setImage] = useState();




    return (
      <div>
          <ButtonAntd type="primary" onClick={showModalAddParkingSlot} style={{
            backgroundColor: "#FAD14B",
            borderColor: "#000000",
            marginBottom: "15px",
            color: "#000000",
            borderRadius: "8px",
          }}>
              Add Parking Slot
          </ButtonAntd>
          <DetailModal

              visible={StateParkingSlotModal.visible}
              title="Add Parking Slot"
              onOk={handleOkAddParkingSlot}
              onCancel={handleCancelParkingSlot}
              width={400}
              footer={[
                  <ButtonAntd key="back" onClick={handleCancelParkingSlot}>
                      Cancel
                  </ButtonAntd>,
                  <ButtonAntd
                      key="submit"
                      type="primary"
                      loading={StateParkingSlotModal.loading}
                      onClick={handleOkAddParkingSlot}
                  >
                      Submit
                  </ButtonAntd>,
              ]}
          >
              <Row style={rowStyle} gutter={gutter} justify="start">
                  <Col md={24} sm={24} xs={24} style={colStyle}>
                    <div className="isoSignInForm">
                      <h5 className="label-input">Parking Building Name</h5>
                      <Select
                        placeholder="Choose Parking Building"
                        //onChange={handleChange}
                        style={{
                          width: "100%",
                          border: "1px solid #E2E8F0",
                          borderRadius: "5px",
                        }}
                        value={idParkingBuilding}
                        onChange={(value) => {
                          //OpsiParkingPlace = value;
                          setIdParkingBuilding(value);
                          
                        }}
                      >
                        {OpsiParkingBuilding}
                      </Select>
                    </div>
                  </Col>
                  <Col md={24} sm={24} xs={24} style={colStyle}>
                    <div className="isoSignInForm">
                          <h5 className="label-input">Title Parking Slot</h5>
                          <div className="isoInputWrapper">
                              <InputGroup size="large" style={{ marginBottom: "15px" }}>
                                  <Input
                                      placeholder="Title Parking Slot"
                                      style={{ width: "100%" }}
                                      value={titleParkingSlot}
                                      onChange={(e) => setTitleParkingSlot(e.target.value)}

                                  />
                              </InputGroup>
                          </div>
                      </div>
                  </Col>
                  <Col md={24} sm={24} xs={24} style={colStyle}>
                    <div className="isoSignInForm">
                          <h5 className="label-input">Sub Title Parking Slot</h5>
                          <div className="isoInputWrapper">
                              <InputGroup size="large" style={{ marginBottom: "15px" }}>
                                  <Input
                                      placeholder="Sub Title Parking Slot"
                                      style={{ width: "100%" }}
                                      value={subTitleParkingSlot}
                                      onChange={(e) => setSubTitleParkingSlot(e.target.value)}

                                  />
                              </InputGroup>
                          </div>
                    </div>
                  </Col>
                  <Col md={24} sm={24} xs={24} style={colStyle}>
                      <div className="isoSignInForm">
                          <h5 className="label-input">Upload Image Parking Slot</h5>
                          <div className="isoInputWrapper">
                            <Input type='file' name="image" onChange={(e) =>{
                              setImage(e.target.files[0]);
                            }} />
                          </div>
                      </div>
                  </Col>
                  <Col md={24} sm={24} xs={24} style={colStyle}>
                    <div className="isoSignInForm">
                        <h5 className="label-input">Instruction 1</h5>
                        <div className="isoInputWrapper">
                            <InputGroup size="large" style={{ marginBottom: "15px" }}>
                                <Input
                                    placeholder="Instruction 1"
                                    style={{ width: "100%" }}
                                    value={instruction1}
                                    onChange={(e) => setInstruction1(e.target.value)}
                                />
                            </InputGroup>
                        </div>
                    </div>
                  </Col>
                  <Col md={24} sm={24} xs={24} style={colStyle}>
                    <div className="isoSignInForm">
                        <h5 className="label-input">Instruction 2</h5>
                        <div className="isoInputWrapper">
                            <InputGroup size="large" style={{ marginBottom: "15px" }}>
                                <Input
                                    placeholder="Instruction 2"
                                    style={{ width: "100%" }}
                                    value={instruction2}
                                    onChange={(e) => setInstruction2(e.target.value)}
                                />
                            </InputGroup>
                        </div>
                    </div>
                  </Col>
                  <Col md={24} sm={24} xs={24} style={colStyle}>
                    <div className="isoSignInForm">
                        <h5 className="label-input">Instruction 3</h5>
                        <div className="isoInputWrapper">
                            <InputGroup size="large" style={{ marginBottom: "15px" }}>
                                <Input
                                    placeholder="Instruction 3"
                                    style={{ width: "100%" }}
                                    value={instruction3}
                                    onChange={(e) => setInstruction3(e.target.value)}
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
  
  return (
    <LayoutContentWrapper style={{ minHeight: '100vh' }}>
      <LayoutContent style={{minHeight:"100vh"}}>
          <Row style={{
            ...rowStyle,
            marginTop: 10,
          }} gutter={gutter} justify="start">
              <Col md={20} sm={20} xs={20} style={colStyle}>
                <h1 style={{fontWeight:"bold", fontSize:"20px"}}>
                  Parking Place
                </h1>
              </Col>
              <Col md={4} sm={4} xs={4} style={colStyle}>
               
                <AddParkingPlaceModal/>
                
              </Col>
          </Row>
          <Row style={rowStyle} gutter={gutter} justify="start">
              <Col md={24} sm={24} xs={24} style={colStyle}>
                <Table dataSource={DataRetrivied2} columns={columnsParkingplace} pagination={false}/>
              
              </Col>
          </Row>
          <Row style={{
            ...rowStyle,
            marginTop: 10,
          }} gutter={gutter} justify="start">
              <Col md={20} sm={20} xs={20} style={colStyle}>
                <h1 style={{fontWeight:"bold", fontSize:"20px"}}>
                  Parking Building
                </h1>
              </Col>
              <Col md={4} sm={4} xs={4} style={colStyle}>
               
                <AddParkingBuildingModal/>
              </Col>
          </Row>
          <Row style={rowStyle} gutter={gutter} justify="start">
              <Col md={24} sm={24} xs={24} style={colStyle}>
                <Table dataSource={DataRetrivied3} columns={columsParkingBuilding} pagination={false}/>
              
              </Col>
          </Row>   
          <Row style={
            {
              ...rowStyle,
              marginTop: 10,
            }
          } gutter={gutter} justify="start">
              <Col md={20} sm={20} xs={20} style={colStyle}>
                <h1 style={{fontWeight:"bold", fontSize:"20px"}}>
                  Parking Spot
                </h1>
              </Col>
              <Col md={4} sm={4} xs={4} style={colStyle}>
               
                <AddParkingSlotModal/>
                
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
