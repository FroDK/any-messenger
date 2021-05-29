import styled from 'styled-components'
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../firebase";
import moment from "moment";

const Message = ({user, message}) => {
    const [userLoggedIn] = useAuthState(auth)

    const TypeOfMessage = user === userLoggedIn.email ? Sender : Receiver

    return (
        <Container>
            <TypeOfMessage>{message.message}
                <Timestamp>{message.timestamp ? moment(message.timestamp).format('H:mm') : "..."}</Timestamp>
            </TypeOfMessage>
        </Container>
    );
};

export default Message;

const Container = styled.div``;

const MessageElement = styled.p`
  width: fit-content;
  border-radius: 8px;
  margin: 10px;
  min-width: 60px;
  max-width: 45%;
  padding: 15px 15px 26px;
  position: relative;
  text-align: justify;
  word-break: break-word;
`;

const Sender = styled(MessageElement)`
  margin-left: auto;
  background-color: #dcf8c6;
`;

const Receiver = styled(MessageElement)`
  background-color: whitesmoke;
  text-align: left;
`;

const Timestamp = styled.span`
  color: gray;
  padding: 10px;
  font-size: 11px;
  position: absolute;
  bottom: 0;
  right: 0;
  text-align: right;
`;