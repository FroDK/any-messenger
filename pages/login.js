import Head from "next/head";
import styled from 'styled-components';
import {Button} from "@material-ui/core";
import {auth, provider} from "../firebase";

const Login = () => {

    const signIn = () => {
        auth.signInWithPopup(provider).catch(alert);
    }

    return (
        <Container>
            <Head>
                <title>Login</title>
            </Head>

            <LoginContainer>
                <LoginButton onClick={signIn} variant="contained" size="Large">Sign in with Google</LoginButton>
            </LoginContainer>
        </Container>
    );
};

export default Login;

const Container = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
  background-color: #F6F7F9;
`;

const LoginContainer = styled.div`
  height: 500px;
  width: 350px;
  display: flex;
  padding-bottom: 50px;
  flex-direction: row;
  align-items: flex-end;
  justify-content: center;
  background-color: gray;
  background-image: url("/images/unnamed.png");
  background-position: center;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
  border-radius: 8px;
`;

const Logo = styled.img`
  height: 200px;
  width: 200px;
  margin-bottom: 50px;
`;

const LoginButton = styled(Button)`
  &&& {
    background-color: white;
  }
`;