import { React, useState } from 'react';
import { Row, Col, Button, Container, Nav, Card, Form } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';

import { LoginForm } from './Auth';
import NavHeader from './Navbar';

function MainLayout(props) {

    const projects = props.projects;

    return (
        <>
            <NavHeader user={props.user} />

            <Container fluid>
                <Row>
                    <Col md={3} className="bg-light sidebar">
                        <Nav defaultActiveKey="/" className="flex-column">
                            <Nav.Link as={Link} to="/">My Projects</Nav.Link>
                        </Nav>
                    </Col>
                    <Col md={9} className="ml-sm-auto">
                        <h2>My projects</h2>
                        {
                            projects.map((project) =>
                                <ProjectCard key={project.id} project={project} />
                            )
                        }
                    </Col>
                </Row>
            </Container>
        </>
    );
}

function ProjectCard(props) {

    return (
        <Card>
            <Card.Body>
                <Card.Title>{props.project.name}</Card.Title>
                <Card.Text>{props.project.description}</Card.Text>
                <Link to={`/project/${props.project.id}`}>
                    <Button variant="primary">Details</Button>
                </Link>
            </Card.Body>
        </Card>
    );
}

function ProjectDetailsLayout(props) {

    const { id } = useParams();
    const projects = props.projects;

    let name = "";
    let description = "";

    for (let project of projects) {
        if (project.id == id) {
            name = project.name;
            description = project.description;
        }
    }

    return (
        <>
            <NavHeader user={props.user} />

            <Container fluid>
                <Row>
                    <Col md={3} className="bg-light sidebar">
                        <Nav defaultActiveKey="/" className="flex-column">
                            <Nav.Link as={Link} to="/">My Projects</Nav.Link>
                            <Nav.Link as={Link} to={"/project/" + id}>{name}</Nav.Link>
                        </Nav>
                    </Col>
                    <Col md={9} className="ml-sm-auto">
                        <h2>{name}</h2>
                        <p>{description}</p>
                        <Link to={"/project/" + id + "/make-question"}>
                            <Button variant="primary">Make a question</Button>
                        </Link>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

function QuestionForm(props) {

    const { id } = useParams();
    const projects = props.projects;

    let name = "";

    for (let project of projects) {
        if (project.id == id) {
            name = project.name;
        }
    }

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    return (
        <>
            <NavHeader user={props.user} />

            <Container fluid>
                <Row>
                    <Col md={3} className="bg-light sidebar">
                        <Nav defaultActiveKey="/" className="flex-column">
                            <Nav.Link as={Link} to="/">My Projects</Nav.Link>
                            <Nav.Link as={Link} to={"/project/" + id}>{name}</Nav.Link>
                            <Nav.Link as={Link} to={"/project/" + id + "/make-question"}>Make a question</Nav.Link>
                        </Nav>
                    </Col>
                    <Col md={9} className="ml-sm-auto">
                        <h2>{name}</h2>
                        <h2>Your question:</h2>
                        <Form>
                            <Form.Group controlId="formTitle">
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group controlId="formDescription">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Enter description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

function LoginLayout(props) {
    return (
        <Row>
            <Col md={12}>
                <LoginForm login={props.login} />
            </Col>
        </Row>
    );
}

export { MainLayout, ProjectDetailsLayout, QuestionForm, LoginLayout };
