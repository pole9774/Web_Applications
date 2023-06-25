import { React, useContext, useState, useEffect } from 'react';
import { Row, Col, Button, Spinner, Container, Alert } from 'react-bootstrap';
import { Link, useParams, useLocation, Outlet } from 'react-router-dom';

import SiteNameForm from './SiteNameForm'
import PageForm from './PageForm';
import PageTable from './PageLibrary';
import MessageContext from '../messageCtx';
import API from '../API';
import { LoginForm } from './Auth';
import NavHeader from './NavbarComponents';
import PageView from './PageView'


function MainLayout(props) {
    return (
        <>
            <NavHeader user={props.user} logout={props.logout} siteName={props.siteName} />

            <Row>

                <Col md={4} xl={6}>

                    <h2>
                        All Pages
                    </h2>

                    <PageTable pages={props.pages} user={props.user} deletePage={props.deletePage} addPage={props.addPage} editPage={props.editPage} mod={0} />
                </Col>

                <Col md={4} xl={6}>
                    {props.user ?
                        <>
                            <h2>
                                My Pages
                            </h2>
                            <PageTable pages={props.userPages} user={props.user} deletePage={props.deletePage} addPage={props.addPage} editPage={props.editPage} mod={1} />
                        </>
                        : <></>}
                    {props.message ? <Alert variant='danger' dismissible className='my-2' onClose={props.resetMessage}>
                        {props.message}</Alert> : null}
                    {props.user ? <Link className="btn btn-primary btn-lg fixed-right-bottom" to="/add" state={{ nextpage: location.pathname }}> &#43; </Link> : <></>}

                    {props.user && props.user.admin == 1 ? <SiteNameForm siteName={props.siteName} editSiteName={props.editSiteName} /> : <></>}

                </Col>

            </Row>
        </>
    );
}

function AddLayout(props) {

    return (
        <PageForm addPage={props.addPage} user={props.user} />
    );
}

function EditLayout(props) {

    const { pageId } = useParams();
    const [page, setPage] = useState(null);

    useEffect(() => {
        API.getPage(pageId)
            .then(page => {
                setPage(page);
            })
            .catch(e => {
                props.handleErrors(e);
            });
    }, [pageId]);

    return (
        page ? <PageForm page={page} editPage={props.editPage} user={props.user} /> : <></>
    );
}

function ViewLayout(props) {
    const { pageId } = useParams();
    const [page, setPage] = useState(null);

    useEffect(() => {
        API.getPage(pageId)
            .then(page => {
                setPage(page);
            })
            .catch(e => {
                props.handleErrors(e);
            });
    }, [pageId]);

    return (
        page ? <PageView page={page} /> : <></>
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

export { AddLayout, EditLayout, MainLayout, LoginLayout, ViewLayout };