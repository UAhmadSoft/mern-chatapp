import React, { useEffect, useState } from 'react';
import { useIsLoggedIn } from '../services/authenticationService';

import Sidebar from '../layout/Sidebar';
import { useHistory } from 'react-router-dom';
import socketIOClient from 'socket.io-client';

export default function Home() {
	const [ currentUser, setCurrentUser ] = useState(null);
	const [ conversation, setConversation ] = useState({});
	const [ connected, setConnected ] = useState(false);
	const [ userList, setUserList ] = useState([]);
	const [ newMessage, setNewMessage ] = useState({});
	const [ onlineUsers, setOnlineUsers ] = useState(null);
	const [ typing, setTyping ] = useState(false);
	const [ selected, setSelected ] = useState();

	const socket = socketIOClient('https://mern-signal-chat.herokuapp.com/', {
		transports: [ 'websocket', 'polling', 'flashsocket' ],
		reconnection: true,
		reconnectionDelay: 3000,
		reconnectionAttempts: 20
	});

	const isLoggedIn = useIsLoggedIn();
	const history = useHistory();

	useEffect(() => {
		const checkLoggedIn = async () => {
			const status = await isLoggedIn();

			if (status && status.loggedIn) {
				setCurrentUser(status.user);
			} else {
				history.push('/signup');
			}
		};
		checkLoggedIn();
	}, []);

	useEffect(
		() => {
			if (currentUser) {
				socket.emit('setup', currentUser);
				socket.on('connected', (data) => {
					setConnected(true);
				});
			}
		},
		[ currentUser ]
	);

	const isOnline = (onlineUsers, convUsers) => {
		let notCurrentUsers = convUsers.filter((user) => user._id !== currentUser._id);
		let conversationsUsers = notCurrentUsers.map((user) => user._id)[0];

		for (let user in onlineUsers) {
			if (onlineUsers[user][1] === conversationsUsers) return true;
		}
	};

	useEffect(() => {
		socket.on('online', (data) => {
			setOnlineUsers(data._data);
		});
		socket.on('offline', (data) => {
			setOnlineUsers(data._data);
		});
	}, []);

	return (
		<div>
			{currentUser && (
				<Sidebar
					setUserList={setUserList}
					userList={userList}
					conversation={conversation}
					setConversation={setConversation}
					currentUser={currentUser}
					socket={socket}
					connected={connected}
					newMessage={newMessage}
					setNewMessage={setNewMessage}
					setOnlineUsers={setOnlineUsers}
					onlineUsers={onlineUsers}
					isOnline={isOnline}
					typing={typing}
					setTyping={setTyping}
					selected={selected}
					setSelected={setSelected}
				/>
			)}
		</div>
	);
}
