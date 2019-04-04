'use strict';
const app = require('./server');
const port = process.env.PORT || 4201;
app.listen(port, () =>
	console.log(`Server is listening on port ${port}.`)
);
