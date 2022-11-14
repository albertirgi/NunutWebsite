import styled from 'styled-components';
import { palette } from 'styled-theme';
import WithDirection from '@iso/lib/helpers/rtl';

import bgImage from '@iso/assets/images/bg.png';

const NewSignInLayoutWrapper = styled.div`
    width: 100%;
    min-height: 100vh;
    
    
    @media only screen and (max-width: 820px) {
        .website-version {
          display: none !important;
        }
        
    }
    @media only screen and (min-width: 821px) {
        
        .mobile-version {
            display: none !important;
        }
    }
    
`;

export default WithDirection(NewSignInLayoutWrapper);
