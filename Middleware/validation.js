const fs = require('fs')
module.exports = (req,res,next) => {
    if(typeof(req.file) ==='undefined' || typeof(req.body) ==='undefined') {
        return res.status(400).json({
            errors:"Problem with Sending data"
        })
    }

    let image = req.file.path
    let name = req.body.filename

    if(!(req.file.mimetype).includes('jpeg') && !(req.file.mimetype).includes('png') && !(req.file.mimetype).includes('jpg') && !(req.file.mimetype).includes('gif')){
        fs.unlinkSync(image)
        return res.status(400).json({
            errors:"image not supported"
        })
    }
    if(req.file.size > 5000 * 5000 * 5){
        fs.unlinkSync(image)
        return res.status(400).json({
            errors:"image to large"
        })
    }

    next()
}