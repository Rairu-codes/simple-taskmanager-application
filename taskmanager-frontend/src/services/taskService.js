import axios from "axios";

const API_URL = '/api/tasks';

export const getAllTasks = async () => axios.get(API_URL);

export const getTaskById = (id) => axios.get(`${API_URL}/${id}`);

export const createTask = (task) => axios.post(API_URL, task);

export const updateTask = (id, task) => axios.put(`${API_URL}/${id}`, task);

export const deleteTask = (id) => axios.delete(`${API_URL}/${id}`);
