import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { Formik } from 'formik';
import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { useRegister } from '../services/authenticationService';
import LoginLayout from '../layout/LoginLayout';

const useStyles = makeStyles((theme) => ({
	buttonHeader: theme.buttonHeader,
	noAccBtn: theme.noAccBtn,
	welcome: theme.welcome,
	box: theme.box,
	accBtn: {
		width: 170,
		height: 54,
		borderRadius: 5,
		filter: 'drop-shadow(0px 2px 6px rgba(74,106,149,0.2))',
		backgroundColor: theme.palette.background.default,
		color: theme.palette.primary.main,
		boxShadow: 'none',
		marginRight: 35
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(1)
	},
	label: { color: 'rgb(0,0,0,0.4)', paddingLeft: '5px' },
	submit: {
		margin: theme.spacing(3, 2, 2),
		padding: 10,
		width: 160,
		height: 56,
		borderRadius: 3,
		marginTop: 49,
		fontWeight: 'bold'
	},
	inputs: {
		marginTop: '.8rem',
		height: '2rem',
		padding: '5px'
	},
	link: { textDecoration: 'none', display: 'flex', flexWrap: 'nowrap' }
}));

export default function Register() {
	const classes = useStyles();
	const history = useHistory();
	const register = useRegister();

	return (
		<LoginLayout>
			<Box className={classes.buttonHeader}>
				<Box p={1} alignSelf="flex-end" alignItems="center">
					<Link to="/login" className={classes.link}>
						<Button className={classes.noAccBtn}>Already have an account?</Button>
						<Button color="background" className={classes.accBtn} variant="contained">
							Login
						</Button>
					</Link>
				</Box>

				<Box width="100%" maxWidth={450} p={3} alignSelf="center">
					<Grid container>
						<Grid item xs>
							<Typography className={classes.welcome} variant="h4">
								Create an account
							</Typography>
						</Grid>
					</Grid>
					<Formik
						initialValues={{
							username: '',
							email: '',
							password: ''
						}}
						validationSchema={Yup.object().shape({
							username: Yup.string().required('Username is required').max(40, 'Username is too long'),
							email: Yup.string().required('Email is required').email('Email is not valid'),
							password: Yup.string()
								.required('Password is required')
								.max(100, 'Password is too long')
								.min(6, 'Password too short')
						})}
						onSubmit={({ username, email, password }, { setStatus, setSubmitting }) => {
							setStatus();
							username = username.toLowerCase();
							register(username, email, password).then(
								(user) => {
									history.push('/');
								},
								(error) => {
									console.log('error', error);
									setSubmitting(false);
									setStatus(error);
								}
							);
						}}
					>
						{({ handleSubmit, handleChange, values, touched, errors }) => (
							<form onSubmit={handleSubmit} className={classes.form} noValidate>
								<TextField
									id="username"
									label={
										<Typography className={classes.label} variant="subtitle1">
											Username
										</Typography>
									}
									fullWidth
									margin="normal"
									InputLabelProps={{
										shrink: true
									}}
									InputProps={{ classes: { input: classes.inputs } }}
									name="username"
									autoComplete="username"
									autoFocus
									helperText={touched.username ? errors.username : ''}
									error={touched.username && Boolean(errors.username)}
									value={values.username}
									onChange={handleChange}
								/>
								<TextField
									id="email"
									label={
										<Typography className={classes.label} variant="subtitle1">
											E-mail address
										</Typography>
									}
									fullWidth
									margin="normal"
									InputLabelProps={{
										shrink: true
									}}
									InputProps={{ classes: { input: classes.inputs } }}
									name="email"
									autoComplete="email"
									helperText={touched.email ? errors.email : ''}
									error={touched.email && Boolean(errors.email)}
									value={values.email}
									onChange={handleChange}
								/>
								<TextField
									id="password"
									label={
										<Typography className={classes.label} variant="subtitle1">
											Password
										</Typography>
									}
									fullWidth
									margin="normal"
									InputLabelProps={{
										shrink: true
									}}
									InputProps={{
										classes: { input: classes.inputs }
									}}
									type="password"
									autoComplete="current-password"
									helperText={touched.password ? errors.password : ''}
									error={touched.password && Boolean(errors.password)}
									value={values.password}
									onChange={handleChange}
								/>

								<Box textAlign="center">
									<Button
										type="submit"
										size="large"
										variant="contained"
										color="primary"
										className={classes.submit}
									>
										Create
									</Button>
								</Box>
							</form>
						)}
					</Formik>
				</Box>
				<Box p={1} alignSelf="center" />
			</Box>
		</LoginLayout>
	);
}
