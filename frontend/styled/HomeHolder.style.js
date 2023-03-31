import styled from 'styled-components';
import contentHome from '@iso/assets/images/nunut/content-Home.png';
import bgTunggu from '@iso/assets/images/nunut/bg-tunggu.png';

const HomeLayoutHolder = styled.div`
@media screen and (max-width: 600px) {
    .desktop-nav {
        display: none;
    }
    .content-home{
        height:760px !important;
    }
    .title-home{
        margin-top: 30px !important;
        font-size: 40px !important;
    }
}
.content-home {
    background-image: url(${contentHome});
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    height:2981px;
    width: 100%;
}
.content-down{
    background-image: url(${bgTunggu});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    height:500px;
}
.directPage:hover{
    cursor: pointer;
}
.cta-text{
    margin-top: 100px !important;
}

`;

export default HomeLayoutHolder;