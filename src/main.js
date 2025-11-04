import express, {json} from 'express';
import {generateStatements} from './helpers/generateStatements.js';

const http = express();
http.use(json());

http.get('/data', (req, res) => {
    const limit = parseInt(req.query.limit) || 100;
    const page = parseInt(req.query.page);
    const perPage = parseInt(req.query.per_page);

    const data = generateStatements(limit);

    if (!isNaN(page) && !isNaN(perPage)) {
        const start = (page - 1) * perPage;
        const end = start + perPage;

        return res.json({
            page,
            perPage,
            total: data.length,
            totalPages: Math.ceil(data.length / perPage),
            data: data.slice(start, end),
        });
    }

    res.json({
        total: data.length,
        data: data,
    });
});

http.listen(3000, () => {
    console.log('Server started on port 3000');
});
