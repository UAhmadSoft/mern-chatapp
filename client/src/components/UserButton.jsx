import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ListAvatar from '../components/ListAvatar';
import Dropdown from '../layout/Dropdown';

const useStyles = makeStyles((theme) => ({
	listItem: {
		height: 80,
		paddingLeft: 10,
		paddingRight: 12,
		filter: 'drop-shadow(0px 2px 5px rgba(88,133,196,0.05))',
		borderRadius: 8
	},
	userLabel: {
		marginLeft: 10,
		fontWeight: 600
	}
}));

export default function UserButton({ user, handleClick, online, currentUser }) {
	const classes = useStyles();

	return (
		<ListItem
			disableGutters
			className={classes.listItem}
			key={user._id}
			onClick={() => {
				if (!online) handleClick(user);
			}}
			button={!online}
		>
			<ListAvatar user={user} currentUser={currentUser} online={online} />

			<ListItemText primary={<Typography className={classes.userLabel}>{user.username}</Typography>} />
			{online && <Dropdown currentUserId={currentUser && currentUser._id} />}
		</ListItem>
	);
}
