import React, { useState,  useRef , useEffect } from 'react';
import io from 'socket.io-client'; 

import axios from 'axios';
import '../../style/messages.css';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UsergroupAddOutlined,
  UserOutlined,
  CommentOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, theme } from 'antd';
import Box from '@mui/joy/Box';
import FormControl from '@mui/joy/FormControl';
import Textarea from '@mui/joy/Textarea';
import { IconButton, Stack } from '@mui/joy';
import FormatBoldRoundedIcon from '@mui/icons-material/FormatBoldRounded';
import FormatItalicRoundedIcon from '@mui/icons-material/FormatItalicRounded';
import StrikethroughSRoundedIcon from '@mui/icons-material/StrikethroughSRounded';
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import Avatar from '@mui/joy/Avatar';
import Chip from '@mui/joy/Chip';
import Typography from '@mui/joy/Typography';
import CircleIcon from '@mui/icons-material/Circle';
import PhoneInTalkRoundedIcon from '@mui/icons-material/PhoneInTalkRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import Nav from '../nav'


const { Sider, Content } = Layout;

function Chat() {
  const [collapsed, setCollapsed] = useState(false);
  const { token } = theme.useToken();

  const [messages, setMessages] = useState([]);
  const [conversationMessages, setConversationMessages] = useState([]);
  const [selectedRecipientId, setSelectedRecipientId] = useState(null);
  const [selectedRecipientNom, setSelectedRecipientNom] = useState(null);
  const [selectedRecipientPrenom, setSelectedRecipientPrenom] = useState(null);
  const [selectedRecipientImage, setSelectedRecipientImage] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);


  // Utilisez socketRef pour gérer l'état de la connexion WebSocket

useEffect(() => {
  const socket = io('http://localhost:4001');
  socketRef.current = socket;
  socket.on('message', (newMessage) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  });
  const lastMessage = conversationMessages[conversationMessages.length - 1];
  if (lastMessage && lastMessage.sender && lastMessage.sender.id === selectedRecipientId) {
    console.log('Message reçu par l\'autre utilisateur :', lastMessage.contenu);
  }
  return () => {
    socket.disconnect();
  };
}, [conversationMessages, selectedRecipientId]);
  useEffect(() => {
    if (socket) {
      socket.on('sendMessage', (data) => {
        setConversationMessages((prevMessages) => [...prevMessages, data]);
      });
    }
  }, [socket]);
  
  
  const sendMessage = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:4001/messages/send/${selectedRecipientId}`,
        { contenu: newMessage },
        { headers: { Authorization: ` ${token}` } }
      );
      setConversationMessages([...conversationMessages, response.data]);
      setNewMessage('');
      fetchMessages();
      handleRecipientClick(selectedRecipientId, selectedRecipientNom, selectedRecipientImage);
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
    }
  };
  
  

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:4001/messages/all?order_by=-createdAt', {
        headers: {
          Authorization: ` ${token}`,
        },
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleRecipientClick = async (recipientId, recipientNom, recipientPrenom, recipientImage) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:4001/messages/get/${recipientId}`, {
        headers: {
          Authorization: ` ${token}`,
        },
      });
      setConversationMessages(response.data);
      setSelectedRecipientId(recipientId);
      setSelectedRecipientNom(recipientNom);
      setSelectedRecipientPrenom(recipientPrenom);
      setSelectedRecipientImage(recipientImage);
      fetchMessages();
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

 


  const messagesEndRef = useRef(null);

  // Scroll to bottom on initial render and when conversationMessages change
  useEffect(() => {
    scrollToBottom();
  }, [conversationMessages]);

  // Function to scroll to the bottom of the messages container
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Function to handle scroll event
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    // When user scrolls to the top, load more messages if available
   // if (scrollTop === 0 && conversationMessages.length < totalMessages) {
      // Call function to load more messages
    //  loadMoreMessages();
   // }
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    const formattedDate = date.toLocaleDateString('fr-FR', options);
    return formattedDate.replace(',', ' à');
  };

  return (
  
            <div style={{ display: 'flex', marginTop: -70 }}>
  
    <Layout style={{ marginRight: 1600, background: 'rgba(0, 0, 0, 0)'  }}>
    
      <Sider trigger={null} collapsible collapsed={collapsed} style={{ height: 700  }}>
        <Menu
          style={{ marginTop: 60 , borderRadius: 30 }}
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            { key: '1', icon: <CommentOutlined />, label: 'Tous' },
            { key: '2', icon: <UserOutlined />, label: 'personnel' },
            { key: '3', icon: <UsergroupAddOutlined />, label: 'Groupe' },
            { key: '4', icon: <PlusCircleOutlined />, label: 'Nouveau Groupe' },
            

          ]}
        />
      </Sider>
      <Layout>
     
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{ fontSize: '16px', width: 64, height: 64, top: 40 }}
        />
        <Content>
       
        <Box sx={{ backgroundColor: 'white', borderRadius: '0 30px 30px 0', width: 400 , height: 700 }}>
    <div className='sideMessage'>
      <div className="projects-section-header">
        <p className='messagetitre'>Messages </p>
        <div className="inputBox_container">
          <svg className="search_icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" alt="search icon">
            <path d="M46.599 46.599a4.498 4.498 0 0 1-6.363 0l-7.941-7.941C29.028 40.749 25.167 42 21 42 9.402 42 0 32.598 0 21S9.402 0 21 0s21 9.402 21 21c0 4.167-1.251 8.028-3.342 11.295l7.941 7.941a4.498 4.498 0 0 1 0 6.363zM21 6C12.717 6 6 12.714 6 21s6.717 15 15 15c8.286 0 15-6.714 15-15S29.286 6 21 6z">
            </path>
          </svg>
          <input className="inputBox" id="inputBox" type="text" placeholder="Chercher ..."/>
        </div>
      </div>
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className="message-boxSide" onClick={() => handleRecipientClick(message.user.id, message.user.nom, message.user.prenom , message.user.image)}>
            {message.user && (
              <img src={message.user.image} alt="profile"/>
            )}
           <div className="message-content">
  <div className="message-header">
  <div className="name-time-container">
      <div className="name">{message.user && message.user.nom} {message.user && message.user.prenom}</div>
      <div className='time'>
        {message.messages && message.messages.length > 0 ? (
          <p className="message-lineTime">
            {formatDate(message.messages[message.messages.length - 1].createdAt)}
          </p>
        ) : null}
      </div>
    </div>
    <div className="role">{message.user && message.user.role}</div>
    {message.messages && message.messages.length > 0 ? (
      <div className="time-container">
       <p className="message-line" style={{ width:300 , whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {message.messages[message.messages.length - 1].contenu}
       </p>

      </div>
    ) : (
      <p className="message-line">No messages yet</p>
    )}
    
  </div>
</div>

          </div>
        ))}
      </div>
    </div>
    <div className='personneMessage'>
            <Stack
  direction="row"
  justifyContent="space-between"
  sx={{
    borderBottom: '1px solid',
    borderColor: 'divider',
    backgroundColor: 'background.body',
    borderRadius: 30
  }}
  py={{ xs: 2, md: 2 }}
  px={{ xs: 1, md: 2 }}
