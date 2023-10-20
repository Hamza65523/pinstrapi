'use strict';

/**
 *  userlogin controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::userlogin.userlogin',({strapi})=>({
    
  async createUser(ctx){
    const { phone} = ctx.request.body;
    if (!phone) {
      return ctx.throw(404, 'phone is required');
    }
    
    const userWithThisNumber = await strapi
      .query('api::userlogin.userlogin')
      .findOne( { where: {
        phone,
    },} );
    if (userWithThisNumber) {
      return ctx.send({
          message: 'Phone already taken.',
          status:false
        })
      ;
    }

    const user = await strapi.db.query('api::userlogin.userlogin').create({data:{
      phone,
      userverified:true
    }});
    const sanitizedEntity = await this.sanitizeOutput(user, ctx);
    
    return this.transformResponse(sanitizedEntity);
  },
  
  async getUserPhone(ctx){
    const phone = ctx.request.params.phone;
  const posts = await strapi.db.query('api::userlogin.userlogin').findOne({
  where: {"phone": phone,}
});
if (!posts) {
  return ctx.throw(404, 'User not found');
}
    const sanitizedEntity = await this.sanitizeOutput(posts, ctx);
    return this.transformResponse(sanitizedEntity);
  },
  async updateUser(ctx) {
    const {phone } = ctx.params;
    const {image,username } = ctx.request.body;
    
    // Find the product by its ID
    const userWithThisNumber = await strapi
      .query('api::userlogin.userlogin')
      .findOne( { where: {
        phone,
    },} );
    if (!userWithThisNumber) {
      return ctx.throw(404, 'User not found');
    }
    const updatedPin = await strapi.db.query('api::userlogin.userlogin').update({
        where: {
            phone: phone
        },
        data: {
            username:username,
            image:3,
        }
    });

    // Send a response with the updated product data
    const sanitizedEntity = await this.sanitizeOutput(updatedPin, ctx);
    return this.transformResponse(sanitizedEntity);
  }
  
// async updateUser(ctx) {
//     const { phone } = ctx.request.params;
//   console.log(ctx.request.files)
//     // Assuming you have uploaded the new profile picture to Strapi and have the file details
//     const { pic } = ctx.request.files;
  
//     if (!pic) {
//       return ctx.throw(400, 'Profile picture is missing');
//     }
  
//     // Find the user by phone number
//     const user = await strapi.query('user').findOne({ phone });
  
//     if (!user) {
//       return ctx.throw(404, 'User not found');
//     }
  
//     // Update the user's profile picture
//     const uploadResponse = await strapi.plugins.upload.services.upload.uploadToEntity({
//       files: pic, 
//       ref: 'user', // The name of the model associated with the user
//       refId: user.id,
//       source: 'users-permissions', // Or another plugin name
//     });
  
//     // Extract the new profile picture URL from the upload response
//     const newProfilePictureUrl = uploadResponse[0].url;
  
//     // Update the user's profile picture URL in the user model
//     user.profilePicture = newProfilePictureUrl;
//     await user.save();
  
//     // Send a response with the updated user's data
//     const sanitizedEntity = await this.sanitizeOutput(user, ctx);
//     return this.transformResponse(sanitizedEntity);
//   }
}));
