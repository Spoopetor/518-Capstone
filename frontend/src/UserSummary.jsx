import React from 'react';
import useSWR from 'swr';
import Stack from 'react-bootstrap/Stack';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const fetcher = async (url) => {
  
    let response = await fetch(url);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
  
};

const UserSummaryItem = ({ userId, myId }) => {
    const [reload, setReload] = useState(false);

    const endpoint = `${BACKEND_URL}/api/user/${userId}`;
    const { data: userData, error, isLoading } = useSWR(endpoint, fetcher);

    const handleUnfriend = () => {
        
        fetch(`${BACKEND_URL}/api/user/unfriend/${myId}/${userId}`, {
            method: 'PUT',
        })

    };

    if (isLoading) {
    return (
        <Card body className="p-3">
        <Spinner animation="border" size="sm" /> Loading user {userId} summary...
        </Card>
    );
    }

    if (error) {
    return <Alert variant="danger" className="p-3 m-0">Failed to load user data: {error.message}</Alert>;
    }

    return (
    <Card body className="d-flex justify-content-between align-items-left p-0">
        <Row className="w-150 d-flex justify-content-between align-items-left">
        <Col><Image src={userData.imageUrl} alt="User Avatar" style={{ width: '30px', height: '30px' }}></Image></Col>
        <Col><h5 style={{ color: "black" }}>{userData.name}</h5></Col>
        <Col><h5>{userData.currentScore}</h5></Col>
        <Col><Button variant="primary" className="text-nowrap" onClick={ () => { handleUnfriend(); setReload(!reload);
            }}>Remove Friend</Button></Col>
        </Row>
    </Card>
    );
};


export default function UserSummaryList({ userIds, myId}) {
    if (!userIds || userIds.length === 0) {
    return <Alert variant="info">No users to display.</Alert>;
    }

    return (
    <div className="p-4" style={{ maxWidth: '400px'}}>
        <Stack gap={3}>
        {userIds.map((id) => (
            <UserSummaryItem key={id} userId={id} myId={myId} />
        ))}
        </Stack>
    </div>
    );
}