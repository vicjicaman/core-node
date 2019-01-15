import express from 'express';
import promise from 'bluebird';
import requestId from 'express-request-id';
import bodyParser from 'body-parser';

export const createNode = ({
  name
}, {logger}) => {

  const app = express();
  app.use(requestId());

  app.use(function(err, req, res, next) {
    logger.error({
      id: req.id,
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
