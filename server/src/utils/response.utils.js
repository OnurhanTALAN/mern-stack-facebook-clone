
export const response400 = (res, message = 'Bad request.') => {
    return res.status(400).json({ success : false, message : message});
}
