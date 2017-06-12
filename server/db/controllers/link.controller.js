const linkService = require('../services/link.service');


exports.createLink = (request, response) => {
  console.log('adding new link');
  linkService.addLink(request.body)
    .then((addedLink) => {
      response.status(201).send(addedLink);
    })
    .catch((error) => {
      response.status(422).send(error);
    });
};

exports.getAllLinks = (request, response) => {
  console.log('Getting all links');
  linkService.getAllLinks()
    .then((links) => {
      response.status(200).send(links);
    })
    .catch((error) => {
      response.status(404).send(error);
    });
};

exports.getLinkByUrl = (request, response) => {
  console.log(`Getting link by url: ${request.params.link}`);
  linkService.getLinkByUrl(request.params.link)
    .then((link) => {
      response.status(200).send(link);
    })
    .catch((error) => {
      response.status(404).send(error);
    });
};