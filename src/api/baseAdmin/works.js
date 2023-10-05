import baseAdminAxios from '../../plugins/axios';
const path = 'works/';

const worksApis = {
    index: (params) => {
        return baseAdminAxios.get(path, {
            params,
        });
    },
    get: (id) => {
        return baseAdminAxios.get(path + id);
    },
    store: (body) => {
        return baseAdminAxios.post(path, body);
    },
    update: (id, body) => {
        return baseAdminAxios.put(path + id, body);
    },
    delete: (id) => {
        return baseAdminAxios.delete(path + id);
    },
};

export default worksApis;
