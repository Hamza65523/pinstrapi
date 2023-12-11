'use strict';
const {getService} = require("@strapi/plugin-users-permissions/server/utils");
const axios = require('axios')
/**
 * A set of functions called "actions" for `pin`
 */

const {createCoreController} = require('@strapi/strapi').factories;

function generateRandomPIN() {
  const length = 6; // You can adjust the length as needed
  const characters = '0123456789';
  let pin = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    pin += characters.charAt(randomIndex);
  }
  return pin;
}
function generateRandomToken(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';

  for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      token += characters[randomIndex];
  }

  return token;
}

module.exports = createCoreController('api::pin.pin', ({strapi}) => ({
  async createPinss(ctx) {
    const { phoneNumber, pin } = ctx.request.body;

    if (!phoneNumber || !pin) {
      return ctx.badRequest('Phone number and pin are required.');
    }

    // Create a new pin record
    const newPin = await strapi.entityService.create('api::pin.pin', {
      data: {
        phoneNumber,
        pin,
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: new Date(),
      },
      populate: ['user'],
    });
    return newPin;
  },

  async findByPhoneNumber(ctx) {
    const { phoneNumber } = ctx.params;
    if (!phoneNumber) {
      return ctx.badRequest('Phone number is required.');
    }

    // Retrieve pins by phone number
    const pins = await strapi.db.query('api::pin.pin').findMany({
      where: {"phone": phoneNumber}
    });
    return pins;
  },
async createPin(ctx){
    const {  latitude, longitude,name,address,locationType,customMinutes,phone} = ctx.request.body;
    if (!latitude||!longitude||!name||!address||!locationType||!customMinutes||!phone) {
      return ctx.throw(404, 'all fields are required bro please yar');
    }
    const posts = await strapi.db.query('api::pin.pin').create({data:{
      latitude,
      longitude,
      address, 
      name,
      phone,
      locationType,
      publishedAt:Date.now(),
      pin:generateRandomPIN(),
      resetToken:generateRandomToken(8),
      expireToken:new Date(Date.now() + customMinutes * 60 * 1000), 
    },populate:true}
    );
    const sanitizedEntity = await this.sanitizeOutput(posts, ctx);
    
    return this.transformResponse(sanitizedEntity);
  },
async fcmNotification(ctx){
    const {token, title,body} = ctx.request.body;
    if (!token||!title||!body) {
      return ctx.throw(404, 'all fields are required bro please yar');
    }
    // Define the data to be sent
    const data = JSON.stringify({
      "to":token,
      "notification": {
        "body": body,
        "title":title
      }
    })
    const {status} = await axios.post(`https://fcm.googleapis.com/fcm/send`, data,{
      headers: {
        'Authorization': 'key=AAAA19vPNWs:APA91bEM8cqLi91kiGgeAaUowVcYn8nza3D0ZAZuvo2szSdKjyRtTCdws5hsXEbFjjUCbdU8k3HjZTGcft__nB0SLeRRTQef17gSuZ4v4Ga1EhLHLQUO6WwnNPZqPpZSdM-Y55jBm2k6',
        "Content-Type":"application/json"
      },
    });
    if(status==200 ){
    const notification = await strapi.db.query('api::notification.notification').create({data:{
      token,
      title,
      body,
      publishedAt:Date.now(),
    },populate:true}
    );
    const sanitizedEntity = await this.sanitizeOutput(notification, ctx);
    return this.transformResponse(sanitizedEntity);
  }else{
    ctx.send('error')
  }

  },
  async getAllPin(ctx){
    const posts = await strapi.db.query('api::pin.pin').findMany();
   
    const sanitizedEntity = await this.sanitizeOutput(posts, ctx);
    return this.transformResponse(sanitizedEntity);
  },
  async getPinId(ctx){
    const pin = ctx.request.params.pin;
    console.log(pin,'lpin')
    const posts = await strapi.db.query('api::pin.pin').findOne({
      where: {"pin": pin,"expireToken":{$gt:Date.now()}},
      populate:true
    },);
if (!posts) {
  return ctx.throw(404, 'Pin not found or expired');
}

    // .findOne({where: {"PrimaryPhone": phone}});
    // const posts = await strapi.db.query('api::post.post').findMany({
    //   where: {
    //     "users_permissions_user": id,
    //   },
    // });
    const sanitizedEntity = await this.sanitizeOutput(posts, ctx);
    return this.transformResponse(sanitizedEntity);
  },
  async getsavepinPhone(ctx){
    const phone = ctx.request.params.phone;
  const posts = await strapi.db.query('api::savepin.savepin').findMany({
  where: {"phone": phone},
  populate: true,

});
if (!posts) {
  return ctx.throw(404, 'Pin not found');
}
    const sanitizedEntity = await this.sanitizeOutput(posts, ctx);
    return this.transformResponse(sanitizedEntity);
  },
  async getPinNumber(ctx){
    const phone = ctx.request.params.phone;
  const posts = await strapi.db.query('api::pin.pin').findOne({
  where: {"phone": phone}
});
if (!posts) {
  return ctx.throw(404, 'Pin not found');
}

    // .findOne({where: {"PrimaryPhone": phone}});
    // const posts = await strapi.db.query('api::post.post').findMany({
    //   where: {
    //     "users_permissions_user": id,
    //   },
    // });
    const sanitizedEntity = await this.sanitizeOutput(posts, ctx);
    return this.transformResponse(sanitizedEntity);
  },
  async deletePin(ctx){
    const pinId = ctx.request.params.pin; // Assuming the parameter is 'id'
    const deletedPin = await strapi.db.query('api::pin.pin').delete({
        where: { pin: pinId }
    });

    if (!deletedPin) {
        return ctx.throw(404, 'Pin not found');
    }

    return this.transformResponse(deletedPin);
  },
  async updatePin(ctx) {
    const pinId = ctx.request.params.pin;
    const {
        latitude,
        longitude,
        name,
        address,
        locationType,
        customMinutes
    } = ctx.request.body;

    const updatedPin = await strapi.db.query('api::pin.pin').update({
        where: {
            pin: pinId
        },
        data: {
            latitude,
            longitude,
            address,
            name,
            locationType,
            resetToken: generateRandomToken(8),
            expireToken: new Date(Date.now() + customMinutes * 60 * 1000),
        }
    });

    if (!updatedPin) {
        return ctx.throw(404, 'Pin not found');
    }

    const sanitizedEntity = await this.sanitizeOutput(updatedPin, ctx);
    return this.transformResponse(sanitizedEntity);
  },
  

}));
