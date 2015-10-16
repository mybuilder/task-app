import low from 'lowdb';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import guid from 'lite-guid';

const app = express();
app.use(bodyParser.json());
app.use(cors({ exposedHeaders: [ 'Location' ] }));
app.use((req, res, next) => setTimeout(() => next(), 500)); // simulate delay

const url = (r, p) => r.protocol + '://' + r.get('host') + r.originalUrl + (p ? `/${p}` : '');
const resource = (href, attr) => Object.assign({ _links: { self: { href } } }, attr);
const tasks = low('./tasks.json')('tasks');
const router = express.Router();

router.route('/')
    .get((req, res) =>
        res.json(
            resource(url(req), { tasks: tasks.map(t => resource(url(req, t.id), t)) })))

    .post((req, res) => {
        const id = guid.create();
        const message = req.body.message;

        if (message == 'error') return res.status(400).end();

        tasks.push({ id, message });
        return res
            .location(url(req, id))
            .status(201)
            .json();
    });

router.route('/:id')
    .get((req, res) =>
        res.json(
            resource(url(req), tasks.find({ id: req.params.id }))))

    .put((req, res) => {
        const message = req.body.message;

        if (message == 'error') return res.status(400).end();

        tasks
            .chain()
            .find({ id: req.params.id })
            .assign({ message })
            .value();

        return res
            .location(url(req))
            .status(204)
            .json();
    })

    .delete((req, res) => {
        tasks.remove({ id: req.params.id });
        return res
            .status(204)
            .json();
    });

app.use('/tasks', router);

export default app;
