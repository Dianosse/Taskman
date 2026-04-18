import api from './api'

export async function getConversationMessages(idConversation) {
    const res = await api.get(`/conversations/${idConversation}/messages`);
    return res.data;
}

export async function sendMessage(idConversation, data) {
    const res = await api.post(`/conversations/${idConversation}/messages`, data);
    return res.data;
}