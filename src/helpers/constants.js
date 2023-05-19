export const USER = {
    levels: {
        super_admin: {
            value: 1,
            label: 'Super Admin'
        },
        admin: {
            value: 2,
            label: 'Admin'
        },
        user: {
            value: 3,
            label: 'User'
        },
    },
}

export const USER_IMPORT = {
    status: {
        pending: {
            value: 1,
            label: 'Đang chờ'
        },
        processing: {
            value: 2,
            label: 'Đang diễn ra'
        },
        done: {
            value: 3,
            label: 'Hoàn thành'
        },
    },
    has_errors: {
        true: 1,
        false: 2,
    },
}