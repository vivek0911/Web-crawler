const mongoose = require('mongoose');
const Link = require('../models/link.model');

exports.addLink = link =>
   new Promise((resolve, reject) => {
     Link.create(link, (error, addedLink) => {
       if (error) {
         console.log(`Error adding link ${JSON.stringify(error)}`);
         reject(error);
       }
       resolve(addedLink && addedLink.toObject());
     });
   });

exports.getAllLinks = () => new Promise((resolve, reject) => {
  Link
    .find({})
    .exec((error, results) => {
      if (error) {
        reject(error);
      }
      const links = (results || []).map(link => link && link.toObject());
      resolve(links);
    });
});

exports.getLinkByUrl = url => new Promise((resolve, reject) => {
  Link.find({ link: url }, (error, link) => {
    if (error) {
      reject(error);
    }
    resolve(link && link.toObject());
  });
});