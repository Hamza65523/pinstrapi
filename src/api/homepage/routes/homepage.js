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
        path: '/login',
        handler: 'homepage.create',
        config: {
            // middlewares: ['plugin::users-permissions.rateLimit'],
            // prefix: '',
        },
    },
]
}