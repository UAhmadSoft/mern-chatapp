import React from 'react';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import commonUtilities from '../utilities/common';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';

const useStyles = makeStyles((theme) => ({
	avatar: { width: 44, height: 44, textTransform: 'uppercase', alignItems: 'center' }
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

export default function ListAvatar({ convo, onlineUsers, currentUser, isOnline, user, online }) {
	const classes = useStyles();

	return (
		<ListItemAvatar className={classes.avatar}>
			<StyledBadge
				overlap="circle"
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right'
				}}
				variant="dot"
				color={convo ? isOnline(onlineUsers, convo.users) ? '#1CED84' : '#D0DAE9' : online && '#1CED84'}
			>
				<Avatar
					className={classes.avatar}
					style={{
						fontWeight: 'bold',
						backgroundColor:
							'#' +
							commonUtilities.intToRGB(
								commonUtilities.hashCode(
									(convo && convo.users.filter((user) => user._id !== currentUser._id)[0].username) ||
										user.username
								)
							)
					}}
				>
					{(convo && convo.users.filter((user) => user._id !== currentUser._id)[0].username.slice(0, 2)) ||
						user.username.slice(0, 2)}
				</Avatar>
			</StyledBadge>
		</ListItemAvatar>
	);
}
