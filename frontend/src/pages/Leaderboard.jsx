import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import LeaderboardSummary from '../LeaderboardSummary.jsx';
import useSWR from 'swr';

const leaderboardFetcher = async (url) => {
    let response = await fetch(url);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}

export default function Leaderboard() {
    const backendURL = import.meta.env.VITE_BACKEND_URL;

    const { data, error, isLoading } = useSWR(
        `${backendURL}/api/leaderboard/`,
        leaderboardFetcher
    );

    if (isLoading) {
        return <h2>Loading...</h2>;
    }

    if (error) {
        return <h2>Error loading leaderboard data: {error.message}</h2>;
    }

    console.log("Leaderboard data:", data);

    const userIds = data.map(user => user.uid);

    return  <Container>
                <Row className="justify-content-center mt-4">
                    <h1>Leaderboard</h1>
                    <LeaderboardSummary userIds={userIds}/> 
                </Row>
                
            </Container>
}