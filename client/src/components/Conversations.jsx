import React, { useEffect, useState } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import commonUtilities from '../utilities/common';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import CircularProgress from '@material-ui/core/CircularProgress';

import { useGetActiveChat, useGetChatById, useNotifications, useMarkAsRead } from '../services/chatService';

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
	avatar: { width: 44, height: 44, textTransform: 'uppercase', alignItems: 'center' },
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

const StyledBadge = withStyles((theme) => ({
	badge: {
		backgroundColor: (props) => props.color,
		color: (props) => props.color,
		boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
		'&::after': {
			position: 'absolute',
			top: 0,
			left: 0,
			width: '100%',
			height: '100%',
			borderRadius: '50%',
			border: '1px solid currentColor',
			content: '""'
		}
	}
}))(Badge);

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
				<ListItemAvatar className={classes.avatar}>
					<StyledBadge
						overlap="circle"
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'right'
						}}
						variant="dot"
						color={isOnline(onlineUsers, convo.users) ? '#1CED84' : '#D0DAE9'}
					>
						<Avatar
							className={classes.avatar}
							style={{
								fontWeight: 'bold',
								backgroundColor:
									'#' +
									commonUtilities.intToRGB(
										commonUtilities.hashCode(
											convo.users.filter((user) => user._id !== currentUser._id)[0].username
										)
									)
							}}
						>
							{convo.users.filter((user) => user._id !== currentUser._id)[0].username.slice(0, 2)}
						</Avatar>
					</StyledBadge>
				</ListItemAvatar>
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
