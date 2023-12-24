import { useState } from 'react';
import { Form, Button, Alert, Col, Row } from 'react-bootstrap';
import { useLocation, useNavigate, Link } from 'react-router-dom';

function LoginForm(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [show, setShow] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const location = useLocation();
    const navigate = useNavigate();

    const nextpage = location.state?.nextpage || '/';

    const handleSubmit = (event) => {
        event.preventDefault();
        const credentials = { username, password };

        props.login(credentials)
            .then(() => navigate("/"))
            .catch((err) => {
                setErrorMessage(err.error); setShow(true);
            });
    };

    return (
        <Row>
            <Col md={4} >
                <h1>Login</h1>

                <Form onSubmit={handleSubmit}>
                    <Alert
                        dismissible
                        show={show}
                        onClose={() => setShow(false)}
                        variant="danger">
                        {errorMessage}
                    </Alert>
                    <Form.Group controlId="username">
                        <Form.Label>email</Form.Label>
                        <Form.Control
                            type="email"
                            value={username} placeholder="Example: john.doe@polito.it"
                            onChange={(ev) => setUsername(ev.target.value)}
                            required={true}
                        />
                    </Form.Group>
                    <Form.Group controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={password} placeholder="Enter the password."
                            onChange={(ev) => setPassword(ev.target.value)}
                            required={true} minLength={2}
                        />
                    </Form.Group>
                    <Button className="mt-3" type="submit">Login</Button>
                </Form>
                <Link className="btn btn-danger mb-3" to={nextpage}> Back </Link>
            </Col>
        </Row>

    )
};

function LogoutButton(props) {
    return (
        <Button variant="outline-light" onClick={props.logout}>Logout</Button>
    )
}

function LoginButton(props) {
    const navigate = useNavigate();
    return (
        <Button variant="outline-light" onClick={() => navigate('/login')}>Login</Button>
    )
}

export { LoginForm, LogoutButton, LoginButton };
