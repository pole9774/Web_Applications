import dayjs from 'dayjs';

import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const PageView = (props) => {
    /*
     * Creating a state for each parameter of the page.
     * There are two possible cases: 
     * - if we are creating a new page, the form is initialized with the default values.
     * - if we are editing a page, the form is pre-filled with the previous values.
     */
    const [title, setTitle] = useState(props.page ? props.page.title : '');
    const [author, setAuthor] = useState(props.page ? props.page.author : '');
    // if exist dates are converted to string for the form control of type "date", otherwise it is set to empty string
    const [date_c, setDateC] = useState(props.page ? props.page.date_c.format('YYYY-MM-DD') : '');
    const [date_pub, setDatePub] = useState((props.page && props.page.date_pub) ? props.page.date_pub.format('YYYY-MM-DD') : '');

    // useNavigate hook is necessary to change page
    const navigate = useNavigate();
    const location = useLocation();

    // if the page is saved (eventually modified) we return to the list of all pages, 
    // otherwise, if cancel is pressed, we go back to the previous location (given by the location state)
    const nextpage = location.state?.nextpage || '/';

    return (
        <>
            <h1>
                Title: {title}
            </h1>
            <h2>
                By: {author}
            </h2>
            <h2>
                Creation date: {date_c}
            </h2>
            <h2>
                Pubblication date: {date_pub}
            </h2>
            <Link className="btn btn-danger mb-3" to={nextpage}> Cancel </Link>
        </>
    )

}

export default PageView;