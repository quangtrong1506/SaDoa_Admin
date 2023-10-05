import { memo } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <>
            <ul className="nav">
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/works">Works</Link>
                </li>
                <li>
                    <Link to="/works/add">Add Works</Link>
                </li>
                <li>
                    <Link to="/category">Category</Link>
                </li>
            </ul>
        </>
    );
};
export default memo(Header);
