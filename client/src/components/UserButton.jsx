import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import commonUtilities from '../utilities/common';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Dropdown from '../layout/Dropdown';

const useStyles = makeStyles((theme) => ({
	listItem: {
		height: 80,
		paddingLeft: 10,
		paddingRight: 12,
		filter: 'drop-shadow(0px 2px 5px rgba(88,133,196,0.05))',
		borderRadius: 8
	},
	avatar: { width: 44, height: 44, textTransform: 'uppercase' },
	userLabel: {
		marginLeft: 10,
		fontWeight: 600
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
			<ListItemAvatar className={classes.avatar}>
				<StyledBadge
					disableGutters
					overlap="circle"
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'right'
					}}
					variant="dot"
					color={online ? '#1CED84' : '#D0DAE9'}
				>
					<Avatar
						className={classes.avatar}
						style={{
							fontWeight: 'bold',
							backgroundColor: '#' + commonUtilities.intToRGB(commonUtilities.hashCode(user.username))
						}}
					>
						{user.username.slice(0, 2)}
					</Avatar>
				</StyledBadge>
			</ListItemAvatar>
			<ListItemText primary={<Typography className={classes.userLabel}>{user.username}</Typography>} />
			{online && <Dropdown currentUserId={currentUser && currentUser._id} />}
		</ListItem>
	);
}
