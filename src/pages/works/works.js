import { memo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import worksApis from '../../api/baseAdmin/works';
const Works = () => {
    const [works, setWorks] = useState(null);
    const [page, setPage] = useState(1);
    useEffect(() => {
        async function fetchData() {
            const res = await worksApis.index({ page, type: -1 });
            if (res.success) setWorks(res.data);
        }
        fetchData();
    }, [page]);
    const deleteWork = (id) => {
        window.alert(id);
    };
    const Pagination = ({ page, pages }) => {
        return (
            <nav>
                <ul className="pagination pagination-sm">
                    {page === pages && pages > 2 && (
                        <li className="page-item" aria-current="page" onClick={setPage(page - 1)}>
                            <span className="page-link">{page - 2}</span>
                        </li>
                    )}
                    {page > 1 && (
                        <li className="page-item" aria-current="page" onClick={setPage(page - 1)}>
                            <span className="page-link">{page - 1}</span>
                        </li>
                    )}
                    <li className="page-item active">
                        <span className="page-link">{page}</span>
                    </li>
                    {page < pages && (
                        <li className="page-item">
                            <span className="page-link">{page + 1}</span>
                        </li>
                    )}
                    {page === 1 && pages > 2 && (
                        <li className="page-item">
                            <span className="page-link">{page + 2}</span>
                        </li>
                    )}
                </ul>
            </nav>
        );
    };
    return (
        <>
            <div className="header">Works</div>
            <div className="content">
                <table className="table">
                    <thead>
                        <tr>
                            <th className="text-center" scope="col" width="50">
                                #
                            </th>
                            <th width="140" scope="col" className="text-center">
                                Thumbnail
                            </th>
                            <th scope="col">Title</th>
                            <th scope="col">Type</th>
                            <th width="140" scope="col">
                                Category
                            </th>
                            <th width="120" scope="col" className="text-center">
                                Handle
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {works &&
                            works.docs.map((work, index) => (
                                <tr key={index}>
                                    <th className="text-center v-m" scope="row">
                                        {index + 1}
                                    </th>
                                    <td className="text-center">
                                        <img src={work.thumbnail} width="120" alt="" />
                                    </td>
                                    <td className="v-m">{work.title}</td>
                                    <td className="v-m">{work.type === 0 ? 'Image' : 'Video'}</td>
                                    <td className="v-m text-cat">
                                        {work.category.map((cat, i) => (
                                            <span key={i}>{cat + (i < work.category.length - 1 ? ', ' : '')}</span>
                                        ))}
                                    </td>
                                    <td className="text-center v-m">
                                        <div className="handle">
                                            <Link to={'/works/' + work._id}>Edit</Link>
                                            <Link
                                                className="mt-2 delete--btn"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    deleteWork(work._id);
                                                }}
                                            >
                                                Delete
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
                <Pagination page={works?.page ?? 1} pages={works?.pages ?? 1} />
            </div>
        </>
    );
};
export default memo(Works);
