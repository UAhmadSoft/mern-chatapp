import List from '@material-ui/core/List';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect } from 'react';
import UserButton from '../components/UserButton';
import { useCreateChat } from '../services/chatService';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
	list: {
		marginLeft: 10,
		marginRight: 20
	}
}));

export default function Users({ userList, setConversation, setSelectedTab, setSelected }) {
	const classes = useStyles();
	const createChat = useCreateChat();

	const handleClick = (user) => {
		createChat(user).then((results) => {
			setConversation(results);
			setSelectedTab(0);
			setSelected(results._id);
		});
	};

	return (
		<List className={classes.list}>
			{userList.length === 0 ? (
				<div className={classes.spinner}>
					<CircularProgress color="primary" />
				</div>
			) : (
				<div>{userList.map((user) => <UserButton key={user._id} user={user} handleClick={handleClick} />)}</div>
			)}
		</List>
	);
}
