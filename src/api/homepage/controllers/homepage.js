'use strict';

/**
 *  homepage controller
 */

const { createCoreController,pro } = require('@strapi/strapi').factories;
const { getService } = require("@strapi/plugin-users-permissions/server/utils");
const { validateCallbackBody } = require("@strapi/plugin-users-permissions/server/controllers/validation/auth");

module.exports = createCoreController('api::homepage.homepage', ({strapi}) => ({
    
async create(ctx) {

    const { phone, username } = ctx.request.body;

    if (!phone) return ctx.badRequest('missing.phone');
    if (!username) return ctx.badRequest('missing.username');


    const userWithThisNumber = await strapi
      .query('plugin::users-permissions.user')
      .findOne( { where: {
        phone,
    },} );
    console.log(userWithThisNumber)
    if (userWithThisNumber) {
      return ctx.send({
          id: 'Auth.form.error.phone.taken',
          message: 'Phone already taken.',
          field: ['phone'],
        })
      ;
    }

    const token = Math.floor(Math.random() * 90000) + 10000;
    
    const user = {
			username,
      phone,
      email:'kldsfjljdlk@gmail.com',
      provider: 'local',
      token
    };

    const advanced = await strapi
      .store({
        environment: '',
        type: 'plugin',
        name: 'users-permissions',
        key: 'advanced',
      })
      .get();

    const defaultRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ type: advanced.default_role }, []);

    user.role = defaultRole.id;

    try {
      const data = await strapi.plugins['users-permissions'].services.user.add(user);
    //   ctx.created(sanitizeUser(data));
        ctx.send({data,status:true})
      //   const data = await strapi.db.query('api::users-permissions').create({data:user})
    //   ctx.send({user,status:true})
    } catch (error) {
        ctx.send(error)
    }
  },
async toggle(ctx) {

    const { phone, username } = ctx.request.body;

    if (!phone) return ctx.badRequest('missing.phone');
    if (!username) return ctx.badRequest('missing.username');


    const userWithThisNumber = await strapi
      .query('plugin::users-permissions.user')
      .findOne( { where: {
        phone,
        username,
    },} );
    if (!userWithThisNumber) {
      return ctx.send({
          id: 'Auth.form.error.phone.taken',
          message: 'Phone not found.',
          field: ['phone','username'],
        })
      ;
    }

    
    const user = {
      username,   
      phone,
      email:'kldsfjljdlk@gmail.com',
    //   provider: 'local',
    //   token
    };

    const advanced = await strapi
      .store({
        environment: '',
        type: 'plugin',
        name: 'users-permissions',
        key: 'advanced',
      })
      .get();

    const defaultRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ type: advanced.default_role }, []);

    user.role = defaultRole.id;

    try {
        const updatedPin = await strapi.db.query('api::users-permissions.user').update({
            where: {
                phone: phone
            },
            data: {
                confirmed:true
            }
        });
    
        if (!updatedPin) {
            return ctx.throw(404, 'Pin not found');
        }
    //   const data = await strapi.plugins['users-permissions'].services.user.update(user);
    //   ctx.created(sanitizeUser(data));
        ctx.send({data,status:true})
      //   const data = await strapi.db.query('api::users-permissions').create({data:user})
    //   ctx.send({user,status:true})
    } catch (error) {
        ctx.send(error)
    }
  }
}));
