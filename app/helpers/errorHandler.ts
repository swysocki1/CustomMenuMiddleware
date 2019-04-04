export function notFound(err: any, req: any, res: any, next: any) {
	res.status(404);
	res.render('error', { message: 'NOT FOUND' });
}
export function internalServerError(err: any, req: any, res: any, next: any) {
	res.status(500);
	res.render('error', { message: 'Something Mysterious Happened?' });
}