import styled from 'styled-components';

import contentAbout from '@iso/assets/images/nunut/content-about.png';

const AboutLayoutHolder = styled.div`
.content-about{
    background-image: url(${contentAbout});
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    height:1990px;
}
`;

export default AboutLayoutHolder;