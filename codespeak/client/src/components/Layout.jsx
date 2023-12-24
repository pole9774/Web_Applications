import 'bootstrap-icons/font/bootstrap-icons.css';

import { React, useContext, useState, useEffect } from 'react';
import { Row, Col, Button, Spinner, Container, Alert, Table, Image, Form } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import API from '../API';
import { LoginForm } from './Auth';

function MainLayout(props) {

    const projects = props.projects;

    return (
        <Table>
            <tbody>
                {
                    projects.map((project) => 
                        <ProjectRow key={project.id} projectData={project} />
                    )
                }
            </tbody>
        </Table>
    );
}

function ProjectRow(props) {

    return (
        <tr>
            <td>
                <p>
                    {props.projectData.name}
                </p>
            </td>
        </tr>
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

export { MainLayout, LoginLayout };
