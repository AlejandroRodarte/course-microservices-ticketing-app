import { RequestHandler } from 'express';

const healthz: RequestHandler = (req, res) => {
    res.send({ message: 'OK' });
};

export default healthz;