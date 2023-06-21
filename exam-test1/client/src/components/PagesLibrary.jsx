import 'dayjs';

import { Table, Form, Button } from 'react-bootstrap/'
import { Link, useLocation } from 'react-router-dom';

function PagesTable(props) {

    const filteredPages = props.pages;

    return (
        <Table striped>
            <tbody>
                {filteredPages.map((page) => <PagesRow key={page.id} pageData={page}
                    deletePage={props.deletePage} updatePage={props.updatePage} />)}
            </tbody>
        </Table>
    );
}

function PagesRow(props) {

    const formatDate = (dayJsDate, format) => {
        return dayJsDate ? dayJsDate.format(format) : '';
    }

    // location is used to pass state to the edit (or add) view so that we may be able to come back to the last filter view
    const location = useLocation();

    return (
        <tr>
            <td>
                <Link className="btn btn-primary" to={"/edit/" + props.pageData.id} state={{ nextpage: location.pathname }}>
                    <i className="bi bi-pencil-square" />
                </Link>
                &nbsp;
                <Button variant='danger' onClick={() => props.deletePage(props.pageData.id)}>
                    <i className="bi bi-trash" />
                </Button>
            </td>
            <td>
                <p>
                    {props.pageData.id}
                </p>
            </td>
            <td>
                <p>
                    {props.pageData.title}
                </p>
            </td>
            <td>
                <p>
                    {props.pageData.author}
                </p>
            </td>
            <td>
                <small>{formatDate(props.pageData.date_c, 'MMMM D, YYYY')}</small>
            </td>
            <td>
                <small>{formatDate(props.pageData.date_pub, 'MMMM D, YYYY')}</small>
            </td>
        </tr>
    );
}

export default PagesTable;
