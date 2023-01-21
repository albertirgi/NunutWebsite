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
} from "antd";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Textarea, InputGroup } from "@iso/components/uielements/input";
import DetailModals from "@iso/components/Feedback/Modal";
import DetailModalStyle from "@iso/containers/Feedback/Modal/Modal.styles";
import basicStyle from "@iso/assets/styles/constants";
import WithDirection from "@iso/lib/helpers/rtl";
import envConfig from "../../../../env-config";
import { prop } from "styled-tools";
const isoDetailModal = DetailModalStyle(DetailModals);
const DetailModal = WithDirection(isoDetailModal);
export function boolAddMaps(param1){
   if (param1 == true){
       return true;
    }else{
         return false;
     }
}

const AddMapsModal = () => {
    
    //export const [ButtonAddMapsCount, setButtonAddMapsCount] = useState(0);
    //post data

    const [isDataChanged, setIsDataChanged] = useState(false);
    function StoreMaps() {
        let data = {
            name: NamaLokasiController,
            latitude: LatitudeController,
            longitude: LongitudeController,
        };
        fetch(`${envConfig.URL_API_REST}/map`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
        .then((res) => res.json())
        .then((result) => {
        // if (result.statusCode == 401 && result.message == "Unauthorized") {
        // }
        // console.log("result : ", result);
        //setButtonAddMapsCount(ButtonAddMapsCount + 1);
        setIsDataChanged(true);
        boolAddMaps(isDataChanged);
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
            <ButtonAntd type="primary" onClick={showModalDetailKR}>
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
                        <InputGroup size="large" style={{ marginBottom: "15px" }}>
                            <Input
                                placeholder="Latitude"
                                style={{ width: "100%" }}
                                value={LatitudeController}
                                onChange={(e) => setLatitudeController(e.target.value)}
                            />
                        </InputGroup>
                    </Col>
                    <Col md={12} sm={12} xs={12} style={colStyle}>
                        <InputGroup size="large" style={{ marginBottom: "15px" }}>
                            <Input
                                placeholder="Longitude"
                                style={{ width: "100%" }}
                                value={LongitudeController}
                                onChange={(e) => setLongitudeController(e.target.value)}
                            />
                        </InputGroup>
                    </Col>
                </Row>
            </DetailModal>
        </div>
    );

}

export default AddMapsModal;

