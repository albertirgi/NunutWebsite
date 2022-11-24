import React from 'react';
import HelperText from './NoApiKey.style';

const NoApiKey = ({ width = '100%', height = '40vh', NoApiKeyImg }) => <HelperText className="isoHelperText" style={{ width, height }}>
  <img alt="#" src={NoApiKeyImg} />
  <h3>Please Enter Your API Key in the `src/settings/index.js`</h3>
</HelperText>;

// import NoApiKeyImg from "../../image/NoAPIKey.svg";

export default NoApiKey;
