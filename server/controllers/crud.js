// Owner-scoped CRUD factory shared by players, teams and matches.
export const crud = (Model, { populate = [], sort = '-createdAt' } = {}) => {
  const q = (query) => populate.reduce((acc, p) => acc.populate(p), query);
  const clean = (b) => { const { owner, _id, ...rest } = b; return rest; };
  return {
    list: async (req, res) => res.json(await q(Model.find({ owner: req.user.id }).sort(sort))),
    create: async (req, res) => {
      const doc = await Model.create({ ...clean(req.body), owner: req.user.id });
      res.status(201).json(await q(Model.findById(doc._id)));
    },
    update: async (req, res) => {
      const doc = await Model.findOne({ _id: req.params.id, owner: req.user.id });
      if (!doc) return res.status(404).json({ message: 'Not found' });
      doc.set(clean(req.body));
      await doc.save();
      res.json(await q(Model.findById(doc._id)));
    },
    remove: async (req, res) => {
      const doc = await Model.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
      if (!doc) return res.status(404).json({ message: 'Not found' });
      res.json({ deleted: true });
    },
  };
};
