import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import EmptyState from '../components/EmptyState';
import Message from '../components/Message';
import { useSendMessage, useGetMessages } from '../services/chatService';

const useStyles = makeStyles((theme) => ({
	root: {
		'& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
			borderColor: theme.palette.background.default
		},
		'& .Mui-focused .MuiOutlinedInput-notchedOutline': {
			border: `1px solid ${theme.palette.background.default}`
		},
		overflowY: 'hidden'
	},
	chatContainer: {
		display: 'flex',
		flexDirection: 'column',
		height: '100vh'
	},
	contentHolder: {
		flex: 1,
		overflowY: 'auto'
	},
	messageContainer: {
		height: '100%',
		display: 'flex',
		flexDirection: 'column-reverse',
		overflowY: 'auto'
	},
	messagesArea: {
		paddingLeft: 30,
		paddingRight: 30,
		[theme.breakpoints.up('sm')]: {
			paddingLeft: 100
		}
	},
	messageList: {
		width: '100%',
		paddingRight: 30,
		paddingLeft: 30,
		marginBottom: 15,
		[theme.breakpoints.up('lg')]: {
			paddingLeft: 40
		}
	},
	inputRow: {
		background: theme.palette.background.default,
		paddingBottom: 35,
		position: 'sticky',
		paddingTop: 5,
		bottom: 0,
		paddingLeft: 45,
		paddingRight: 45,
		width: '100%',
		[theme.breakpoints.up('lg')]: {
			paddingLeft: 65
		}
	},
	recordIcon: { marginRight: 12 },
	listItem: {
		display: 'flex',
		width: '100%'
	},
	listItemRight: {
		flexDirection: 'row-reverse'
	},
	messageInput: {
		height: 70,
		marginBottom: 35,
		borderRadius: 8,
		backgroundColor: theme.palette.message.bubble,
		display: 'flex',
		paddingLeft: 20,
		alignItems: 'center'
	},
	userLabel: { marginRight: 5 },
	messageIcons: {
		display: 'flex',
		color: theme.palette.icon.default,
		marginRight: 10
	},
	spacerBottom: {
		height: 120
	},
	dots: {
		paddingLeft: 10,
		paddingRight: 20,
		width: 80,
		marginLeft: 47,
		paddingTop: 6,
		marginBottom: 36,
		backgroundImage: theme.palette.message.messageBubbleLeft,
		borderRadius: '0 10px 10px 10px'
	},
	nowTyping: {
		width: 40,
		marginLeft: 10
	}
}));

export default function Chat({
	conversation,
	currentUser,
	socket,
	connected,
	newMessage,
	setNewMessage,
	typing,
	setTyping
}) {
	const classes = useStyles();

	const [ content, setContent ] = useState('');
	const [ messages, setMessages ] = useState([]);
	const [ loading, setLoading ] = useState('');

	let chatBottom = useRef(null);

	const sendMessage = useSendMessage();
	const getMessages = useGetMessages();

	useEffect(
		() => {
			if (!connected) return;
			socket.emit('join room', conversation._id);
			socket.on('typing', () => setTyping(true));
			socket.on('stop typing', () => setTyping(false));

			return () => {
				socket.off();
			};
		},
		[ connected, socket ]
	);

	useEffect(
		() => {
			const timeoutId = setTimeout(() => socket.emit('stop typing', conversation._id), 500);
			return () => clearTimeout(timeoutId);
		},
		[ content ]
	);

	useEffect(() => {
		socket.on('message received', (newMessage) => {
			setNewMessage(newMessage);
		});
	}, []);

	useEffect(
		() => {
			reloadMessages();
		},
		[ conversation._id ]
	);

	useEffect(
		() => {
			if (conversation._id && newMessage.chat === conversation._id) {
				setMessages([ ...messages, newMessage ]);
			}
		},
		[ newMessage ]
	);

	useEffect(
		() => {
			scrollToBottom('auto');
		},
		[ messages ]
	);

	const reloadMessages = () => {
		if (conversation._id) {
			setLoading(true);
			getMessages(conversation._id)
				.then((result) => {
					setMessages(result);
					setLoading(false);
				})
				.then(() => {
					scrollToBottom('auto');
				});
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (content !== '') {
			sendMessage(conversation._id, content).then((res) => {
				setContent('');
			});
		}
		socket.emit('stop typing', conversation._id);
	};

	const updateTyping = (e) => {
		setContent(e.target.value);
		socket.emit('typing', conversation._id);
	};

	const scrollToBottom = (type) => {
		if (chatBottom && chatBottom.current) {
			chatBottom.current.scrollIntoView({ behavior: type });
		}
	};

	return (
		<div className={classes.chatContainer}>
			<div style={{ height: 130 }} />
			{messages.length === 0 && !loading && <EmptyState conversation={conversation} currentUser={currentUser} />}
			<div className={classes.contentHolder}>
				<Grid container className={classes.messageContainer}>
					<List className={classes.messageList}>
						{!loading && messages.map((message) => <Message message={message} currentUser={currentUser} />)}
					</List>
					<div ref={chatBottom} />
				</Grid>
			</div>
			{typing &&
			conversation._id && (
				<div className={classes.dots}>
					<img
						className={classes.nowTyping}
						src="https://res.cloudinary.com/dna1o7hrm/image/upload/v1612406581/o8wm8wiaajskpnchmtiy.gif"
						alt="typing dots"
					/>
				</div>
			)}

			<BottomNavigation style={{ height: 70 }}>
				<div className={classes.inputRow}>
					<form onSubmit={handleSubmit} className={classes.form}>
						<TextField
							id="message"
							placeholder="Type something..."
							variant="outlined"
							fullWidth
							value={content}
							autoComplete="off"
							InputProps={{
								className: classes.messageInput,
								disableunderline: 'true',
								endAdornment: (
									<div className={classes.messageIcons}>
										<FiberManualRecordIcon className={classes.recordIcon} />
										<FileCopyIcon />
									</div>
								)
							}}
							onChange={(event) => updateTyping(event)}
						/>
					</form>
				</div>
			</BottomNavigation>
		</div>
	);
}
