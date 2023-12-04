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
        path: '/get-user-phone/:phone',
        handler: 'homepage.getUser',
        config: {
            // middlewares: ['plugin::users-permissions.rateLimit'],
            // prefix: '',
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
        path: '/toggle/:phone',
        handler: 'homepage.toggle',
        config: {
            // middlewares: ['plugin::users-permissions.rateLimit'],
            // prefix: '',
        },
    },
    {
        method: 'PUT',
        path: '/update-user-profile/:phone',
        handler: 'homepage.updateuser',
        config: {
            // middlewares: ['plugin::users-permissions.rateLimit'],
            // prefix: '',
        },
    },
]
}