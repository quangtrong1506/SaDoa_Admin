import { memo, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import { toast } from 'react-toastify';
import videoApis from '../../api/baseAdmin/video.js';
import worksApis from '../../api/baseAdmin/works.js';
import Sort from '../../components/_common/sort/sort.tsx';
import WorkAlbums from '../../components/_common/works/worksAlbums.js';
import WorkCategory from '../../components/_common/works/worksCategory.js';
import WorksImages from '../../components/_common/works/worksImages';
import { Swal, uploadImage } from '../../helpers/common.js';
const TYPE = [
    {
        label: 'Image',
        value: 0,
    },
    {
        label: 'Video',
        value: 1,
    },
];
const WorksForm = () => {
    const {
        formState: { errors },
        setError,
        clearErrors,
        handleSubmit,
        setValue,
        register,
    } = useForm({});
    const navigate = useNavigate();
    const { id } = useParams();
    const [category, setCategory] = useState([]);
    const [albums, setAlbums] = useState(null);
    const [type, setType] = useState(null);
    const [images, setImages] = useState([]);
    const [sort, setSort] = useState(false);
    const dataAfterSortRef = useRef([]);
    const [media_id, setMediaId] = useState(null);
    const [site_id, setSiteId] = useState(null);
    const formSubmitHandler = async (data) => {
        if (type === null) {
            Swal.fire('Type is Empty');
            return setError('type', { message: 'Type is Empty' });
        }
        if (category.length === 0) {
            Swal.fire('Category is Empty');
            return setError('category', { message: 'Category is Empty' });
        }
        if (images.length === 0 && type.value === 0) {
            return Swal.fire('Image is Empty');
        }
        let thumbnail = null;
        const a1 = [];
        // show loading
        Swal.fire({
            title: 'Uploading...',
            html: `<div>Please wait...</div>
                <div class="progress mt-3">
                    <div id="progress-bar" class="progress-bar progress-bar-striped bg-info" role="progressbar" style="width: 0%;"  aria-valuemin="0" aria-valuemax="100">0%</div>
                </div>
                `,
            allowEscapeKey: false,
            allowOutsideClick: false,
            backdrop: `
                    rgba(0,0,123,0.4)
                    url("https://sweetalert2.github.io/images/nyan-cat.gif")
                    left top
                    no-repeat
                `,
            didOpen: () => {
                Swal.showLoading();
            },
        });
        const setProcessBar = (percent) => {
            document.getElementById('progress-bar').style.width = percent + '%';
            document.getElementById('progress-bar').innerText = percent + '%';
        };
        let count = 0;
        if (type.value === 0) {
            for await (const i of images) {
                if (i.data) {
                    const res = await uploadImage(i.data);
                    a1.push(res.data.display_url);
                    if (i.isThumbnail) thumbnail = res.data.display_url;
                } else {
                    a1.push(i.src);
                    if (i.isThumbnail) thumbnail = i.src;
                }
                setProcessBar(Math.floor((count / (images.length - 1)) * 100));
                count++;
                console.log(count);
            }
        } else if (type.value === 1) {
            const info = await videoApis.info(media_id);
            if (info.success) thumbnail = info.data.playlist[0].image;
            console.log(info, info.data.playlist.image);
        }
        console.log(thumbnail);
        let res = {};
        const newCategory = [];
        category.forEach((cat) => newCategory.push(cat.label));
        const body = {
            ...data,
            thumbnail,
            albums: albums?.value,
            type: type.value,
            category: JSON.stringify(newCategory),
            images: JSON.stringify(a1),
        };
        if (!id) res = await worksApis.store(body);
        // update
        else {
            res = await worksApis.update(id, body);
        }
        if (res.success) {
            toast.success(<>Upload Completed!</>);
            Swal.fire({
                title: 'Upload Completed!',
                html: 'You have finished uploading your work?',
                icon: 'success',
                allowOutsideClick: false,
            }).then((result) => {
                navigate('/works');
            });
        } else {
            toast.error(res.message);
        }
        console.log(res);
    };

    function getSortData(data) {
        dataAfterSortRef.current = data;
    }
    const handleConfirmSort = () => {
        setSort(false);
        if (dataAfterSortRef.current.length === 0) return;
        const newImages = [];
        for (let i = 0; i < dataAfterSortRef.current.length; i++) {
            const element = dataAfterSortRef.current[i];
            newImages.push(images[element]);
        }
        setImages(newImages);
    };
    useEffect(() => {
        async function fetchData() {
            if (id) {
                const res = await worksApis.get(id);
                console.log(res);
                if (!res.success && res.status === 404)
                    Swal.fire({
                        title: '404 not found!',
                        html: 'Your work does not exist',
                        allowOutsideClick: false,
                    }).then(() => {
                        navigate('/works');
                    });
                if (res.success) {
                    setValue('title', res.data.title);
                    setType(
                        res.data.type === 0
                            ? {
                                  label: 'Image',
                                  value: 0,
                              }
                            : {
                                  label: 'Video',
                                  value: 1,
                              }
                    );
                    const c = [];
                    res.data.category.forEach((cat) => c.push({ label: cat, value: cat }));
                    setCategory(c);
                    if (res.data.type === 0) {
                        const imgs = res.data.images || [];
                        const thumbnail = res.data.thumbnail || '';
                        const a = [];
                        imgs.forEach((element) => {
                            const base = {
                                data: null,
                                src: element,
                                isThumbnail: element === thumbnail,
                            };
                            a.push(base);
                        });
                        setImages(a);
                    } else if (res.data.type === 1) {
                        setValue('media_id', res.data.media_id);
                        setMediaId(res.data.media_id);
                        setValue('site_id', res.data.site_id);
                        setSiteId(res.data.site_id);
                        if (res.data.albums)
                            setAlbums({
                                label: res.data.albums,
                                value: res.data.albums,
                            });
                    }
                }
            }
        }
        fetchData();
    }, [id]);
    return (
        <>
            <div className="header">{id ? 'Edit works' : 'Add new Works'}</div>
            <div className="content">
                <form className="row" onSubmit={handleSubmit(formSubmitHandler)}>
                    <div className="col-12 mb-3">
                        <label className="form-label">Title</label>
                        <input
                            type="text"
                            className="form-control"
                            autoCapitalize="words"
                            onKeyDown={(e) => {
                                if (e.keyCode === 13 || e.which === 13) e.preventDefault();
                            }}
                            {...register('title', {
                                required: {
                                    value: true,
                                    message: 'Title is empty',
                                },
                            })}
                        />
                        <span>{(errors?.title && <small>{errors?.title?.message}</small>) || null}</span>
                    </div>
                    <div className="col-4 mb-3">
                        <label className="form-label">Type</label>
                        <Select
                            options={TYPE}
                            value={type}
                            isSearchable={false}
                            onChange={(value) => {
                                setType(value);
                                clearErrors('type');
                            }}
                        />
                        <span>{(errors?.type && <small>{errors?.type?.message}</small>) || null}</span>
                    </div>
                    <div className="col-4 mb-3">
                        <label className="form-label">Category</label>
                        <WorkCategory
                            category={category}
                            setCategory={setCategory}
                            setError={setError}
                            clearErrors={clearErrors}
                        />
                        <span>{(errors?.category && <small>{errors?.category?.message}</small>) || null}</span>
                    </div>

                    {type?.value === 1 && (
                        <>
                            <div className="col-4 mb-3">
                                <label className="form-label">Albums</label>
                                <WorkAlbums albums={albums} setAlbums={setAlbums} />
                            </div>
                            <div className="col-4 mb-3">
                                <label className="form-label">Media id</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    onInput={(e) => {
                                        setMediaId(e.target.value);
                                    }}
                                    {...register('media_id', {
                                        required: {
                                            value: true,
                                            message: 'media_id is empty',
                                        },
                                    })}
                                />

                                <span>{(errors?.media_id && <small>{errors?.media_id?.message}</small>) || null}</span>
                            </div>
                            <div className="col-4 mb-3">
                                <label className="form-label">Site id</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    onInput={(e) => {
                                        setSiteId(e.target.value);
                                    }}
                                    {...register('site_id', {
                                        required: {
                                            value: true,
                                            message: 'site_id is empty',
                                        },
                                    })}
                                />

                                <span>
                                    {(errors?.link_iframe && <small>{errors?.link_iframe?.message}</small>) || null}
                                </span>
                            </div>
                            {site_id && media_id && (
                                <div className="col-12 mb-3">
                                    <div style={{ position: 'relative', overflow: 'hidden', paddingBottom: '56.25%' }}>
                                        <iframe
                                            src={`https://cdn.jwplayer.com/players/${media_id}-${site_id}.html`}
                                            width="100%"
                                            height="100%"
                                            frameBorder="0"
                                            scrolling="auto"
                                            title="..."
                                            style={{ position: 'absolute' }}
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                    {type?.value === 0 && (
                        <>
                            <WorksImages setImages={setImages} setSort={setSort} sort={sort} images={images} />
                            {sort && (
                                <>
                                    <div className="sort-images">
                                        <div className="sort-images__container">
                                            <Sort getData={getSortData} items={images} />
                                        </div>
                                    </div>
                                    <div className="confirm-sort">
                                        <div className="btn btn-primary" onClick={handleConfirmSort}>
                                            Confirm
                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                    {!sort && (
                        <div className="col-12 pb-5">
                            <button type="submit" className="btn btn-primary">
                                Submit
                            </button>
                            <Link to={'/works'} className="ms-2 btn btn-danger">
                                Cancel
                            </Link>
                        </div>
                    )}
                </form>
            </div>
        </>
    );
};
export default memo(WorksForm);
