const mongoose = require('mongoose');
const Link = require('../models/link.model');

exports.addLink = link =>
   new Promise((resolve, reject) => {
     Link.findOne({link: link}, (err, doc) => {
       if(err) reject(err);
       else if(doc) resolve();
       else {
         Link.create({link: link, visited: false}, (err, link) => {
           if(err) reject(err);
           resolve(link && link.toObject());
         });
       }
     });
   });

exports.getAllLinks = () => new Promise((resolve, reject) => {
  Link
    .find({ visited: false })
    .exec((error, results) => {
      if (error) {
        reject(error);
      }
      const links = (results || []).map(link => link && link.toObject().link);
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

exports.makeVisited = url => new Promise((resolve, reject) => {
  Link.findOneAndUpdate({ link: url }, { visited: true }, {new: true}, (error, link) => {
    if (error) {
      reject(error);
    }
    resolve(link && link.toObject());
  });
});