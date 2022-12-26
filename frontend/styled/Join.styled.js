import styled from 'styled-components';

import bgTunggu from '@iso/assets/images/nunut/bg-tunggu.png';
import contentJoin from '@iso/assets/images/nunut/content-join.png';

const JoinLayoutHolder = styled.div`
.content-down{
    background-image: url(${bgTunggu});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    
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
`;

export default JoinLayoutHolder;