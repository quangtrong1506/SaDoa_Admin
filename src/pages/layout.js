import 'bootstrap/dist/css/bootstrap.css';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import categoryApis from '../api/baseAdmin/category';
import '../assets/css/styles.css';
import Header from '../components/_common/header/header';
import { setInitialValue } from '../features/category/themeSlice';

export default function Layout() {
    const dispatch = useDispatch();
    useEffect(() => {
        function fetchData() {
            categoryApis.index().then((res) => {
                if (res.success) {
                    const c = [];
                    res.data.docs.forEach((element) => {
                        c.push({
                            value: element.title,
                            label: element.title,
                        });
                    });
                    dispatch(setInitialValue(c));
                }
            });
        }
        fetchData();
    }, []);
    return (
        <>
            <div className="main">
                <div className="left">
                    <Header />
                </div>
                <div className="right">
                    <Outlet />
                </div>
            </div>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </>
    );
}
