"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function notFound(err, req, res, next) {
    res.status(404);
    res.render('error', { message: 'NOT FOUND' });
}
exports.notFound = notFound;
function internalServerError(err, req, res, next) {
    res.status(500);
    res.render('error', { message: 'Something Mysterious Happened?' });
}
exports.internalServerError = internalServerError;
