const Banner = require("../../Models/Products/Banner");

module.exports = {
  addBanner: async (req, res) => {
    try {
      const banner = new Banner({ imageUrl: req.body.imageUrl });
      await banner.save();
      res.status(201).json(banner);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  getAllBanners: async (req, res) => {
    try {
      const banners = await Banner.find();
      res.status(200).json(banners);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  updateBanner: async (req, res) => {
    try {
      const banner = await Banner.findByIdAndUpdate(
        req.params.id,
        { imageUrl: req.body.imageUrl },
        { new: true }
      );
      res.status(200).json(banner);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  deleteBanner: async (req, res) => {
    try {
      await Banner.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Banner deleted successfully" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};
