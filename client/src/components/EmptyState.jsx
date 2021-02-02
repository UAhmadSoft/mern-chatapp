import React from 'react';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import commonUtilities from '../utilities/common';

const useStyles = makeStyles((theme) => ({
	avatar: {
		width: 200,
		fontSize: 20,
		height: 200,
		marginBottom: 20,
		marginTop: 50
	},
	intials: {
		textTransform: 'uppercase',
		fontWeight: 600
	}
}));

export default function EmptyState({ conversation, currentUser }) {
	const classes = useStyles();

	return (
		<Grid container spacing={0} direction="column" alignItems="center" justify="center">
			{conversation.users && (
				<React.Fragment>
					<Grid item>
						{/* <img src="/Images/emptyImg.svg" /> */}
						<Avatar
							className={classes.avatar}
							style={{
								fontWeight: 'bold',
								backgroundColor:
									'#' +
									commonUtilities.intToRGB(
										commonUtilities.hashCode(
											conversation.users.filter((user) => user._id !== currentUser._id)[0]
												.username
										)
									)
							}}
						>
							<Typography variant="h1" className={classes.initials}>
								{conversation.users
									.filter((user) => user._id !== currentUser._id)[0]
									.username.slice(0, 2)}
							</Typography>
						</Avatar>
					</Grid>
					<Typography variant="h4" className={classes.emptyHeader}>
						{conversation.users.filter((user) => user._id !== currentUser._id)[0].username}
					</Typography>
					{/* <Typography variant="h6">Select a friend or contact to start chatting.</Typography> */}
				</React.Fragment>
			)}
		</Grid>
	);
}
