import { useEffect, useState } from 'react';
import Select from 'react-select';
import { toast } from 'react-toastify';
import albumsApis from '../../../api/baseAdmin/albums';
import { Swal } from '../../../helpers/common';
const WorkAlbums = ({ albums, setAlbums }) => {
    const [ALBUMS, setALBUMS] = useState([]);
    const arrCat = [
        ...ALBUMS,
        {
            label: '+ New Albums',
            value: -1,
        },
    ];
    useEffect(() => {
        function fetchData() {
            albumsApis.index().then((res) => {
                if (res.data) {
                    const a = [];
                    res.data.docs.forEach((element) => {
                        a.push({
                            value: element.title,
                            label: element.title,
                        });
                    });
                    setALBUMS(a);
                }
            });
        }
        fetchData();
    }, []);
    return (
        <>
            <Select
                isClearable={true}
                value={albums}
                name="colors"
                options={arrCat}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={(select) => {
                    if (!select) return setAlbums(null);
                    if (select.value === -1) {
                        Swal.fire({
                            title: 'Submit new albums',
                            input: 'text',
                            showCancelButton: true,
                            confirmButtonText: 'Add new',
                            showLoaderOnConfirm: true,
                            preConfirm: (value) => {
                                let text = value;
                                if (text.length < 2) return Swal.showValidationMessage(`Min length 3`);
                                text = text.substring(0, 1).toUpperCase() + text.substring(1);
                                return albumsApis
                                    .store({ title: text })
                                    .then((response) => {
                                        console.log(response);
                                        if (!response.success) {
                                            throw new Error(response.message);
                                        }
                                        return response;
                                    })
                                    .catch((error) => {
                                        Swal.showValidationMessage(error);
                                    });
                            },
                            allowOutsideClick: () => !Swal.isLoading(),
                        }).then((result) => {
                            if (result.isConfirmed) {
                                setALBUMS((prev) => [
                                    ...prev,
                                    { value: result.value.data.title, label: result.value.data.title },
                                ]);
                                setAlbums({ value: result.value.data.title, label: result.value.data.title });
                                toast.success(<>Add albums success!</>);
                            }
                        });
                        return;
                    }
                    setAlbums(select);
                }}
            />
        </>
    );
};
export default WorkAlbums;
