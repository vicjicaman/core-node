import express from 'express';
import rfs from 'rotating-file-stream';
import promise from 'bluebird';
import requestId from 'express-request-id';
import bodyParser from 'body-parser';

export const createNode = ({
  name
}, {logger}) => {

  // Api services always have a server associated
  const app = express();

  // Identify each request in id, check the header if there is any request from client
  app.use(requestId());

  // Create a child log for the node request
  app.use(function(req, res, next) {
    req.logger = logger.child({request: req.id});
    next();
  });

  app.use(function(err, req, res, next) {
    logger.info(req.id);
    req.logger.error({
      exception: {
        message: err.message,
        stack: err.stack
      }
    });
    res.json({success: false, message: "server.error.internal", requestid: req.id});
  });

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));

  return app;
}
