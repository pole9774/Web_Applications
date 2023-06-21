import dayjs from 'dayjs';

import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';


const PageForm = (props) => {
    /*
     * Creating a state for each parameter of the film.
     * There are two possible cases: 
     * - if we are creating a new page, the form is initialized with the default values.
     * - if we are editing a page, the form is pre-filled with the previous values.
     */
    const [title, setTitle] = useState(props.page ? props.page.title : '');
    const [author, setAuthor] = useState(props.page ? props.page.author : '');
    const [date_c, setDateC] = useState((props.page && props.page.date_c) ? props.page.date_c.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'));
    const [date_pub, setDatePub] = useState((props.page && props.page.date_pub) ? props.page.date_pub.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'));

    // useNavigate hook is necessary to change page
    const navigate = useNavigate();
    const location = useLocation();

    // if the page is saved (eventually modified) we return to the list of all pages, 
    // otherwise, if cancel is pressed, we go back to the previous location (given by the location state)
    const nextpage = location.state?.nextpage || '/';

    const handleSubmit = (event) => {
        event.preventDefault();

        // String.trim() method is used for removing leading and ending whitespaces from the title.
        const page = { "title": title.trim(), "author": author, "date_c": date_c, "date_pub": date_pub }

        if (props.page) {
            page.id = props.page.id;
            props.editPage(page);
        }
        else
            props.addPage(page);

        navigate("/");
    }

    return (
        <Form className="block-example border border-primary rounded mb-0 form-padding" onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" required={true} value={title} onChange={event => setTitle(event.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Author</Form.Label>
                <Form.Control type="text" required={true} value={author} onChange={event => setAuthor(event.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Date_c</Form.Label>
                <Form.Control type="date" required={true} value={date_c} onChange={event => { setDateC(dayjs(event.target.value).format('YYYY-MM-DD')) }} />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Date_pub</Form.Label>
                { /* date_pub is an optional parameter. It has to be properly rendered only if available. */}
                <Form.Control type="date" value={date_pub} onChange={event => { event.target.value ? setDatePub(dayjs(event.target.value).format('YYYY-MM-DD')) : setDatePub("") }} />
            </Form.Group>

            <Button className="mb-3" variant="primary" type="submit">Save</Button>
            &nbsp;
            <Link className="btn btn-danger mb-3" to={nextpage}> Cancel </Link>
        </Form>
    )
}

export default PageForm;