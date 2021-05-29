import styled from "styled-components";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "../firebase";
import {useRouter} from "next/router";
import {Avatar, IconButton} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AttachFileIcon from '@material-ui/icons/AttachFile';
import {useCollection} from "react-firebase-hooks/firestore";
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';
import Message from "./Message";
import {useEffect, useRef, useState} from "react";
import firebase from "firebase";
import getRecipientEmail from "../utils/getRecipientEmail";
import TimeAgo from "timeago-react";
import SendIcon from '@material-ui/icons/Send';
import TextareaAutosize from 'react-textarea-autosize';



const ChatScreen = ({chat, messages}) => {
    const [user] = useAuthState(auth)
    const [input, setInput] = useState("")
    const endOfMessagesRef = useRef(null)
    const messageEl = useRef(null);
    const router = useRouter()
    const [messagesSnapshot] = useCollection(db
        .collection('chats')
        .doc(router.query.id)
        .collection('messages')
        .orderBy('timestamp', 'asc'))

    const [recipientSnapshot] = useCollection(
        db.collection('users').where('email', '==', getRecipientEmail(chat.users, user))
    )

    const showMessages = () => {
        if (messagesSnapshot) {
            return messagesSnapshot.docs.map(message => (
                <Message
                    key={message.id}
                    user={message.data().user}
                    message={{
                        ...message.data(),
                        timestamp: message.data().timestamp?.toDate().getTime()
                }}/>
            ))
        } else {
            return JSON.parse(messages).map(message => (
                <Message
                    key={message.id}
                    user={message.user}
                    message={message}/>
            ))
        }
    }

    const sendMessage = (e) => {
        e.preventDefault()
        // Update last seen
        db.collection('user').doc(user.uid).set({
            lastSeen: firebase.firestore.FieldValue.serverTimestamp()
        }, {merge: true})

        db.collection('chats').doc(router.query.id).collection('messages').add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            user: user.email,
            photoURL: user.photoURL
        })

        setInput('')
    }

    useEffect(() => {
        messageEl?.current?.lastChild?.scrollIntoView({
            behavior: "auto",
            block: "start"
        })
        if (messageEl) {
            messageEl?.current?.addEventListener('DOMNodeInserted', event => {
                const target = event.target.firstChild
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                })
            });
        }
    }, [])

    const onEnterPress = (e) => {
        if(e.keyCode === 13 && e.shiftKey === false) {
            if (input.trim().length !== 0) sendMessage(e)
        }
    }

    const recipient = recipientSnapshot?.docs?.[0]?.data()
    const recipientEmail = getRecipientEmail(chat.users, user)

    return (
        <Container>
            <Header>
                {recipient ? (
                    <Avatar src={recipient?.photoURL}/>
                ) : (
                    <Avatar>{recipientEmail[0]}</Avatar>
                )}

                <HeaderInformation>
                    <h3>{recipientEmail}</h3>
                    {recipientSnapshot ? (
                        <p>Last active: {' '}
                            {recipient?.lastSeen?.toDate() ? (
                                <TimeAgo datetime={recipient?.lastSeen?.toDate()}/>
                            ) : '01.01.1970 00:00'}
                        </p>
                    ) : (
                        <p>Loading last active...</p>
                    )}
                </HeaderInformation>
                <HeaderIcons>
                    <IconButton>
                        <AttachFileIcon/>
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon/>
                    </IconButton>
                </HeaderIcons>
            </Header>

            <MessageContainer ref={messageEl}>
                {/* show messages */}
                {showMessages()}
                {/*<EndOfMessage ref={endOfMessagesRef} />*/}
            </MessageContainer>

            <InputContainer>
                <InsertEmoticonIcon />
                <Input value={input} onChange={e => setInput(e.target.value)} onKeyDown={onEnterPress} minRows={1} maxRows={6} />
                {/*<button hidden disabled={!input} type='submit' onClick={sendMessage}>Send Message</button>*/}
                <IconButton disabled={input.trim().length === 0} onClick={sendMessage}>
                    <SendIcon style={input.trim().length === 0 ? {color: "gray"} : {color: "dodgerblue"}}/>
                </IconButton>
            </InputContainer>
        </Container>
    );
};

export default ChatScreen;

const Container = styled.div`
  
`;

const Input = styled(TextareaAutosize)`
  flex: 1;
  outline: none;
  border: none;
  border-radius: 10px;
  background-color: whitesmoke;
  padding: 15px;
  margin-left: 15px;
  margin-right: 15px;
  font-size: 1.2rem;
  word-break: break-word;
  resize: none;
`;

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 100;
`;

const Header = styled.div`
  position: sticky;
  background-color: white;
  z-index: 100;
  top: 0;
  display: flex;
  padding: 11px;
  height: 80px;
  align-items: center;
  border-bottom: 1px solid whitesmoke;
`;

const HeaderInformation = styled.div`
  margin-left: 15px;
  flex: 1;

  > h3 {
    margin: 0;
  }

  > p {
    margin: 0;
    font-size: 14px;
    color: gray;
  }
`;

const HeaderIcons = styled.div``;

const EndOfMessage = styled.div`
  margin-bottom: 50px;
`;

const MessageContainer = styled.div`
  padding: 1px;
  background-image: linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%);
  background-attachment: fixed;
  min-height: 84vh;
`;