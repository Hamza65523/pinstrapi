'use strict';

/**
 * homepage router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

// module.exports = createCoreRouter('api::homepage.homepage');
module.exports = {
routes: [
    {
        method: 'POST',
        path: '/register',
        handler: 'homepage.create',
        config: {
            // middlewares: ['plugin::users-permissions.rateLimit'],
            // prefix: '',
        },
    },
    {
        method: 'POST',
        path: '/register-guest',
        handler: 'homepage.createguest',
        config: {
            // middlewares: ['plugin::users-permissions.rateLimit'],
            // prefix: '',
        },
    },
    {
        method: 'GET',
        path: '/getUser_userid',
        handler: 'homepage.getUser_userid',
        config: {
          policies: [],
          middlewares: [],
        },
       },
    {
        method: 'POST',
        path: '/login',
        handler: 'homepage.login',
        config: {
            // middlewares: ['plugin::users-permissions.rateLimit'],
            // prefix: '',
        },
    },
    {
        method: 'PUT',
        path: '/toggle',
        handler: 'homepage.toggle',
        config: {
            // middlewares: ['plugin::users-permissions.rateLimit'],
            // prefix: '',
        },
    },
    {
        method: 'PUT',
        path: '/update-user-profile',
        handler: 'homepage.updateuser',
        config: {
            // middlewares: ['plugin::users-permissions.rateLimit'],
            // prefix: '',
        },
    },
    {
        method: 'DELETE',
        path: '/delete-user',
        handler: 'homepage.deleteUser',
        config: {
            // middlewares: ['plugin::users-permissions.rateLimit'],
            // prefix: '',
        },
    },
]
}