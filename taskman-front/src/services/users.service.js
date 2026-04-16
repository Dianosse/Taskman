import api from './api'

export async function getMyProfile() {
    const res = await api.get('/users/me')
    return res.data
}

export async function getMyAnnonces() {
    const res = await api.get('/users/me/annonces')
    return res.data
}

export async function updateMyProfile(id, data) {
    const res = await api.put(`/users/${id}`, data)
    return res.data
}

export async function getUserById(id) {
    const res = await api.get(`/users/${id}`)
    return res.data
}

export async function getUserAnnonces(id) {
    const res = await api.get(`/users/${id}/annonces`)
    return res.data
}