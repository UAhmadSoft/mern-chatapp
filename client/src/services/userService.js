import useHandleResponse from '../utilities/handleResponse';
import { useSnackbar } from 'notistack';

export function useGetUsers() {
    const handleResponse = useHandleResponse();
    const { enqueueSnackbar } = useSnackbar();

    const requestOptions = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        withCredentials: true,
        credentials: 'include',
    };

    const getUsers = () => {
        return fetch(
            `/api/users`,
            requestOptions
        )
            .then(handleResponse)
            .then(userList => {
                return userList
            })
            .catch(() =>
                enqueueSnackbar('Could not load Users', {
                    variant: 'error',
                }));
    };

    return getUsers;
}


export function useSearchUsers() {
    const handleResponse = useHandleResponse();

    const searchUsers = (query) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query }),
        };

        return fetch(
            `/api/users`,
            requestOptions
        )
            .then(handleResponse)
            .then(results => {
                return results
            })
    };

    return searchUsers;
}