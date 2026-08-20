import axios from 'axios';

const API_BASE = '/api';

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Templates
  getTemplates: async (category = '') => {
    const url = category && category !== 'all' ? `/templates/?category=${category}` : '/templates/';
    const res = await client.get(url);
    return res.data;
  },

  createTemplate: async (data) => {
    const res = await client.post('/templates/', data);
    return res.data;
  },

  // Dashboard Stats
  getDashboardStats: async () => {
    const res = await client.get('/dashboard/stats/');
    return res.data;
  },

  // Articles & Generation
  generateArticle: async (payload) => {
    const res = await client.post('/articles/generate/', payload);
    return res.data;
  },

  getArticles: async () => {
    const res = await client.get('/articles/');
    return res.data;
  },

  getArticle: async (id) => {
    const res = await client.get(`/articles/${id}/`);
    return res.data;
  },

  deleteArticle: async (id) => {
    const res = await client.delete(`/articles/${id}/`);
    return res.data;
  },

  performAIEdit: async (articleId, payload) => {
    const res = await client.post(`/articles/${articleId}/ai-edit/`, payload);
    return res.data;
  },

  reEvaluateArticle: async (articleId) => {
    const res = await client.post(`/articles/${articleId}/evaluate/`);
    return res.data;
  },
  APIStatus: async () => {
    const res = await client.get('/APIStatus/');
    alert(JSON.stringify(res.data));
    return res.data;
  },

};