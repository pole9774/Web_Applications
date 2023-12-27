import { React, useState } from 'react';
import { Row, Col, Button, Container, Nav, Card, Form } from 'react-bootstrap';
import { Link, useParams, Navigate } from 'react-router-dom';

import { LoginForm } from './Auth';
import NavHeader from './Navbar';
import API from '../API';

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
                <Link to={`/projects/${props.project.id}`}>
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
                            <Nav.Link as={Link} to={"/projects/" + id}>{name}</Nav.Link>
                        </Nav>
                    </Col>
                    <Col md={9} className="ml-sm-auto">
                        <h2>{name}</h2>
                        <p>{description}</p>
                        <Link to={"/projects/" + id + "/make-question"}>
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
    const [questionid, setQuestionid] = useState(0);

    const addQuestion = (e) => {
        API.addQuestion(e)
            .then((qid) => {
                props.setQDirty(true);
                setQuestionid(qid);
            })
            .catch((err) => handleErrors(err));
    }

    return (

        <>
            {questionid == 0 ?
                <>
                    <NavHeader user={props.user} />

                    <Container fluid>
                        <Row>
                            <Col md={3} className="bg-light sidebar">
                                <Nav defaultActiveKey="/" className="flex-column">
                                    <Nav.Link as={Link} to="/">My Projects</Nav.Link>
                                    <Nav.Link as={Link} to={"/projects/" + id}>{name}</Nav.Link>
                                    <Nav.Link as={Link} to={"/projects/" + id + "/make-question"}>Make a question</Nav.Link>
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

                                <Button variant="primary" onClick={() => {
                                    const question = {
                                        "title": title,
                                        "description": description,
                                        "projectid": Number(id)
                                    }
                                    addQuestion(question);
                                }}>Submit to AI</Button>
                            </Col>
                        </Row>
                    </Container>
                </>
                :
                <Navigate replace to={"/questions/" + questionid } />
            }</>


    );
}

function QuestionPage(props) {

    const { qid } = useParams();

    const questions = props.questions;

    let question = {
        title: "",
        description: ""
    };

    for (let q of questions) {
        if (q.id == qid) {
            question.title = q.title;
            question.description = q.description;
        }
    }

    return (
        <>
            <h1>{question.title}</h1>
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

export { MainLayout, ProjectDetailsLayout, QuestionForm, QuestionPage, LoginLayout };
