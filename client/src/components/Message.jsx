import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MUIListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import ListItemText from '@material-ui/core/ListItemText';
import classnames from 'classnames';
import Moment from 'react-moment';

const useStyles = makeStyles((theme) => ({
	userLabel: { marginRight: 5 },
	messageLabel: { color: theme.palette.message.label },
	listItem: {
		display: 'flex',
		width: '100%'
	},
	listItemRight: {
		flexDirection: 'row-reverse'
	},
	avatar: {
		display: 'flex',
		justifyContent: 'center'
	},
	avatarCircle: {
		height: 30,
		width: 30,
		fontSize: 13,
		textTransform: 'uppercase'
	},
	messageBubble: {
		flex: '0 1 auto',
		padding: 10,
		paddingLeft: 20,
		paddingRight: 20,
		border: `1px solid ${theme.palette.background.default}`,
		color: theme.palette.primary.light,
		backgroundImage: theme.palette.message.messageBubbleLeft,
		borderRadius: '0 10px 10px 10px',
		marginTop: 8,
		maxWidth: '40em',
		color: theme.palette.background.default
	},
	messageBubbleRight: {
		backgroundColor: theme.palette.message.bubble,
		backgroundImage: 'none',
		color: theme.palette.message.messageBubbleText,
		fontWeight: 600,
		borderRadius: '10px 10px 0 10px'
	}
}));

const Message = React.memo(({ message, currentUser }) => {
	const classes = useStyles();

	return (
		<MUIListItem
			key={message._id}
			className={classnames(classes.listItem, {
				[`${classes.listItemRight}`]:
					message.sender._id === currentUser._id || message.sender === currentUser._id
			})}
			alignItems="flex-start"
		>
			<div>
				<Typography variant="caption" className={classes.messageLabel}>
					<span
						style={{
							display: 'flex',
							justifyContent:
								(message.sender._id === currentUser._id && 'flex-end') ||
								(message.sender === currentUser._id && 'flex-end')
						}}
					>
						{message.sender._id === currentUser._id ||
							(message.sender !== currentUser._id && (
								<span className={classes.userLabel}>{message.sender.username}</span>
							))}

						<Moment format="h:mm">{message.createdAt}</Moment>
					</span>
				</Typography>
				<ListItemText
					classes={{
						root: classnames(classes.messageBubble, {
							[`${classes.messageBubbleRight}`]:
								message.sender._id === currentUser._id || message.sender === currentUser._id
						})
					}}
					primary={<React.Fragment>{message.content}</React.Fragment>}
				/>
			</div>
		</MUIListItem>
	);
});

export default Message;
