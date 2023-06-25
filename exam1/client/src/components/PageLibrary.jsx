import 'bootstrap-icons/font/bootstrap-icons.css';
import 'dayjs';

import { Table, Form, Button } from 'react-bootstrap/'
import { Link, useLocation } from 'react-router-dom';

function PageTable(props) {

    const pages = props.pages;

    return (
        <Table striped>
            <tbody>
                {
                    pages.map((page) =>
                        <PageRow key={page.id} pageData={page} deletePage={props.deletePage} updatePage={props.updatePage} user={props.user} mod={props.mod} />
                    )
                }
            </tbody>
        </Table>
    );
}

function PageRow(props) {

    const formatDate = (dayJsDate, format) => {
        return dayJsDate ? dayJsDate.format(format) : '';
    }

    const location = useLocation();

    return (
        <tr>
            <td>
                <Link className="btn btn-secondary" to={"/pages/" + props.pageData.id} state={{ nextpage: location.pathname }}>
                    <i class="bi bi-eye-fill"></i>
                </Link>
            </td>
            {
                props.user && (props.mod == 1 || props.user.admin == 1) ?
                    <td>
                        <Link className="btn btn-primary" to={"/edit/" + props.pageData.id} state={{ nextpage: location.pathname }}>
                            <i className="bi bi-pencil-square" />
                        </Link>
                        &nbsp;
                        <Button variant='danger' onClick={() => props.deletePage(props.pageData.id)}>
                            <i className="bi bi-trash" />
                        </Button>
                    </td> : <></>
            }
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


export default PageTable;