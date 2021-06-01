module.exports = function (model) {
  function getAll(req, res, next) {
    model
      .find()
      .then((docs) => res.json(docs))
      .catch(next);
  }

  function getOne(req, res, next) {
    model
      .findById(req.params.id)
      .then((doc) => res.json(doc))
      .catch(next);
  }

  function createOne(req, res, next) {
    model
      .create(req.body)
      .then((doc) => res.status(201).json(doc))
      .catch(next);
  }

  function updateOne(req, res, next) {
    model
      .updateOne({ _id: req.params.id, creatorId: req.user._id }, req.body)
      .then(() => res.status(200).json({ message: "Updated successfully!" }))
      .catch(next);
  }

  function deleteOne(req, res, next) {
    model
      .findOneAndDelete({ _id: req.params.id })
      .then(() => res.json({ message: "Deleted successfully!" }))
      .catch(next);
  }

  function createOneWithRelations(relationModel, relationDoc) {
    return function (req, res, next) {
      model
        .create({ ...req.body, creatorId: req.user._id })
        .then((createdDoc) => {
          return Promise.all([
            createdDoc,
            relationModel.updateOne(
              { _id: req.user._id },
              { $push: { [relationDoc]: createdDoc._id } }
            ),
          ]);
        })
        .then(([createdDoc, _]) => res.status(201).json(createdDoc))
        .catch(next);
    };
  }

  function deleteOneWithRelations(relationModel, relationDoc) {
    return function (req, res, next) {
      model
        .deleteOne({ _id: req.params.id })
        .then(() => {
          return relationModel.updateOne(
            { _id: req.user._id },
            { $pull: { [relationDoc]: req.params.id } }
          );
        })
        .then(() => res.json({ message: "Deleted successfully!" }))
        .catch(next);
    };
  }

  function getAllDocuments(options = {}) {
    return function (req, res, next) {
      model
        .find()
        .populate(options.populate || null)
        .limit(options.limit || null)
        .sort(options.sort || null)
        .then((doc) => res.json(doc))
        .catch(next);
    };
  }

  function getOneDocument(options = {}) {
    return function (req, res, next) {
      model
        .findById(req.params.id)
        .populate(options.populate || null)
        .select(options.select || null)
        .then((doc) => res.json(doc))
        .catch(next);
    };
  }

  return {
    getAll,
    getOne,
    createOne,
    updateOne,
    deleteOne,
    createOneWithRelations,
    deleteOneWithRelations,
    getAllDocuments,
    getOneDocument,
  };
};
