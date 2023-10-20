'use strict';

/**
 * userlogin service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::userlogin.userlogin');
