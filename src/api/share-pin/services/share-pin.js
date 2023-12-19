'use strict';

/**
 * share-pin service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::share-pin.share-pin');
