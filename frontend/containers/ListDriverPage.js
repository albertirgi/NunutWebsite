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
  Select,
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
  //   dataIndex: 'id_driver',
  //   key: 'id_driver',
  //   align: 'center',
  // },
  {
    title: 'No',
    dataIndex: 'no',
    key: 'no',
    align: 'center',
  },
  {
    title:'Full Name',
    dataIndex:'full_name',
    key:'full_name',
    align: 'center',
  },
  {
    title:'KTP',
    dataIndex:'KTP',
    key:'KTP',
    align: 'center',
  },
  {
    title:'Driving License',
    dataIndex:'driving_license',
    key:'driving_license',
    align: 'center',
  },
  {
    title:'Agreement Letter',
    dataIndex:'agreement_letter',
    key:'agreement_letter',
    align: 'center',
  },
  {
    title:'Driver Image',
    dataIndex:'driver_image',
    key:'driver_image',
    align: 'center',
  },
  {
    title:'Driver Status',
    dataIndex:'driver_status',
    key:'driver_status',
    align:'center',
    textAlign:'center',
  },
  {
    title:'Action',
    dataIndex:'action',
    key:'action',
    align: 'center',
  },
  

];

function getFileNameOnURL(url) {
  return url?.substring(url.lastIndexOf('/') + 1);
}

// function setupMailer() {
//   return nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true,
//     auth: {
//       user: "psociopreneur@gmail.com",
//       pass: "remnvcsctsuphumg",
//     },
//     tls: {
//       rejectUnauthorized: false,
//     },
//   });
// }

// export const sendEmail = (email,subject,text) => {
//   const mailer = setupMailer();
//   const mailOptions = {
//     from: "psociopreneur@gmail.com",
//     to: email,
//     subject: subject,
//     text: text,
//   };
//   mailer.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.log("Error sending email: " + error);
//       return false;
//     } else {
//      return true;
//     }
//   });
// }


export default function ListDriverPage() {
  var number = 1;
  
  const [DataRetrivied, setDataRetrivied] = useState();
  const apiUrlDriver = `${envConfig.URL_API_REST}/driver?user`;
  let DriverAll;

  const [isDataChanged, setIsDataChanged] = useState(false);


  function SendEmail(email, subject, text) {
    var apiEmail = `https://ayonunut.com/api/v1/sendEmail?bryanganteng`
    fetch(apiEmail, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: email,
        subject: subject,
        text: text,
      }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log("responseJson", responseJson);
    })
  }

  

  function FileGetter(fileName) {
    var apiFileGetter = `${envConfig.URL_API_REST}/file/`;
    var filename = fileName;
    const token = localStorage.getItem('token');
    fetch(apiFileGetter + filename, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.blob())
    .then((blob) => {
      const reader = new FileReader();
      reader.onload = function() {
        const htmlBlob = new Blob([reader.result], {type: 'text/html'});
        const htmlUrl = URL.createObjectURL(htmlBlob);
        const win = window.open(htmlUrl);
        // Use responData here, e.g.:
        // win.document.write(responData);
      };
      reader.readAsText(blob);
    })
    .catch((error) => {
      console.log(error);
    });
  }
  
  const EditStatusDriver = (email,driver_id, status) => {
    const [StatusDriver, setStatusDriver] = useState(status);
    const handleChange = (value) => {
      setStatusDriver(value);
      console.log(`selected ${value}`);
    };
    function editStatus(d_id, stat) {
        let data = {
          status: stat,
        };
        //console.log(`data_id: ${d_id.driver_id} data_status: ${stat}`);
        const token = localStorage.getItem("token");
        fetch(`${envConfig.URL_API_REST}driver/status/${email.driver_id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        })        
        .then((res) => res.json())
        .then((result) => {
          console.log("d_id: ", email.driver_id);
          console.log("email to : ", email.email);
          if(stat == "Approved"){
            SendEmail(email.email, "Driver Status", "Your Driver Status has been Approved");
          }else if(stat == "Rejected"){
            SendEmail(email.email, "Driver Status", "Your Driver Status has been Rejected");
          }
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
        editStatus(driver_id, StatusDriver);
        if(!isDataChanged){
          setIsDataChanged(true);
        }
        //console.log(isDataChanged);

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
            <ButtonAntd type="primary" onClick={showModalDetailKR} style={{
              backgroundColor: "#FAD14B",
              borderColor: "#000000",
              marginBottom: "15px",
              color: "#000000",
              borderRadius: "8px",
            }}>
                Edit Status Driver
            </ButtonAntd>
            <DetailModal

                visible={stateAddMaps.visible}
                title="Edit Status Driver"
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
                            <h5 className="label-input">Status Driver</h5>
                            <Select
                              //defaultValue={status}
                              style={{
                                width: "100%",
                              }}
                              onChange={handleChange}
                              options={[
                                {
                                  value: 'Pending',
                                  label: 'Pending',
                                },
                                {
                                  value: 'Rejected',
                                  label: 'Rejected',
                                },
                                {
                                  value: 'Approved',
                                  label: 'Approved',
                                },
                                
                              ]}
                            />
                           
                        </div>
                    </Col>
                </Row>
            </DetailModal>
        </div>
    );
  }
  

  
  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(apiUrlDriver,{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((respone) => respone.json())
      .then((responData) => {
        DriverAll = responData.data?.map(function (data) {
          return {
            key: data.driver_id,
            // id_driver: data.driver_id,
            no : number++,
            full_name: data.name,
            email: data.email,
            KTP: data.student_card?.toString() !== "null" ? <Button onClick={
              () => {
                FileGetter(getFileNameOnURL(data?.student_card?.toString()));
              }}> 
                Click to Open
              </Button> 
              : "No File" ,
            driving_license: data.driving_license?.toString() !== "null" ? <Button onClick={
              () => {
                FileGetter(getFileNameOnURL(data?.driving_license?.toString()));
              }}> 
                Click to Open
              </Button> : "No File",
            agreement_letter: data.agreement_letter?.toString() !== "null" ? <Button onClick={
              () => {
                FileGetter(getFileNameOnURL(data?.agreement_letter?.toString()));
              }}> 
                Click to Open
              </Button> : "No File",
            driver_image: data.driver_image?.toString() !== "null" ? <Button onClick={
              () => {
                FileGetter(getFileNameOnURL(data?.driver_image?.toString()));
              }}> 
                Click to Open
              </Button> : "No File",
            driver_status: data.status,
            action: <EditStatusDriver email= {data.email} driver_id={data.driver_id} status={data.status} />,

          };
        });
        setDataRetrivied(DriverAll);
      });
      if(isDataChanged == true){
        setIsDataChanged(false);
      }
  }, [isDataChanged == true && DataRetrivied]);
  return (
    <LayoutContentWrapper >
      <LayoutContent >
          <Row style={rowStyle} gutter={gutter} justify="start">
              <Col md={24} sm={24} xs={24} style={colStyle}>
                <h1 style={{fontWeight:"bold", fontSize:"20px"}}>
                  Driver
                </h1>
              </Col>
              {/* <Col md={4} sm={4} xs={4} style={colStyle}>
                <Button>
                  
                </Button>
                
              </Col> */}
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
