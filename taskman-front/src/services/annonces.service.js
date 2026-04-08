import api from './api'

export async function getAnnonces(page = 1, limit = 10, search = '') {
    let url = `/annonces?page=${page}&limit=${limit}`

    if (search) {
        url += `&search=${encodeURIComponent(search)}`
    }

    const res = await api.get(url)
    return res.data
}

export async function getAnnonceById(id) {
    const res = await api.get(`/annonces/${id}`)
    return res.data
}