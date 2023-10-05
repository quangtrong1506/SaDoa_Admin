import { Link } from 'react-router-dom';
import '../assets/css/_error.css';

export default function ErrorPage() {
    return (
        <>
            <div className="error-page">
                <div className="content">
                    <div className="header">
                        <h1>404 not found</h1>
                        <Link to="/">Back to home</Link>
                        <p>Your link does not exist or has been deleted</p>
                    </div>
                </div>
                <div className="bg"></div>
            </div>
        </>
    );
}