>
  {selectedRecipientId && (
    <Stack direction="row" spacing={{ xs: 1, md: 2 }} alignItems="center">
      {selectedRecipientImage && (
        <Avatar size="lg" src={selectedRecipientImage} />
      )}
      <div>
        <Typography
          fontWeight="lg"
          fontSize="lg"
          component="h2"
          noWrap
          endDecorator={
            <Chip
              variant="outlined"
              size="sm"
              color="neutral"
              sx={{
                borderRadius: 'sm',
              }}
              startDecorator={
                <CircleIcon sx={{ fontSize: 8 }} color="success" />
              }
              slotProps={{ root: { component: 'span' } }}
            >
              Online
            </Chip>
          }
        >
          {selectedRecipientNom}   {selectedRecipientPrenom}

        </Typography>
      </div>
    </Stack>
  )}
  <Stack spacing={1} direction="row" alignItems="center">
    <Button
      startDecorator={<PhoneInTalkRoundedIcon />}
      color="neutral"
      variant="outlined"
      size="sm"
      sx={{
        display: { xs: 'none', md: 'inline-flex' },
      }}
    >
      Call
    </Button>
    <Button
      color="neutral"
      variant="outlined"
      size="sm"
      sx={{
        display: { xs: 'none', md: 'inline-flex' },
      }}
    >
      View profile
    </Button>
    <IconButton size="sm" variant="plain" color="neutral">
      <MoreVertRoundedIcon />
    </IconButton>
  </Stack>
</Stack>
<div className='bodymessages' style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {conversationMessages.map((message, index) => (
          <div key={index} className={message.sender && message.sender.id === selectedRecipientId ? 'message-box received' : 'message-box sent'}>
            {message.sender && message.sender.id === selectedRecipientId && message.sender.image && (
              <img src={message.sender.image} alt="profile image" className="profile-image" />
            )}
            <div className="message-content">
              <div className="message-header">
                <div className="name-time-container">
                  <div className="name">
                    {message.sender && message.sender.id === selectedRecipientId ? `${message.sender.nom} ${message.sender.prenom}` : 'Vous'}
                  </div>
                  <div className='time'>
                    {formatDate(message.createdAt)}
                  </div>
                </div>
              </div>
              <div className="content" style={{ wordWrap: 'break-word' }}>
                {message.contenu}
              </div>
            </div>
          </div>
        ))}
      <div ref={messagesEndRef}></div>
    </div>




            <div  >
            <Box sx={{ px: 2, pb: 3 }}>
      <FormControl>
        <Textarea
          placeholder="Entrez votre message..."
          aria-label="Message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          minRows={3}
          maxRows={10}
          endDecorator={
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              flexGrow={1}
              sx={{
                py: 1,
                pr: 1,
                borderTop: '1px solid',
                borderColor: 'divider',
              }}
            >
              <div>
                <IconButton size="sm" variant="plain" color="neutral">
                  <FormatBoldRoundedIcon />
                </IconButton>
                <IconButton size="sm" variant="plain" color="neutral">
                  <FormatItalicRoundedIcon />
                </IconButton>
                <IconButton size="sm" variant="plain" color="neutral">
                  <StrikethroughSRoundedIcon />
                </IconButton>
                <IconButton size="sm" variant="plain" color="neutral">
                  <FormatListBulletedRoundedIcon />
                </IconButton>
              </div>
              <Button
                type="submit"
                onClick={sendMessage}
                size="sm"
                color="primary"
                sx={{ alignSelf: 'center', borderRadius: 'sm' }}
                disabled={!selectedRecipientId}
              >
                Envoyer
              </Button>
            </Stack>
          }
          onKeyDown={(event) => {
            if (event.key === 'Enter' && event.shiftKey) {
              event.preventDefault();
              sendMessage();
            }
          }}
          sx={{
            '& textarea:first-of-type': {
              minHeight: 40,
            },
          }}
        />
      </FormControl>
    </Box>
            </div>
          </div> 
  </Box>

        </Content>

      </Layout>

    </Layout>

    </div>

  );
}

export default Chat;
