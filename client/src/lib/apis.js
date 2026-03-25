import axios from "axios";

const BASE_URL = 'http://localhost:8080';

export const fetchMovies = async () => {
    const res = await axios.get(`${BASE_URL}/movies`);
    return res.data;
}

export const registerUser = async (newUser) => {
    const res = await axios.post(`${BASE_URL}/register`, newUser);
    return res.data;
}

export const loginUser = async (userCreds) => {
    const res = await axios.post(`${BASE_URL}/login`, userCreds);
    return res.data;
}

export const fetchProfile = async () => {
    const res = await axios.get(`${BASE_URL}/profile`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    return res.data;
}

export const fetchMovieById = async (id) => {
    const res = await axios.get(`${BASE_URL}/movies/${id}`);
    return res.data;
}

export const createTheatre = async (newTheatre) => {
    const res = await axios.post(`${BASE_URL}/theatres`, newTheatre, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    return res.data;
}

export const fetchTheatres = async () => {
    const res = await axios.get(`${BASE_URL}/theatres`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    return res.data;
}

export const fetchTheatreById = async (id) => {
    const res = await axios.get(`${BASE_URL}/theatres/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    return res.data;
}

export const createScreening = async ({ theatreId, movieId, price, showTimings }) => {
    const res = await axios.post(
        `${BASE_URL}/screenings`,
        { theatreId, movieId, price, showTimings },
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }
    );
    return res.data;
}

export const fetchScreeningsByMovieId = async (movieId) => {
    const res = await axios.get(`${BASE_URL}/screenings/${movieId}`);
    return res.data;
}

export const createBooking = async ({ theatreId, movieId, seats, showTime, amount }) => {
    const res = await axios.post(
        `${BASE_URL}/bookings`,
        { theatreId, movieId, seats, showTime, amount },
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }
    );
    return res.data;
}

export const fetchMyBookings = async () => {
    const res = await axios.get(`${BASE_URL}/bookings`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    return res.data;
}

export const forgotPassword = async ({ email }) => {
    const res = await axios.post(`${BASE_URL}/forgot-password`, { email });
    return res.data;
}

export const resetPassword = async ({ token, password }) => {
    const res = await axios.post(`${BASE_URL}/reset-password`, { token, password });
    return res.data;
}