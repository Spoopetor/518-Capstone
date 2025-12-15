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

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const fetcher = async (url) => {
  
    let response = await fetch(url);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
  
};

const UserSummaryItem = ({ userId, index}) => {

    const endpoint = `${BACKEND_URL}/api/user/${userId}`;
    const { data: userData, error, isLoading } = useSWR(endpoint, fetcher);

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
        <Row className="w-150 d-flex justify-content-between align-items-center">
        <Col><h5>#{index+1}</h5></Col>
        <Col><Image src={userData.imageUrl} alt="User Avatar" style={{ width: '32px', height: '32px' }}></Image></Col>
        <Col><h5 style={{ color: "black" }}>{userData.name}</h5></Col>
        <Col><h5>{userData.currentScore}</h5></Col>
        <Col>
            <span className="p-1">
                {userData.country !== "none" ? <Image src={`https://flagsapi.com/${userData.country}/flat/32.png`} alt={`${userData.country} Flag`}/> : <Image src="./src/assets/earth.png" alt={`Earth`} style={{width: '32px', height: '32px'}}/>}
            </span></Col>
        </Row>
    </Card>
    );
};


export default function UserSummaryList({ userIds }) {
    if (!userIds || userIds.length === 0) {
    return <Alert variant="info">No users to display.</Alert>;
    }

    return (
    <div className="p-4" style={{ maxWidth: '400px'}}>
        <Stack gap={3}>
        {userIds.map((id, index) => (
            <UserSummaryItem key={id} userId={id} index={index} />
        ))}
        </Stack>
    </div>
    );
}