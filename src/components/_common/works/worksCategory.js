import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { toast } from 'react-toastify';
import categoryApis from '../../../api/baseAdmin/category';
import { setInitialValue } from '../../../features/category/themeSlice';
import { Swal } from '../../../helpers/common';
const WorkCategory = ({ category, setCategory, clearErrors, setError }) => {
    const dispatch = useDispatch();
    const CAT = useSelector((state) => state.category) || [];
    const arrCat = [
        ...CAT,
        {
            label: '+ Add new category',
            value: -1,
        },
    ];
    return (
        <>
            <Select
                value={category}
                isMulti
                name="category"
                options={arrCat}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={(value) => {
                    if (value.find((cat) => cat.value === -1)) {
                        Swal.fire({
                            title: 'Submit new category',
                            input: 'text',
                            showCancelButton: true,
                            confirmButtonText: 'Add new',
                            showLoaderOnConfirm: true,
                            preConfirm: (value) => {
                                let text = value;
                                if (text.length < 2) return Swal.showValidationMessage(`Min length 3`);
                                text = text.substring(0, 1).toUpperCase() + text.substring(1);
                                return categoryApis
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
                                dispatch(
                                    setInitialValue([
                                        ...CAT,
                                        { value: result.value.data.title, label: result.value.data.title },
                                    ])
                                );
                                setCategory([
                                    ...category,
                                    { value: result.value.data.title, label: result.value.data.title },
                                ]);
                                toast.success(<>Add category success!</>);
                            }
                        });
                        return;
                    }
                    setCategory(value);
                    if (value.length > 0) clearErrors('category');
                    else setError('category', { message: 'Category is empty' });
                }}
            />
        </>
    );
};
export default WorkCategory;
