import axios from "axios";
import { use } from "react";

const apiUrl = import.meta.env.VITE_BASE_URL_API;

export const fetchCheckout = async () => {
    try {
        const response = await axios.get(`${apiUrl}/Checkout`);
        return response.data;
    } catch (error) {
        console.error("Something went wrong!!", error);
        return null;
    }
};

export const fetchGamemode = async () => {
    try
    {
        const response = await axios.get(`${apiUrl}/Gamemode`);
        return response.data;
    } catch (error) {
        console.error("Something went wrong!!", error);
        return null;
    }
}

export const fetchMatch = async () => {
    try
    {
        const response = await axios.get(`${apiUrl}/Match`);
        return response.data;
    } catch (error) {
        console.error("Something went wrong!!", error);
        return null;
    }
}

export const postMatch = async (match) => {
    try
    {
        const response = await axios.post(`${apiUrl}/Match`, match);
        return response.data;
    } catch (error) {
        console.error("Something went wrong!!", error);
        return null;
    }
}

export const updateMatch = async (id, match) => {
    try
    {
        const response = await axios.put(`${apiUrl}/Match/${id}`, match);
        return response.data;
    } catch (error) {
        console.error("Something went wrong!!", error);
        return null;
    }
}

export const fetchThrow = async () => {
    try
    {
        const response = await axios.get(`${apiUrl}/Throw`);
        return response.data;
    } catch (error) {
        console.error("Something went wrong!!", error);
        return null;
    }
}

export const postThrow = async (gooi) => {
    try
    {
        const response = await axios.post(`${apiUrl}/Throw`, gooi);
        return response.data;
    } catch (error) {
        console.error("Something went wrong!!", error);
        return null;
    }
}

export const fetchTournament = async () => {
    try
    {
        const response = await axios.get(`${apiUrl}/Tournament`);
        return response.data;
    } catch (error) {
        console.error("Something went wrong!!", error);
        return null;
    }
}

export const postTournament = async (tournament) => {
    try
    {
        const response = await axios.post(`${apiUrl}/Tournament`, tournament);
        return response.data;
    } catch (error) {
        console.error("Something went wrong!!", error);
        return null;
    }
}

export const updateTournament = async (id, tournament) => {
    try
    {
        const response = await axios.put(`${apiUrl}/Tournament/${id}`, tournament);
        return response.data;
    } catch (error) {
        console.error("Something went wrong!!", error);
        return null;
    }
}

export const fetchTournamentMatch = async () => {
    try
    {
        const response = await axios.get(`${apiUrl}/TournamentMatch`);
        return response.data;
    } catch (error) {
        console.error("Something went wrong!!", error);
        return null;
    }
}

export const postTournamentMatch = async (tournamentMatch) => {
    try
    {
        const response = await axios.post(`${apiUrl}/TournamentMatch`, tournamentMatch);
        return response.data;
    } catch (error) {
        console.error("Something went wrong!!", error);
        return null;
    }
}

export const fetchTournamentParticipant = async () => {
    try
    {
        const response = await axios.get(`${apiUrl}/TournamentParticipant`);
        return response.data;
    } catch (error) {
        console.error("Something went wrong!!", error);
        return null;
    }
}

export const postTournamentParticipant = async (tournamentParticipant) => {
    try
    {
        const response = await axios.post(`${apiUrl}/TournamentParticipant`, tournamentParticipant);
        return response.data;
    } catch (error) {
        console.error("Something went wrong!!", error);
        return null;
    }
}

export const fetchUser = async () => {
    try
    {
        const response = await axios.get(`${apiUrl}/User`);
        return response.data;
    } catch (error) {
        console.error("Something went wrong!!", error);
        return null;
    }
}



export const fetchUserById = async (id) => {
    try
    {
        const response = await axios.get(`${apiUrl}/User/${id}`);
        return response.data;
    } catch (error) {
        console.error("Something went wrong!!", error);
        return null;
    }
}

export const updateUser = async (id, user) => {
    try
    {
        const response = await axios.put(`${apiUrl}/User/${id}`, user);
        return response.data;
    } catch (error) {
        console.error("Something went wrong!!", error);
        return null;
    }
}