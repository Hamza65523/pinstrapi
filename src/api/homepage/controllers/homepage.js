"use strict";

/**
 *  homepage controller
 */

const { createCoreController, pro } = require("@strapi/strapi").factories;
const { getService } = require("@strapi/plugin-users-permissions/server/utils");
const {
  validateCallbackBody,
} = require("@strapi/plugin-users-permissions/server/controllers/validation/auth");

module.exports = createCoreController(
  "api::homepage.homepage",
  ({ strapi }) => ({
    async getUser(ctx) {
      const { phone } = ctx.request.params;
      if (!phone) return ctx.badRequest("missing.phone");
      // if (!username) return ctx.badRequest('missing.username');
      const userWithThisNumber = await strapi
        .query("plugin::users-permissions.user")
        .findMany({
          where: {
            phone,
          },
        });
      if (userWithThisNumber) {
        return ctx.send({
          users: userWithThisNumber,
          message: "Phone already taken.",
          field: ["phone"],
        });
      }
    },
    async create(ctx) {
      const { phone } = ctx.request.body;

      if (!phone) return ctx.badRequest("missing.phone");
      // if (!username) return ctx.badRequest('missing.username');

      const userWithThisNumber = await strapi
        .query("plugin::users-permissions.user")
        .findOne({
          where: {
            phone,
          },
        });
      if (userWithThisNumber) {
        return ctx.send({
          id: "Auth.form.error.phone.taken",
          message: "Phone already taken.",
          field: ["phone"],
        });
      }

      const token = Math.floor(Math.random() * 90000) + 10000;

      const user = {
        username: "user-" + token,
        phone,
        email: "email" + token + "@gmail.com",
        provider: "local",
        token,
      };

      const advanced = await strapi
        .store({
          environment: "",
          type: "plugin",
          name: "users-permissions",
          key: "advanced",
        })
        .get();

      const defaultRole = await strapi
        .query("plugin::users-permissions.role")
        .findOne({ type: advanced.default_role }, []);

      user.role = defaultRole.id;

      try {
        const data = await strapi.plugins[
          "users-permissions"
        ].services.user.add(user);
        //   ctx.created(sanitizeUser(data));
        ctx.send({ data, status: true });
        //   const data = await strapi.db.query('api::users-permissions').create({data:user})
        //   ctx.send({user,status:true})
      } catch (error) {
        ctx.send(error);
      }
    },
    async createguest(ctx) {
      const { email,name } = ctx.request.body;

      if (!email) return ctx.badRequest("missing.email");
      if (!name) return ctx.badRequest("missing.name");
      // if (!username) return ctx.badRequest('missing.username');

      const userWithThisNumber = await strapi
        .query("plugin::users-permissions.user")
        .findOne({
          where: {
            email,
          },
        });
      if (userWithThisNumber) {
        return ctx.send({
          id: "Auth.form.error.email.taken",
          message: "Email already taken.",
          field: ["email"],
        });
      }

      const token = Math.floor(Math.random() * 90000) + 10000;

      const user = {
        username: "GuestUser-" + name,
        email:email,
        provider: "local",
        token,
      };

      const advanced = await strapi
        .store({
          environment: "",
          type: "plugin",
          name: "users-permissions",
          key: "advanced",
        })
        .get();

      const defaultRole = await strapi
        .query("plugin::users-permissions.role")
        .findOne({ type: advanced.default_role }, []);

      user.role = defaultRole.id;

      try {
        const data = await strapi.plugins[
          "users-permissions"
        ].services.user.add(user);
        //   ctx.created(sanitizeUser(data));
        ctx.send({ data, status: true });
        //   const data = await strapi.db.query('api::users-permissions').create({data:user})
        //   ctx.send({user,status:true})
      } catch (error) {
        ctx.send(error);
      }
    },
    async login(ctx) {
      const { phone } = ctx.request.body;

      if (!phone) return ctx.badRequest("missing.phone");
      // if (!username) return ctx.badRequest('missing.username');

      const userWithThisNumber = await strapi
        .query("plugin::users-permissions.user")
        .findOne({
          where: {
            phone,
          },
          populate:true
        });

      if (!userWithThisNumber) {
        return ctx.send({
          message: "Phone Not found.",
          field: ["phone"],
        });
      }
      const token = Math.floor(Math.random() * 90000) + 10000;
      try {
        ctx.send({ userWithThisNumber, token, status: true });
      } catch (error) {
        ctx.send(error);
      }
    },
    async toggle(ctx) {
      const { phone } = ctx.params;

      const updatedPin = await strapi.db
        .query("plugin::users-permissions.user")
        .update({
          where: {
            phone: phone,
          },
          data: {
            confirmed: true,
          },
        });
      try {
        if (!updatedPin) {
          return ctx.throw(404, "User not found");
        }

        ctx.send({ updatedPin, status: true });
      } catch (error) {
        ctx.send(error);
      }
    },
    async updateuser(ctx) {
      const { phone } = ctx.request.params;
      const { username, image } = ctx.request.body.data;
      const updatedPin = await strapi.db
        .query("plugin::users-permissions.user")
        .update({
          where: {
            phone: phone,
          },
          data: {
            username,
            image,
          },
        });

      if (!updatedPin) {
        return ctx.throw(404, "User not found");
      }
      const sanitizedEntity = await this.sanitizeOutput(updatedPin, ctx);
      return this.transformResponse(sanitizedEntity);
    },
  })
);
