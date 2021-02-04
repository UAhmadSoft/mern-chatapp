import Box from '@material-ui/core/Box';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';

const useStyles = makeStyles((theme) => ({
	root: {
		minHeight: '100vh',
		'& .MuiInput-underline:before': {
			borderBottom: '1.2px solid rgba(0, 0, 0, 0.2)'
		}
	},
	heroText: {
		textAlign: 'center',
		color: theme.palette.background.default,
		marginTop: 30,
		maxWidth: 300
	},
	overlay: {
		backgroundImage: 'linear-gradient(180deg, rgb(58,141,255, 0.75) 0%, rgb(134,185,255, 0.75) 100%)',
		backgroundSize: 'cover',
		backgroundPosition: 'center',
		flexDirection: 'column',
		minHeight: '100vh',
		paddingBottom: 145,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	},
	image: {
		backgroundImage: 'url(https://res.cloudinary.com/dna1o7hrm/image/upload/v1612406581/xx6gk8ptlz7hfbtf6wno.png)',
		backgroundRepeat: 'no-repeat',
		backgroundSize: 'cover',
		backgroundPosition: 'center'
	}
}));

export default function Authorization({ children }) {
	const classes = useStyles();

	return (
		<Grid container component="main" className={classes.root}>
			<CssBaseline />
			<Grid item xs={false} sm={4} md={5} className={classes.image}>
				<Box className={classes.overlay}>
					<Hidden xsDown>
						<img
							width={67}
							src="https://res.cloudinary.com/dna1o7hrm/image/upload/v1612406581/r1hhd9ry5wxux0tqhju0.png"
						/>
						<Hidden smDown>
							<Typography className={classes.heroText} variant="h4">
								Converse with anyone with any language
							</Typography>
						</Hidden>
					</Hidden>
				</Box>
			</Grid>
			<Grid item xs={12} sm={8} md={7} elevation={6} component={Paper} square>
				{children}
			</Grid>
		</Grid>
	);
}
