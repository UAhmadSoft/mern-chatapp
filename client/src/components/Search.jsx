import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import { useGetUsers, useSearchUsers } from '../services/userService';

const useStyles = makeStyles((theme) => ({
	root: {
		'& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
			borderColor: theme.palette.background.default
		},
		'& .Mui-focused .MuiOutlinedInput-notchedOutline': {
			border: '1px solid white'
		}
	},
	searchInput: {
		height: 50,
		borderRadius: 8,
		backgroundColor: '#e9eef9',
		display: 'flex',
		paddingLeft: 20,
		alignItems: 'center'
	},
	searchIcon: {
		color: '#B1C3DF',
		marginRight: 6
	}
}));

export default function Search({ setUserList, onlineUsers }) {
	const classes = useStyles();
	const [ query, setQuery ] = useState('');

	const searchUsers = useSearchUsers();
	const getUsers = useGetUsers();

	const search = async () => {
		const searchResults = await searchUsers(query);
		setUserList(searchResults);
	};

	const handleSearch = (e) => {
		setQuery(e);
	};

	useEffect(
		() => {
			if (query !== '') {
				search();
			} else {
				getUsers().then((res) => {
					setUserList(res);
				});
			}
		},
		[ query, onlineUsers ]
	);

	return (
		<TextField
			variant="outlined"
			fullWidth
			placeholder="Search..."
			className={classes.root}
			InputProps={{
				className: classes.searchInput,
				startAdornment: <SearchIcon className={classes.searchIcon} />
			}}
			value={query}
			onChange={(e) => handleSearch(e.target.value)}
		/>
	);
}
