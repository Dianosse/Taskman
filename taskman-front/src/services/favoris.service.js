import api from './api'

export async function addFavori(idAnnonce) {
    const res = await api.post(`/favoris/${idAnnonce}`)
    return res.data
}

export async function getMesFavoris() {
    const res = await api.get('/favoris')
    return res.data
}

export async function removeFavori(idAnnonce) {
    const res = await api.delete(`/favoris/${idAnnonce}`)
    return res.data
}