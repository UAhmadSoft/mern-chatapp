import useHandleResponse from '../utilities/handleResponse';
import { useSnackbar } from 'notistack';

export function useIsLoggedIn() {
    const { enqueueSnackbar } = useSnackbar();
    const handleResponse = useHandleResponse();

    const loggedIn = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            withCredentials: true,
            credentials: 'include',
        };

        return fetch(
            `/login`,
            requestOptions
        )
            .then(handleResponse)
            .then(user => {
                return user;
            })
            .catch(function (response) {
                enqueueSnackbar(response, {
                    variant: 'warning',
                });
            });
    };

    return loggedIn;
}



export function useLogin() {
    const { enqueueSnackbar } = useSnackbar();
    const handleResponse = useHandleResponse();

    const login = (email, password) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        };

        return fetch(
            `/login`,
            requestOptions
        )
            .then(handleResponse)
            .then(user => {
                return user;
            })
            .catch(function (response) {
                enqueueSnackbar(response, {
                    variant: 'warning',
                });
            });
    };

    return login;
}



export function useRegister() {
    const { enqueueSnackbar } = useSnackbar();
    const handleResponse = useHandleResponse();

    const register = (username, email, password) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
        };

        return fetch(
            `/register`,
            requestOptions
        )
            .then(handleResponse)
            .then(user => {
                return user;
            })
            .catch(function (response) {
                console.log(response)
                if (response) {
                    enqueueSnackbar(response, {
                        variant: 'warning',
                    });
                } else {
                    enqueueSnackbar('Failed to Register', {
                        variant: 'warning',
                    });
                }
            });
    };

    return register;
}




export function useLogout() {
    const { enqueueSnackbar } = useSnackbar();
    const handleResponse = useHandleResponse();

    const logout = () => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        };

        return fetch(
            `/logout`,
            requestOptions
        )
            .then(handleResponse)
            .then(user => {
                return user;
            })
            .catch(function (response) {
                enqueueSnackbar('Failed to Logout', {
                    variant: 'warning',
                });
            });
    };

    return logout;
}


