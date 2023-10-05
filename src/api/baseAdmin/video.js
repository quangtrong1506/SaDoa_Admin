import videoAxios from '../../plugins/videoAxios';
const baseRoute = '';
const videoApis = {
    info: (id) => {
        return videoAxios.get(baseRoute + 'v2/media/' + id);
    },
};

export default videoApis;
