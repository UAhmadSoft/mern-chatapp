import CircularProgress from '@material-ui/core/CircularProgress';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from 'react';
import ListAvatar from '../components/ListAvatar';
import { useGetActiveChat, useGetChatById, useMarkAsRead, useNotifications } from '../services/chatService';

const useStyles = makeStyles((theme) => ({
	spinner: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 12
	},
	listItem: {
		height: 80,
		filter: 'drop-shadow(0px 2px 5px rgba(88,133,196,0.05))',
		borderRadius: 8,
		marginBottom: 10,
		marginTop: 10
	},
	listContent: {
		marginLeft: 10,
		marginTop: -10
	},
	bottomUserLabel: {
		marginLeft: 10
	},
	notificationCount: {
		backgroundColor: theme.palette.notification.default,
		color: theme.palette.background.default,
		borderRadius: '50%',
		justifyContent: 'center',
		height: 20,
		fontSize: 10,
		fontWeight: 700,
		display: 'flex',
		alignItems: 'center',
		width: 20,
		marginLeft: 40
	}
}));

export default function Conversations({
	newMessage,
	setNewMessage,
	currentUser,
	setConversation,
	conversation,
	connected,
	isOnline,
	typing,
	onlineUsers,
	selected,
	setSelected
}) {
	const classes = useStyles();

	const getActiveUsers = useGetActiveChat();
	const [ conversations, setConversations ] = useState([]);
	const [ notifications, setNotifications ] = useState([]);
	const [ loadingChats, setLoadingChats ] = useState(false);

	const getNotifications = useNotifications();
	const getChatById = useGetChatById();
	const markAsRead = useMarkAsRead();

	const getOnlineUsers = () => {
		setLoadingChats(true);
		getActiveUsers().then((result) => {
			setConversations(result);
			setLoadingChats(false);
		});
	};

	useEffect(
		() => {
			if (!connected) return;
			if (conversation._id) markAsRead(conversation._id);
			getOnlineUsers();
		},
		[ newMessage, setNewMessage, connected ]
	);

	useEffect(
		() => {
			if (!connected) return;
			const updateNotification = async () => {
				getNotifications().then((result) => {
					setNotifications(result);
				});
			};
			updateNotification();
		},
		[ newMessage, conversation, setNewMessage ]
	);

	const clearNotifications = async (convoId) => {
		markAsRead(convoId);
		getChatById(convoId).then((results) => setConversation(results));
	};

	const getNotificationCount = (convoId) => {
		const res = notifications.filter((notification) => notification.entityId === convoId);
		return res.length;
	};

	useEffect(
		() => {
			if (loadingChats) {
				setTimeout(() => {
					setLoadingChats(false);
				}, 2000);
			}
		},
		[ loadingChats ]
	);

	const ConversationListItem = React.memo(({ convo }) => (
		<MenuItem button key={convo._id} className={classes.listItem} selected={selected === convo._id}>
			<ListItem
				style={{ paddingLeft: 5, paddingRight: 5 }}
				onClick={() => {
					setSelected(convo._id);
					clearNotifications(convo._id);
				}}
			>
				<ListAvatar convo={convo} onlineUsers={onlineUsers} currentUser={currentUser} isOnline={isOnline} />
				<ListItemText
					className={classes.listContent}
					primary={
						<Typography style={{ fontWeight: 600 }}>
							{convo.users.filter((user) => user._id !== currentUser._id)[0].username}
						</Typography>
					}
					secondary={
						typing && conversation._id === convo._id ? (
							<div style={{ position: 'absolute' }}>
								<img style={{ width: 40, marginTop: -5 }} src="/images/dots.gif" alt="typing dots" />
							</div>
						) : (
							<span style={{ color: '#9cadc8', position: 'absolute' }}>
								{convo.latestMessage && convo.latestMessage.content}
							</span>
						)
					}
				/>
				{getNotificationCount(convo._id) > 0 &&
				convo._id !== conversation._id && (
					<div className={classes.notificationCount}>{getNotificationCount(convo._id)}</div>
				)}
			</ListItem>
		</MenuItem>
	));

	return (
		<div>
			{conversations.length === 0 ? (
				<div className={classes.spinner}>
					{loadingChats ? <CircularProgress color="primary" /> : <div>Add a new chat</div>}
				</div>
			) : (
				<div>{conversations.map((convo) => <ConversationListItem key={convo._id} convo={convo} />)}</div>
			)}
		</div>
	);
}
