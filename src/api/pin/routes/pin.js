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
       path: '/createsavepin',
       handler: 'pin.createPinss',
       config: {
         policies: [],
         middlewares: [],
       },
      },
      {
       method: 'POST',
       path: '/send-notification',
       handler: 'pin.fcmNotification',
       config: {
         policies: [],
         middlewares: [],
       },
      },
      {
       method: 'GET',
       path: '/findpinbynumber/:phoneNumber',
       handler: 'pin.findByPhoneNumber',
       config: {
         policies: [],
         middlewares: [],
       },
      },
      {
       method: 'GET',
       path: '/get_pin_userId',
       handler: 'pin.get_pin_userId',
       config: {
         policies: [],
         middlewares: [],
       },
      },
      {
       method: 'GET',
       path: '/get_category_userid',
       handler: 'pin.getCategory_user_id',
       config: {
         policies: [],
         middlewares: [],
       },
      },
      {
       method: 'GET',
       path: '/getpin_by_categoryId',
       handler: 'pin.getpin_by_categoryId',
       config: {
         policies: [],
         middlewares: [],
       },
      },
      {
       method: 'POST',
       path: '/create_category',
       handler: 'pin.create_category',
       config: {
         policies: [],
         middlewares: [],
       },
      },
      {
       method: 'GET',
       path: '/getsavepinsbynumber/:phone',
       handler: 'pin.getsavepinPhone',
       config: {
         policies: [],
         middlewares: [],
       },
      },
      {
       method: 'GET',
       path: '/get-pin-byphone/:phone',
       handler: 'pin.getPinNumber',
       config: {
         policies: [],
         middlewares: [],
       },
      },
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
  
