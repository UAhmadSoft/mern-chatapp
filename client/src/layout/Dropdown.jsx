import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import LockIcon from '@material-ui/icons/Lock';
import IconButton from '@material-ui/core/IconButton';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useLogout } from '../services/authenticationService';

const StyledMenu = withStyles({
	paper: {
		border: '1px solid #d3d4d5'
	}
})((props) => (
	<Menu
		elevation={0}
		getContentAnchorEl={null}
		anchorOrigin={{
			vertical: 'bottom',
			horizontal: 'right'
		}}
		transformOrigin={{
			vertical: 'top',
			horizontal: 'right'
		}}
		{...props}
	/>
));

const StyledMenuItem = withStyles((theme) => ({
	root: {
		'& .MuiListItemIcon-root, & .MuiListItemText-primary': {
			minWidth: 30
		},
		'&:focus': {
			'& .MuiListItemIcon-root, & .MuiListItemText-primary': {
				minWidth: 30
			}
		}
	}
}))(MenuItem);

export default function CustomizedMenus({ currentUserId }) {
	const [ anchorEl, setAnchorEl ] = React.useState(null);
	const history = useHistory();
	const logout = useLogout();

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleLogout = async () => {
		logout(currentUserId).then(
			() => {
				history.push('/signup');
				return;
			},
			(error) => {}
		);
	};

	return (
		<div>
			<IconButton aria-controls="customized-menu" aria-haspopup="true" edge="end" onClick={handleClick}>
				<MoreHorizIcon style={{ color: '#95A7C4' }} />
			</IconButton>
			<StyledMenu
				id="customized-menu"
				anchorEl={anchorEl}
				keepMounted
				open={Boolean(anchorEl)}
				onClose={handleClose}
			>
				<StyledMenuItem onClick={handleLogout}>
					<ListItemIcon>
						<LockIcon fontSize="small" />
					</ListItemIcon>
					<ListItemText primary="Logout" />
				</StyledMenuItem>
			</StyledMenu>
		</div>
	);
}
