'use strict';

/**
 * pin router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

// module.exports = createCoreRouter('api::pin.pin');
///An example of customised code in a Route file
module.exports = {
    routes: [
      {
       method: 'POST',
       path: '/pin',
       handler: 'pin.createPin',
       config: {
         policies: [],
         middlewares: [],
       },
      },
      {
       method: 'GET',
       path: '/pin',
       handler: 'pin.getAllPin',
       config: {
         policies: [],
         middlewares: [],
       },
      },
      {
       method: 'GET',
       path: '/pin/:pin',
       handler: 'pin.getPinId',
       config: {
         policies: [],
         middlewares: [],
       },
      },
      {
       method: 'DELETE',
       path: '/pin/:pin',
       handler: 'pin.deletePin',
       config: {
         policies: [],
         middlewares: [],
       },
      },
      {
       method: 'PUT',
       path: '/pin/:pin',
       handler: 'pin.updatePin',
       config: {
         policies: [],
         middlewares: [],
       },
      },
    ],
  };
  
