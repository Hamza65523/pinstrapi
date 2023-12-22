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
      where: {"phone": phoneNumber,"expireToken":{$gt:Date.now()}}
    });
    return pins;
  },
  async get_pin_userId(ctx) {
    const { user } = ctx.query;
    if (!user) {
      return ctx.badRequest('Phone number is required.');
    }
    // Retrieve pins by phone number
    const pins = await strapi.db.query('api::pin.pin').findMany({
      where: {"user": user,}
    });
    ctx.send({data:pins})
  },
async createPin(ctx){
  

    const {isDefaultPin,  latitude, longitude,name,address,pic,categoryId,customMinutes,isDefault,pin,user} = ctx.request.body;
    if (!latitude||!longitude||!name||!categoryId) {
      return ctx.throw(404, 'all fields are required bro please yar');
    }
    let data={
      latitude,
      longitude,
      name,
      isDefaultPin,
      categoryId,
      publishedAt:Date.now(),
      pin,
      resetToken:generateRandomToken(8),
      isDefault,
      expireToken: isDefault ? new Date('2100-01-01T00:00:00Z') : new Date(Date.now() + customMinutes * 60 * 1000),
    }
    if(address){
      data.address=address
    }
    if(user){
      data.user=user
    }
    if(pic){
      data.pic=pic
    }
    const posts = await strapi.db.query('api::pin.pin').create({data:data,populate:['pic','categoryId','user']}
    );
    const sanitizedEntity = await this.sanitizeOutput(posts, ctx);
    
    return this.transformResponse(sanitizedEntity);
  },
async create_category(ctx){
  

    const {  name, user} = ctx.request.body;
    if (!name||!user) {
      return ctx.throw(404, 'all fields are required bro please yar');
    }
    let data={
      user,
      name,
      publishedAt:Date.now(),
    }
    const posts = await strapi.db.query('api::category.category').create({data:data,populate:['user']}
    );
    const sanitizedEntity = await this.sanitizeOutput(posts, ctx);
    
    return this.transformResponse(sanitizedEntity);
  },
async createsharepin(ctx){
  
    const {  to_userid, from_userid,pin_id,categoryId} = ctx.request.body;
    if (!to_userid||!from_userid||!pin_id) {
      return ctx.throw(404, 'all fields are required bro please yar');
    }
    let data={
      to_userid, from_userid,pin_Id:pin_id,
      publishedAt:Date.now(),
    }
    if(categoryId){
      data.categoryId = categoryId;
    }
    const posts = await strapi.db.query('api::share-pin.share-pin').create({data:data,populate:["to_userid", "from_userid","pin_id"]}
    );
    const sanitizedEntity = await this.sanitizeOutput(posts, ctx);
    
    return this.transformResponse(sanitizedEntity);
  },
async getCategory_user_id(ctx){
  const {user}= ctx.query
  console.log(user)
    
    if (!user) {
      return ctx.throw(404, 'all fields are required bro please yar');
    }
    const posts = await strapi.db.query('api::category.category').findMany({
      where: {"user":user},
      populate:['user']
    },);

    ctx.send(posts)
  },
async getpin_by_categoryId(ctx){
  const {categoryId}= ctx.query

    
    if (!categoryId) {
      return ctx.throw(404, 'all fields are required bro please yar');
    }
    const posts = await strapi.db.query('api::pin.pin').findMany({
      where: {"categoryId":categoryId},
      populate:['pic','categoryId','user']
    },);

    ctx.send({data:posts})
  },
async getpin_by_categoryId_userid(ctx){
  const {categoryId,user_id}= ctx.query
    
    if (!categoryId||!user_id) {
      return ctx.throw(404, 'all fields are required bro please yar');
    }
    
    const createdPins = await strapi.entityService.findMany('api::pin.pin', {
      where: {
        user:user_id,
        categoryId:categoryId
      },
      populate:['pic','categoryId','user']
              });

    const sharedPins = await strapi.entityService.findMany('api::share-pin.share-pin', {
      where: {"to_userid":user_id,'categoryId':categoryId},
      populate:['categoryId','pin_Id','pin_Id.pic','to_userid']
              });
              
    const formattedData = sharedPins.map(obj => ({
      ...obj.pin_Id,
      user: obj.to_userid, // Rename to_userid to user
      categoryId: obj.categoryId, // Rename to_userid to user
    }));
    
    const allPins = [...createdPins, ...formattedData];

    ctx.send({data:allPins})
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
  where: {"phone": phone,"isDefaultPin":true},
  populate:{
    categoryId:true
  }
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
