import api from './api'

export async function getAnnonces(page = 1, limit = 10, filters = {}) {
    const params = new URLSearchParams();

    params.append('page', page);
    params.append('limit', limit);

    if (filters.search) params.append('search', filters.search);
    if (filters.type) params.append('type', filters.type);
    if (filters.category) params.append('category', filters.category);
    if (filters.city) params.append('city', filters.city);
    if (filters.sort) params.append('sort', filters.sort);

    const res = await api.get(`/annonces?${params.toString()}`);
    return res.data;
}
export async function getAnnonceById(id) {
    const res = await api.get(`/annonces/${id}`);
    return res.data;
}

export async function createAnnonce(data) {
    const res = await api.post('/annonces', data);
    return res.data;
}

export async function updateAnnonce(id, data) {
    const res = await api.put(`/annonces/${id}`, data);
    return res.data;
}

export async function getCategories() {
    const res = await api.get('/annonces/categories');
    return res.data;
}

export async function deleteAnnonce(id){
    const res = await api.delete(`/annonces/${id}`);
    return res.data;
}