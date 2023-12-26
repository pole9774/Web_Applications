import { Navbar, Container } from "react-bootstrap";

function NavHeader(props) {
    const name = props.user && props.user.name;

    return (
        <Navbar bg='primary' variant='dark'>
            <Container fluid>
                <Navbar.Brand className='fs-2'>CodeSpeak</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text className='fs-5'>
                        {"Signed in as: " + name}
                    </Navbar.Text>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavHeader;
