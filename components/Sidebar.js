import styled from "styled-components";
import {Avatar, Button, IconButton, Menu, MenuItem} from "@material-ui/core";
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';
import * as EmailValidator from 'email-validator';
import {useState} from "react";
import {auth, db} from "../firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import {useCollection} from "react-firebase-hooks/firestore";
import Chat from "./Chat";

const Sidebar = () => {
    const [user] = useAuthState(auth)
    const userChatRef = db.collection('chats').where('users', 'array-contains', user.email)
    const [chatSnapshot] = useCollection(userChatRef)

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClickUserAvatar = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handleCloseUserAvatar = () => {
        setAnchorEl(null);
    }

    const handleUserAvatarLogout = () => {
        setAnchorEl(null);
        auth.signOut();
    }

    const createChat = () => {
        const input = prompt("Please enter an email address for the user you wish to chat with")

        if (!input) return;

        if (EmailValidator.validate(input) && !chatAlreadyExists(input) && input !== user.email) {
            db.collection('chats').add({
                users: [user.email, input]
            });
        }
    }

    const chatAlreadyExists = (recipientEmail) =>
        !!chatSnapshot?.docs.find(chat => chat.data().users.find(user => user === recipientEmail)?.length > 0)


    return (
        <Container>
            <Header>
                <UserAvatar src={user.photoURL} aria-controls="simple-menu" aria-haspopup="true" onClick={handleClickUserAvatar}/>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleCloseUserAvatar}
                >
                    <MenuItem onClick={handleCloseUserAvatar}>Profile</MenuItem>
                    <MenuItem onClick={handleCloseUserAvatar}>My account</MenuItem>
                    <MenuItem onClick={handleUserAvatarLogout}>Logout</MenuItem>
                </Menu>

                <IconsContainer>
                    <IconButton>
                        <ChatIcon/>
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon/>
                    </IconButton>
                </IconsContainer>
            </Header>

            <Search>
                <SearchIcon/>
                <SearchInput placeholder="Search in chats..."/>
            </Search>

            <SidebarButton onClick={createChat}>Start a new chat</SidebarButton>

            {/* CHATS */}
            {chatSnapshot?.docs.map(chat => <Chat key={chat.id} id={chat.id} users={chat.data().users}/>)}
        </Container>
    );
};

export default Sidebar;

const Container = styled.div``;

const Search = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  border-radius: 2px;
`;

const SearchInput = styled.input`
  outline-width: 0;
  border: none;
  flex: 1;
  font-size: 1rem;
`;

const SidebarButton = styled(Button)`
  width: 100%;
  
  &&& {
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
  }
`;

const Header = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: white;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
`;

const UserAvatar = styled(Avatar)`
  cursor: pointer;

  :hover {
    opacity: .8;
  }
`;

const IconsContainer = styled.div`

`;