import { React, useReducer, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { SignedIn, SignedOut, UserButton, useUser} from '@clerk/clerk-react'
import useSWR from 'swr';
import '../Coin.css';
import './Home.css';

function reducer(score, action) {
    let newscore;
    let user;
    switch (action.type) {
        case 'heads':
            newscore = score+1;
            user = action.payload
            if (user != null) {
                fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/${user.uid}/${newscore}`, {
                    method: 'PUT'
                });
            }
            return newscore;
        case 'tails':
            user = action.payload
            if (user != null) {
                fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/${user.uid}/0`, {
                    method: 'PUT'
                });
            }
            return 0;
        case 'loadUserScore':
            return action.payload;
        default:
            throw new Error();
    }
}

const backendFetcher = async (url) => {

    let response = await fetch(url);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}

export default function Home() {
    const backendURL = import.meta.env.VITE_BACKEND_URL;

    const [score, dispatch] = useReducer(reducer, 0);

    const [isFlipped, setIsFlipped] = useState(false);
    const [result, setResult] = useState('heads');

    const { isLoaded, user } = useUser();
    const { data, error, isLoading } = useSWR(
        user?.id ? `${backendURL}/api/user/${user.id}` : null, 
        backendFetcher,
        {onSuccess: (userData) => dispatch({ type: 'loadUserScore', payload: userData.currentScore })}
    );

    if (!isLoaded) {
        return <p>Loading...</p>;
    }

    if (isLoading) {
        return <h2>Loading...</h2>;
    }

    if (error) {
        return <h2>Error loading user data: {error.message}</h2>;
    }

    const flipCoin = () => {
        const tossResult = Math.floor(Math.random() * 2);
        const newResult = tossResult === 0 ? 'tails' : 'heads';
        setResult(newResult);

        setIsFlipped(true);

        setTimeout(() => {
            
            setIsFlipped(false);
            dispatch({ type: newResult, payload: data});
        }, 2000);
    };

    return <Container id="home-page">
            
            <Row className="justify-content-center">
                <Col><h1>Score: {score}</h1></Col>     
            </Row>
            <Row className="justify-content-center mt-3">
                <Col className="d-flex justify-content-center">
                    <Button onClick={flipCoin} className="hide">
                        <div className={`coin-container ${isFlipped ? 'flipped' : ''} ${result} result-${result}`}>
                            {console.log(result)}
                            <Card className="coin-face front rounded-circle">
                            <Card.Body className="d-flex justify-content-center align-items-center">
                                <Card.Text className="fs-1 fw-bold">
                                :D
                                </Card.Text>
                            </Card.Body>
                            </Card>
                            {/* Back of the coin */}
                            <Card className="coin-face back rounded-circle">
                            <Card.Body className="d-flex justify-content-center align-items-center">
                                <Card.Text className="fs-1 fw-bold">
                                /
                                </Card.Text>
                            </Card.Body>
                            </Card>
                        </div>
                    </Button>
                </Col>
            </Row>
            <Button id="flip-button" onClick={flipCoin} className="mt-3 p-4">
                Toss Coin
            </Button>
        </Container>
}