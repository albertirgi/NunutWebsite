import styled from 'styled-components';

import bgTunggu from '@iso/assets/images/nunut/bg-tunggu.png';
import contentJoin from '@iso/assets/images/nunut/content-join.png';

const JoinLayoutHolder = styled.div`
@media screen and (max-width: 600px) {
    .desktop-nav {
        display: none;
    }
    .content-join{
        height:510px !important;
    }
    .title-home{
        margin-top: 30px !important;
        font-size: 40px !important ;

    }
    .cta-text{
        margin-top: 20px !important;
    }
}
.content-down{
    background-image: url(${bgTunggu});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    height:500px;
}
.content-join{
    background-image: url(${contentJoin});
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    height:1990px;
}
.directPage:hover{
    cursor: pointer;
}
.cta-text{
    margin-top: 100px !important;
}
`;

export default JoinLayoutHolder;