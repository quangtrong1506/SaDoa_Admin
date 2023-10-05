import MySwal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
export const Swal = withReactContent(MySwal);
export function scrollToTop() {
    window.scrollTo({
        left: 0,
        top: 0,
        behavior: 'smooth',
    });
}
export function setTitle(title) {
    document.title = title ?? 'Home';
}
export const stringToSlug = (str) => {
    if (!str) return '';
    // remove accents
    var from = 'àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ',
        to = 'aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy';
    for (var i = 0, l = from.length; i < l; i++) {
        str = str.replace(RegExp(from[i], 'gi'), to[i]);
    }

    str = str
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-');

    return str;
};
export const uploadImage = async (image, option = {}) => {
    try {
        const data = new FormData();
        if (typeof image === 'string' && image.match('base64,')) data.append('image', image.split('base64,')[1]);
        else data.append('image', image);
        let params = '?key=' + process.env.REACT_APP_IMGBB_KEY;
        if (option.name) params += '&name=' + stringToSlug(option.name);
        var requestOptions = {
            method: 'POST',
            body: data,
            redirect: 'follow',
        };

        const res = await fetch(process.env.REACT_APP_IMGBB_DOMAIN + params, requestOptions);
        const result = await res.json();
        return result;
    } catch (error) {
        return {
            success: false,
            error: {
                message: error.message,
            },
        };
    }
};
