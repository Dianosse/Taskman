import api from './api'

export async function getMyConversations() {
    const res = await api.get('/conversations');
    return res.data;
}

export async function createConversation(data) {
    const res = await api.post('/conversations', data);
    return res.data;
}