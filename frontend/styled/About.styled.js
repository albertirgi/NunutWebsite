import styled from 'styled-components';

import contentAbout from '@iso/assets/images/nunut/content-about.png';

const AboutLayoutHolder = styled.div`
@media screen and (max-width: 600px) {
    .desktop-nav {
        display: none;
    }
    .content-about{
        height:510px !important;
    }
    .title-home{
        margin-top: 30px !important;
        font-size: 40px !important;
    }
}
.content-about{
    background-image: url(${contentAbout});
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    height:1990px;
}
`;

export default AboutLayoutHolder;