import styled from 'styled-components';


const  NavbarHolder = styled.div`
    @media screen and (max-width: 600px) {
        .desktop-nav {
            display: none !important;

        }
        .mobile-nav{
            display: flex !important;
        }
        .logo {
            float: left;
            padding: 15px 5px !important;
        }
    }
   
   
    


    .navbar {
        width: 100%;
        height: 100vh;
        //fulll background
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        
        
    }
    .logo {
        float: left;
        padding: 40px 60px;
    }
    
    .nav {
        float: left;
        padding: 40px 20px;
    }
    .nav ul {
        margin: 0px;
        padding: 0px;
        list-style: none;
    }
    .nav ul li {
        display: inline-block;
        margin: 0px 0px;
    }
    .nav ul li a {
        display: block;
        padding: 20px 40px;
        color: #fff;
        font-size: 20px;
        font-weight: 500;
        text-decoration: none;
        transition: all 0.3s ease 0s;
    }
    .nav ul li a:hover {
        color: #fff;
        //little border bottom
        border-bottom: 4px solid #fff;
        
    }
    .nav ul li a.active {
        color: #fff;
        border-bottom: 4px solid #fff;

    }
    .nav ul li a.active:hover {
        color: #fff;
        border-bottom: 4px solid #fff;

    }

    //mobile nav
    .nav-mobile {
        display: block;
    }
    .nav-mobile ul {
        margin: 0px;
        padding: 0px;
        list-style: none;
    }
    .nav-mobile ul li {
        display: block;
        margin: 0px 0px;
    }
    .nav-mobile ul li a {
        display: block;
        padding: 20px 40px;
        color: #fff;
        font-size: 20px;
        font-weight: 500;
        text-decoration: none;
        transition: all 0.3s ease 0s;

    }
    .nav-mobile ul li a:hover {
        color: #fff;
        border-bottom: 4px solid #fff;
    }
    .nav-mobile ul li a.active {
        color: #FAD14B;


    }
    .nav-mobile ul li a.active:hover {
        color: #fff;
        border-bottom: 4px solid #fff;

    }
    



    .DownloadButton {
        float: left;
        margin: 55px 50px;
        padding: 0px 25px;
        height: 45px;
        background-color: #FAD14B;
        color: black;
        font-size: 20px;
        font-weight: 600;
        border-radius: 30px;
    }
   
`;

export default NavbarHolder;
