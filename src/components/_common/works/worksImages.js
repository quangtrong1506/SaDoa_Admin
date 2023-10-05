import { memo } from 'react';
import { FileUploader } from 'react-drag-drop-files';

const WorksImages = ({ sort, images, setSort, setImages }) => {
    const handleChangeUploadFile = (files) => {
        const add = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const base = {
                src: null,
                data: null,
                isThumbnail: false,
            };
            if (images.length === 0 && i === 0) {
                base['isThumbnail'] = true;
            }
            base.data = file;
            base.src = URL.createObjectURL(file);
            add.push(base);
        }
        setImages((prev) => [...prev, ...add]);
    };
    function deleteImage(index) {
        const a = [...images];
        const s = a.splice(index, 1);
        if (s[0].isThumbnail === true) a[0].isThumbnail = true;
        setImages(a);
    }
    function setAsThumbnail(index) {
        const a = [...images];
        for (var i = 0; i < a.length; ++i) a[i].isThumbnail = false;
        a[index].isThumbnail = true;

        setImages(a);
    }
    return (
        <div className="col-12">
            <div className="row">
                {!sort && (
                    <div className="col-12">
                        <div className="row">
                            {images.map((image, index) => (
                                <div className="col-3 mb-1" key={index}>
                                    <div className="row-image">
                                        <img src={image.src} alt={image.src} />
                                        <div className="button">
                                            <div
                                                className="set-as btn btn-light"
                                                onClick={() => {
                                                    setAsThumbnail(index);
                                                }}
                                            >
                                                Set as Thumbnail
                                            </div>
                                            <div
                                                className="delete btn btn-danger"
                                                onClick={() => {
                                                    deleteImage(index);
                                                }}
                                            >
                                                Delete
                                            </div>
                                        </div>
                                        {image.isThumbnail && <div className="is-thumbnail">Thumbnail</div>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {!sort && images.length > 1 && (
                    <div className="col-12 mt-2">
                        <div
                            className="btn btn-primary"
                            onClick={() => {
                                setSort(true);
                            }}
                        >
                            Sort
                        </div>
                    </div>
                )}
                {!sort && (
                    <div className="col-12 mt-3 mb-3">
                        <FileUploader
                            handleChange={handleChangeUploadFile}
                            name="file"
                            types={['png', 'jpg', 'jpeg', 'webp']}
                            multiple={true}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
export default memo(WorksImages);
