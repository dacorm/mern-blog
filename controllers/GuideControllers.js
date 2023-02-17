import GuideModel from '../models/guide.js'

export const getAll = async (req, res) => {
    try {
        const posts = await GuideModel.find().populate('user').exec();

        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить гайды',
        });
    }
}

export const update = async (req, res) => {
    try {
        const guideId = req.params.id;

        await GuideModel.updateOne({
            heroId: guideId,
        }, {
            title: req.body.title,
            text: req.body.text,
            user: req.userId,
            heroId: req.heroId,
        });

        res.json({
            success: true,
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось обновить гайд',
        });
    }
}

export const remove = async (req, res) => {
    try {
        const guideId = req.params.id;

        GuideModel.findOneAndDelete(
            {
                _id: guideId,
            },
            (err, doc) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: 'Не удалось удалить гайд',
                    });
                }

                if (!doc) {
                    return res.status(404).json({
                        message: 'Гайд не найдена',
                    });
                }

                res.json({
                    success: true,
                });
            },
        );
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить гайды',
        });
    }
};

export const getOne = async (req, res) => {
    try {
        const guideId = req.params.id;

        GuideModel.findOneAndUpdate({
            heroId: guideId,
        }, {
            $inc: { viewsCount: 1 }
        }, {
            returnDocument: 'after',
        }, (err, doc) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: 'Не удалось вернуть гайд',
                });
            }

            if (!doc) {
                return res.status(404).json({
                    message: 'гайд не найдена',
                })
            }

            res.json(doc);
        }).populate('user');

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить гайды',
        });
    }
}

export const create = async (req, res) => {
    try {
        const doc = new GuideModel({
            title: req.body.title,
            text: req.body.text,
            user: req.userId,
            heroId: req.heroId,
        });

        const post = await doc.save();

        res.json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать гайд',
        });
    }
}