import React, { useEffect, useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Dropdown from '../layout/Dropdown';
import Conversations from '../components/Conversations';
import UserButton from '../components/UserButton';
import Search from '../components/Search';
import Users from '../components/Users';
import Chat from '../components/Chat';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ForumIcon from '@material-ui/icons/Forum';
import MenuIcon from '@material-ui/icons/Menu';

const drawerWidth = 350;

const useStyles = makeStyles((theme) => ({
	root: {
		'& .MuiDrawer-paperAnchorDockedLeft': {
			borderRight: 'none'
		},
		display: 'flex',
		borderRight: 'none'
	},
	drawer: {
		[theme.breakpoints.up('sm')]: {
			width: drawerWidth,
			flexShrink: 0
		}
	},
	appBar: {
		height: 89,
		display: 'flex',
		justifyContent: 'center',
		backgroundColor: theme.palette.background.default,
		color: theme.palette.primary.black,
		filter: 'drop-shadow(0px 2px 10px rgba(88,133,196,0.1))',
		boxShadow: 'none',
		[theme.breakpoints.up('sm')]: {
			width: `calc(100% - ${drawerWidth + 25}px)`,
			marginLeft: drawerWidth
		}
	},
	chatHeader: {
		fontWeight: 600,
		paddingBottom: 15,
		marginTop: 10
	},
	chatTitle: {
		fontWeight: 600
	},
	menuButton: {
		marginRight: theme.spacing(2),
		[theme.breakpoints.up('sm')]: {
			display: 'none'
		}
	},
	menuHeader: {
		paddingLeft: 20,
		paddingRight: 20,
		marginBottom: 5,
		marginTop: 5
	},
	// necessary for content to be below app bar
	toolbar: theme.mixins.toolbar,
	toolbar: {
		display: 'flex',
		justifyContent: 'space-between',
		marginRight: 19
	},
	drawerPaper: {
		width: drawerWidth
	},
	content: {
		flexGrow: 1
	},
	sidebarWrapper: {
		position: 'relative',
		height: '100vh',
		overflow: 'auto',
		zIndex: '4',
		paddingLeft: 20,
		paddingRight: 20,
		overflowScrolling: 'touch'
	},
	onlineLabel: {
		color: theme.palette.primary.gray
	},
	topBarContent: {
		display: 'flex',
		alignItems: 'baseline',
		marginLeft: 10
	},
	toolbarContent: {
		display: 'flex',
		justifyContent: 'space-between',
		width: '100%',
		alignItems: 'center'
	},
	onlineIcon: {
		backgroundColor: theme.palette.icon.online,
		fontSize: 13,
		marginRight: 5,
		width: 8,
		height: 8,
		borderRadius: 4,
		marginLeft: 20
	},
	paper: {
		filter: 'drop-shadow(0px 2px 10px rgba(88,133,196,0.1))',
		borderRadius: 0
	}
}));

function Sidebar({
	userList,
	setUserList,
	conversation,
	setConversation,
	activeChats,
	setActiveChats,
	currentUser,
	newMessage,
	setNewMessage,
	connected,
	onlineUsers,
	isOnline,
	typing,
	setOnlineUsers,
	setTyping,
	selected,
	setSelected,
	socket
}) {
	const { window } = {
		userList,
		setUserList,
		conversation,
		setConversation,
		activeChats,
		setActiveChats,
		currentUser,
		newMessage,
		setNewMessage,
		connected,
		onlineUsers,
		isOnline,
		typing,
		setOnlineUsers,
		setTyping,
		selected,
		setSelected,
		socket
	};
	const classes = useStyles();
	const theme = useTheme();

	const [ mobileOpen, setMobileOpen ] = useState(false);
	const [ selectedTab, setSelectedTab ] = useState(0);

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	const handleChange = (event, newValue) => {
		setSelectedTab(newValue);
	};

	const drawer = (
		<div className={classes.menuHeader}>
			{currentUser && <UserButton user={currentUser} online={true} />}
			<Typography variant="h6" className={classes.chatHeader}>
				Chats
			</Typography>
			<Search setUserList={setUserList} onlineUsers={onlineUsers} />
		</div>
	);

	const drawerContent = (
		<div className={classes.sidebarWrapper}>
			{selectedTab === 0 ? (
				<Conversations
					setConversation={setConversation}
					conversation={conversation}
					newMessage={newMessage}
					setNewMessage={setNewMessage}
					socket={socket}
					currentUser={currentUser}
					connected={connected}
					setOnlineUsers={setOnlineUsers}
					onlineUsers={onlineUsers}
					isOnline={isOnline}
					typing={typing}
					setTyping={setTyping}
					selected={selected}
					setSelected={setSelected}
				/>
			) : (
				<Users
					userList={userList}
					setUserList={setUserList}
					setConversation={setConversation}
					conversation={conversation}
					currentUser={currentUser}
					setSelectedTab={setSelectedTab}
					socket={socket}
					selected={selected}
					setSelected={setSelected}
				/>
			)}
		</div>
	);

	const bottomTabs = (
		<Paper className={classes.paper}>
			<Tabs
				value={selectedTab}
				onChange={handleChange}
				variant="fullWidth"
				indicatorColor="primary"
				textColor="primary"
				aria-label="icon tabs example"
			>
				<Tab icon={<ForumIcon />} aria-label="phone" />
				<Tab icon={<AccountCircleIcon />} aria-label="phone" />
			</Tabs>
		</Paper>
	);

	const container = window !== undefined ? () => window().document.body : undefined;

	return (
		<React.Fragment>
			<div className={classes.root}>
				<CssBaseline />
				<AppBar position="fixed" className={classes.appBar}>
					<Toolbar className={classes.toolbar}>
						<IconButton
							color="inherit"
							aria-label="open drawer"
							edge="start"
							onClick={handleDrawerToggle}
							className={classes.menuButton}
						>
							<MenuIcon />
						</IconButton>
						<div className={classes.toolbarContent}>
							{conversation.users && (
								<div className={classes.topBarContent}>
									{conversation.users && (
										<Typography variant="h6" className={classes.chatTitle}>
											{
												conversation.users.filter((user) => user._id !== currentUser._id)[0]
													.username
											}
										</Typography>
									)}

									{isOnline(onlineUsers, conversation.users) && (
										<React.Fragment>
											<div className={classes.onlineIcon} />
											<Typography variant="caption" className={classes.onlineLabel}>
												Online
											</Typography>
										</React.Fragment>
									)}
								</div>
							)}
							{!conversation.users && (
								<Typography variant="h6" className={classes.chatTitle}>
									Welcome to Steve Messenger
								</Typography>
							)}
							<Dropdown currentUserId={currentUser && currentUser._id} />
						</div>
					</Toolbar>
				</AppBar>
				<nav className={classes.drawer} aria-label="chats">
					<Hidden smUp implementation="css">
						<Drawer
							container={container}
							variant="temporary"
							anchor={theme.direction === 'rtl' ? 'right' : 'left'}
							open={mobileOpen}
							onClose={handleDrawerToggle}
							classes={{
								paper: classes.drawerPaper
							}}
							ModalProps={{
								keepMounted: true
							}}
						>
							{drawer}
							{drawerContent}
							{bottomTabs}
						</Drawer>
					</Hidden>
					<Hidden xsDown implementation="css">
						<Drawer
							classes={{
								paper: classes.drawerPaper
							}}
							variant="permanent"
							open
						>
							{drawer}
							{drawerContent}
							{bottomTabs}
						</Drawer>
					</Hidden>
				</nav>
				<main className={classes.content} style={{ overflowY: 'hidden' }}>
					<Chat
						conversation={setConversation}
						currentUser={currentUser}
						conversation={conversation}
						socket={socket}
						connected={connected}
						newMessage={newMessage}
						setNewMessage={setNewMessage}
						typing={typing}
						setTyping={setTyping}
					/>
				</main>
			</div>
		</React.Fragment>
	);
}

export default Sidebar;
