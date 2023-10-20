'use strict';

/**
 * userlogin router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

// module.exports = createCoreRouter('api::userlogin.userlogin');
module.exports={

    routes: [
        {
     method: 'POST',
     path: '/user',
     handler: 'userlogin.createUser',
     config: {
         policies: [],
       middlewares: [],
    },
},
{
    method: 'GET',
    path: '/user/:phone',
    handler: 'userlogin.getUserPhone',
    config: {
        policies: [],
        middlewares: [],
    },
},
{
    method: 'PUT',
    path: '/user/:phone',
    handler: 'userlogin.updateUser',
    config: {
        policies: [],
        middlewares: [],
    },
},
],

}