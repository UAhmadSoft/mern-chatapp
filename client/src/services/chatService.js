import useHandleResponse from '../utilities/handleResponse';
import { useSnackbar } from 'notistack';

export function useCreateChat() {
    const handleResponse = useHandleResponse();
    const { enqueueSnackbar } = useSnackbar();

    const createChat = (user) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user }),
        };

        return fetch(
            `/api/chats`,
            requestOptions
        )
            .then(handleResponse)
            .then(chat => {
                return chat
            })
            .catch(() =>
                enqueueSnackbar('Could not create chat', {
                    variant: 'error',
                })
            );
    };

    return createChat;
}



export function useGetChatById() {
    const handleResponse = useHandleResponse();
    const { enqueueSnackbar } = useSnackbar();

    const createChat = (chatId) => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        };

        return fetch(
            `/api/chats/chatId?chatId=${chatId}`,
            requestOptions
        )
            .then(handleResponse)
            .then(chat => {
                return chat
            })
            .catch(() =>
                enqueueSnackbar('Could not load chats', {
                    variant: 'error',
                }));
    };

    return createChat;
}


export function useGetActiveChat() {
    const handleResponse = useHandleResponse();
    const { enqueueSnackbar } = useSnackbar();

    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    };

    const getActiveChat = () => {
        return fetch(
            `/api/chats`,
            requestOptions
        )
            .then(handleResponse)
            .then(chats => {
                return chats
            })
            .catch(() =>
                enqueueSnackbar('Could not load conversations', {
                    variant: 'error',
                })
            );
    };

    return getActiveChat;
}

export function useSendMessage() {
    const handleResponse = useHandleResponse();
    const { enqueueSnackbar } = useSnackbar();

    const sendMessage = (conversationId, content) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ conversationId, content }),
        };

        return fetch(
            `/api/messages`,
            requestOptions
        )
            .then(handleResponse)
            .then(chats => {
                return chats
            })
            .catch(() =>
                enqueueSnackbar('Could not send message', {
                    variant: 'error',
                }));
    };

    return sendMessage;
}


export function useGetMessages() {
    const handleResponse = useHandleResponse();
    const { enqueueSnackbar } = useSnackbar();

    const getMessages = (conversationId) => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        };

        return fetch(
            `/api/messages/query?conversationId=${conversationId}`,
            requestOptions
        )
            .then(handleResponse)
            .then(chats => {
                return chats
            })
            .catch(() =>
                enqueueSnackbar('Could not load messages from user', {
                    variant: 'error',
                }));
    };

    return getMessages;
}


export function useNotifications() {
    const handleResponse = useHandleResponse();
    const { enqueueSnackbar } = useSnackbar();

    const getNotifications = () => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        };


        return fetch(
            `/api/notifications/latest`,
            requestOptions
        )
            .then(handleResponse)
            .then(data => {
                return data
            })
            .catch(() =>
                enqueueSnackbar('Could not load notifications', {
                    variant: 'error',
                }));
    };
    return getNotifications;
}




export function useMarkAsRead() {
    const handleResponse = useHandleResponse();
    const { enqueueSnackbar } = useSnackbar();

    const markRead = (conversationId) => {
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
        };


        return fetch(
            `/api/notifications/markasread?conversationId=${conversationId}`,
            requestOptions
        )
            .then(handleResponse)
            .then(data => {
                return data
            })
            .catch(() =>
                enqueueSnackbar('Error with notifications', {
                    variant: 'error',
                }));
    };
    return markRead;
}
