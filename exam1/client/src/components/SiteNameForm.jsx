import dayjs from 'dayjs';

import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const PageForm = (props) => {
    /*
     * Creating a state for each parameter of the page.
     * There are two possible cases: 
     * - if we are creating a new page, the form is initialized with the default values.
     * - if we are editing a page, the form is pre-filled with the previous values.
     */
    const [name, setName] = useState(props.siteName);

    const handleSubmit = (event) => {
        event.preventDefault();

        // String.trim() method is used for removing leading and ending whitespaces from the name.
        const newName = { "name": name.trim() }

        newName.id = 1;

        props.editSiteName(newName);
    }

    return (
        <Form className="block-example border border-primary rounded mb-0 form-padding" onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
                <Form.Label>Site name:</Form.Label>
                <Form.Control type="text" required={true} value={name} onChange={event => setName(event.target.value)} />
            </Form.Group>
            <Button className="mb-3" variant="primary" type="submit">Save</Button>
        </Form>
    )

}

export default PageForm;