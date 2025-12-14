import React, { useState } from 'react';
import { Form, Button, FormControl, InputGroup, Alert} from 'react-bootstrap';
import { useUser } from '@clerk/clerk-react'

export default function AddFriendForm({ onAddFriend, updateState }) {

    const { user } = useUser();
    const [friendCode, setFriendCode] = useState('');
    const [showFriendError, setShowFriendError] = useState(false);
    const [showFriendSuccess, setShowFriendSuccess] = useState(false);

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (friendCode.trim()) {
            onAddFriend(friendCode.trim());
            setFriendCode('');
        }
        let res = await fetch(`${BACKEND_URL}/api/user/friend/${user.id}/user_${friendCode}`, {
            method: 'PUT',
        })
        console.log(res.status);
        updateState(true);
        if (res.status !== 200) {
            console.error('Failed to add friend');
            setShowFriendError(true);
            const timer = setTimeout(() => {
                setShowFriendError(false);
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            setShowFriendSuccess(true);
            const timer = setTimeout(() => {
                setShowFriendSuccess(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    };

    return (
    <span>
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formFriendCode">
            <InputGroup>
                <FormControl
                type="text"
                placeholder="Enter friend code"
                aria-label="Friend code"
                value={friendCode}
                onChange={(e) => setFriendCode(e.target.value)}
                required
                />
                <Button variant="primary" type="submit">
                    Add
                </Button>
                
            </InputGroup>
            </Form.Group>
        </Form>
        {showFriendError && <Alert variant="danger">Failed to add friend</Alert>}
        {showFriendSuccess && <Alert variant="success">Friend added successfully!</Alert>}
    </span>
    );
}