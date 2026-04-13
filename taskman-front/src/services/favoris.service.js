import api from './api'

export async function addFavori(idAnnonce) {
    const res = await api.post(`/favoris/${idAnnonce}`)
    return res.data
}