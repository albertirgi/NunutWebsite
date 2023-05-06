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
  
  } from "antd";
  import { Select } from 'antd';
import basicStyle from "@iso/assets/styles/constants";
import envConfig from '../env-config';
import WithDirection from "@iso/lib/helpers/rtl";
import DetailModals from "@iso/components/Feedback/Modal";
import DetailModalStyle from "@iso/containers/Feedback/Modal/Modal.styles";
const { rowStyle, colStyle, gutter } = basicStyle;
const isoDetailModal = DetailModalStyle(DetailModals);
const DetailModal = WithDirection(isoDetailModal);
import { Textarea, InputGroup } from "@iso/components/uielements/input";

import notifications from "@iso/components/Feedback/Notification";
import NotificationContent from "@iso/containers/Feedback/Notification/Notification.styles";


export default function VoucherPage() {
  //function-funtion
  function DeleteVoucher(id) {
    const token = localStorage.getItem("token");
    fetch(`${envConfig.URL_API_REST}/voucher/${id}`, {
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

  //notification
  
  const NotificationConfirmDeleteVoucher = (a) => {
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
              DeleteVoucher(a);
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
          <h3 style={{ fontWeight: "bold" }}>Delete Voucher</h3>
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

  function pullVoucher(){
    var number = 1;
    const token = localStorage.getItem("token");
    fetch(apiUrlVoucher,{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((respone) => respone.json())
      .then((responData) => {
        
        voucherAll = responData.data?.map(function (data) {
          return {
            //voucher_id: data.voucher_id,
            no: number++,
            code: data.code,
            expired_at: data.expired_at,
            minimum: data.minimum_purchase,
            maximum: data.maximum_discount,
            tnc: data.tnc,
            image: <a href={data?.image.toString()} target="_blank">
              <Button>
                Lihat Gambar
              </Button>
            </a>,
            type: data.type,
            discount: data.discount,
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
              NotificationConfirmDeleteVoucher(data.voucher_id);
            }}
          >
            Delete
          </Button>

          };
        });
        setDataRetrivied(voucherAll);
      });
      if(isDataChanged == true){
        setIsDataChanged(false);
      }
  }

  //add voucher modal
  //ADD PARKING SLOT
  const AddVoucherModal = () => {
    function StoreVoucher() {
      const formData = new FormData();
      formData.append("code", voucherCode);
      formData.append("expired_at", expiredAt);
      formData.append("minimum", minimum);
      formData.append("maximum", maximum);
      formData.append("tnc", tnc1);
      formData.append("tnc", tnc2);
      formData.append("tnc", tnc3);
      formData.append("image", image);
      formData.append("type", voucherType);
      formData.append("discount", voucherDiscount);

      const token = localStorage.getItem("token");
      fetch(`${envConfig.URL_API_REST}/voucher`, {
         
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
      })
      .then((res) => res.json())
      .then((result) => {
        console.log("result : ", result);
        setIsDataChanged(true);
      
      });
    } 
    const { rowStyle, colStyle, gutter } = basicStyle;
    const [StateVoucherModal, setStateVoucherModal] = React.useState({
      loading: false,
    });
    const showModalAddVoucher = () => {
      setStateVoucherModal({
        visible: true,
      });
    };
    const handleOkAddVoucher = () => {

        var discountValueInt = parseInt(voucherDiscount);
        var minimumValueInt = parseInt(minimum);
        if(voucherType=="nominal" && discountValueInt <= minimumValueInt){
          StoreVoucher();
        }
        else if(voucherType=="percentage" && discountValueInt <= 100){
          StoreVoucher();
        }
        else{
          alert("Error : Discount value must be less than minimum value");
          
        }

        
        if(isDataChanged == false){
            setIsDataChanged(true);
        }

        setStateVoucherModal({ loading: true });
        setTimeout(() => {
            setStateVoucherModal({ loading: false, visible: false });
        }, 2000);
        
    };

    const handleCancelParkingSlot = () => {
        setStateVoucherModal({ visible: false });
        
    };

    
    const [idVoucher, setIdVoucher] = React.useState("");
    const [voucherCode, setVoucherCode] = React.useState("");
    const [expiredAt, setExpiredAt] = React.useState("");
    const [minimum, setMinimum] = React.useState("");
    const [maximum, setMaximum] = React.useState("");
    const [tnc1, setTnc1] = React.useState("");
    const [tnc2, setTnc2] = React.useState("");
    const [tnc3, setTnc3] = React.useState("");
    const [image, setImage] = useState();
    const [voucherType, setVoucherType] = React.useState("percentage");
    const [voucherDiscount, setVoucherDiscount] = React.useState("");



    return (
      <div>
          <ButtonAntd type="primary" onClick={showModalAddVoucher} style={{
            backgroundColor: "#FAD14B",
            borderColor: "#000000",
            marginBottom: "15px",
            color: "#000000",
            borderRadius: "8px",
          }}>
              Add Voucher
          </ButtonAntd>
          <DetailModal

              visible={StateVoucherModal.visible}
              title="Add Voucher"
              onOk={handleOkAddVoucher}
              onCancel={handleCancelParkingSlot}
              width={400}
              centered
              footer={[
                  <ButtonAntd key="back" onClick={handleCancelParkingSlot}>
                      Cancel
                  </ButtonAntd>,
                  <ButtonAntd
                      key="submit"
                      type="primary"
                      loading={StateVoucherModal.loading}
                      onClick={handleOkAddVoucher}
                  >
                      Submit
                  </ButtonAntd>,
              ]}
          >
              <Row style={rowStyle} gutter={gutter} justify="start">
                  <Col md={24} sm={24} xs={24} style={colStyle}>
                    <div className="isoSignInForm">
                        <h5 className="label-input">Voucher Code</h5>
                        <div className="isoInputWrapper">
                            <InputGroup size="large" style={{ marginBottom: "15px" }}>
                                <Input
                                    placeholder="Voucher Code"
                                    style={{ width: "100%" }}
                                    value={voucherCode}
                                    onChange={(e) => setVoucherCode(
                                      e.target.value.replace(/\s/g, '').toUpperCase()
                                    )}
                                />
                            </InputGroup>
                        </div>
                    </div>
                  </Col>
                  <Col md={24} sm={24} xs={24} style={colStyle}>
                    <div className="isoSignInForm">
                        <h5 className="label-input">Minimum Value</h5>
                        <div className="isoInputWrapper">
                            <InputGroup size="large" style={{ marginBottom: "15px" }}>
                                <Input
                                    placeholder="Minimum Value"
                                    style={{ width: "100%" }}
                                    value={minimum}
                                    onChange={(e) => setMinimum(e.target.value)}
                                    maxLength={5}
                                />
                            </InputGroup>
                        </div>
                    </div>
                  </Col>
                  <Col md={24} sm={24} xs={24} style={colStyle}>
                    <div className="isoSignInForm">
                        <h5 className="label-input">Maximum Value</h5>
                        <div className="isoInputWrapper">
                            <InputGroup size="large" style={{ marginBottom: "15px" }}>
                                <Input
                                    placeholder="Maximum Value"
                                    style={{ width: "100%" }}
                                    value={maximum}
                                    onChange={(e) => setMaximum(e.target.value)}
                                    maxLength={5}
                                />
                            </InputGroup>
                        </div>
                    </div>
                  </Col>
                  <Col md={24} sm={24} xs={24} style={colStyle}>
                    <div className="isoSignInForm">
                        <h5 className="label-input">Expired At</h5>
                        <div className="isoInputWrapper">
                          <DatePicker onChange={
                            (date, dateString) => setExpiredAt(dateString)
                          } />
                        </div>
                    </div>
                  </Col>
                  <Col md={24} sm={24} xs={24} style={colStyle}>
                    <div className="isoSignInForm">
                        <h5 className="label-input">Tnc 1</h5>
                        <div className="isoInputWrapper">
                            <InputGroup size="large" style={{ marginBottom: "15px" }}>
                                <Input
                                    placeholder="Tnc 1"
                                    style={{ width: "100%" }}
                                    value={tnc1}
                                    onChange={(e) => setTnc1(e.target.value)}
                                />
                            </InputGroup>
                        </div>
                    </div>
                  </Col>
                  <Col md={24} sm={24} xs={24} style={colStyle}>
                    <div className="isoSignInForm">
                        <h5 className="label-input">Tnc 2</h5>
                        <div className="isoInputWrapper">
                            <InputGroup size="large" style={{ marginBottom: "15px" }}>
                                <Input
                                    placeholder="Tnc 2"
                                    style={{ width: "100%" }}
                                    value={tnc2}
                                    onChange={(e) => setTnc2(e.target.value)}
                                />
                            </InputGroup>
                        </div>
                    </div>
                  </Col>
                  <Col md={24} sm={24} xs={24} style={colStyle}>
                    <div className="isoSignInForm">
                        <h5 className="label-input">Tnc 3</h5>
                        <div className="isoInputWrapper">
                            <InputGroup size="large" style={{ marginBottom: "15px" }}>
                                <Input
                                    placeholder="Tnc 3"
                                    style={{ width: "100%" }}
                                    value={tnc3}
                                    onChange={(e) => setTnc3(e.target.value)}
                                />
                            </InputGroup>
                        </div>
                    </div>
                  </Col>
                  <Col md={24} sm={24} xs={24} style={colStyle}>
                      <div className="isoSignInForm">
                          <h5 className="label-input">Upload Cover Image</h5>
                          <div className="isoInputWrapper">
                            <Input type='file' name="image" onChange={(e) =>{
                              setImage(e.target.files[0]);
                            }} />
                          </div>
                      </div>
                  </Col>
                  <Col md={24} sm={24} xs={24} style={colStyle}>
                    <div className="isoSignInForm">
                        <h5 className="label-input">Voucher Type</h5>
                        <Select
                        placeholder="Choose Parking Building"
                        //onChange={handleChange}
                        style={{
                          width: "100%",
                          border: "1px solid #E2E8F0",
                          borderRadius: "5px",
                        }}
                        value={voucherType}
                        onChange={(value) => {
                          
                          setVoucherType(value);
                          
                        }}
                      >
                        <option value="percentage" >Percentage</option>
                        <option value="nominal" >Nominal</option>
                      </Select>
                    </div>
                  </Col>
                  <Col md={24} sm={24} xs={24} style={colStyle}>
                    <div className="isoSignInForm">
                        <h5 className="label-input">Discount Value</h5>
                        <div className="isoInputWrapper">
                            <InputGroup size="large" style={{ marginBottom: "15px" }}>
                                <Input
                                    placeholder="Discount Value"
                                    style={{ width: "100%" }}
                                    value={voucherDiscount}
                                    onChange={(e) => setVoucherDiscount(e.target.value)}
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



  const columns = [
    // {
    //   title: 'Id',
    //   dataIndex: 'voucher_id',
    //   key: 'voucher_id',
    // },
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
    },
    {
      title: 'Voucher Code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Expired At',
      dataIndex: 'expired_at',
      key: 'expired_at',
    },
    {
      title: 'Minimum',
      dataIndex: 'minimum',
      key: 'minimum',
    },
    {
      title: 'Maximum',
      dataIndex: 'maximum',
      key: 'maximum',
    },
    {
      title: 'Tnc',
      dataIndex: 'tnc',
      key: 'tnc',
    },
    {
      title: 'Cover Image',
      dataIndex: 'image',
      key: 'image',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Besaran Discount',
      dataIndex: 'discount',
      key: 'discount',
    },
    {
      title:'Action',
      dataIndex:'action',
      key:'action',
  },
  
  ];

  


  const [DataRetrivied, setDataRetrivied] = useState();
  const [isDataChanged, setIsDataChanged] = useState(false);
  
  const apiUrlVoucher = `${envConfig.URL_API_REST}/voucher`;
  let voucherAll;

  

  //useEffect
  useEffect(() => {
    
    pullVoucher();
  }, [isDataChanged == true && DataRetrivied]);


  return (
    <LayoutContentWrapper >
      <LayoutContent style={{maxHeight:"100vh"}}>
          <Row style={rowStyle} gutter={gutter} justify="start">
              <Col md={20} sm={20} xs={20} style={colStyle}>
                <h1 style={{fontWeight:"bold", fontSize:"20px"}}>
                  Voucher
                </h1>
              </Col>
              <Col md={4} sm={4} xs={4} style={colStyle}>
                <AddVoucherModal></AddVoucherModal>
              </Col>
          </Row>
          <Row style={rowStyle} gutter={gutter} justify="start">
              <Col md={24} sm={24} xs={24} style={colStyle}>
                <Table dataSource={DataRetrivied} columns={columns}  />
              </Col>
          </Row>   
      </LayoutContent>
      
    </LayoutContentWrapper>
  );
}
