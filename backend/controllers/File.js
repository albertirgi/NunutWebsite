export const getFile = async (req, res) => {
    try {
        const filename = req.params.filename
        const extension = filename.split('.').pop()
        const url = `https://storage.googleapis.com/nunut-da274.appspot.com/${filename}`;
        if(extension === 'jpg' || extension === 'png'|| extension === 'jpeg'|| extension === 'gif'|| extension === 'svg'|| extension === 'webp'|| extension === 'bmp'|| extension === 'ico'|| extension === 'tiff'|| extension === 'jfif'|| extension === 'pjpeg'|| extension === 'pjp' || extension == 'HEIC') {
            res.render('image', {url: url})
        }else{
            res.render('file', {url: url})
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving file',
            data: error.toString(),
            status: 500
        })
    }
}
