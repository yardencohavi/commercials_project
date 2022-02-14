import { Link } from "react-router-dom";

const HomePage = () => {
    return(
        <section>
        <h1>Choose Client</h1>
        <ul>
            <li>
                <Link to='/clients/1'>Client 1</Link>
            </li>
            <li>
                <Link to='/clients/2'>Client 2</Link>
            </li>
            <li>
                <Link to='/clients/3'>Client 3</Link>
            </li>
        </ul>
    </section>
    )
}
export default HomePage;