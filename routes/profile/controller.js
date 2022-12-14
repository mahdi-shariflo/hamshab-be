import controller from "../controller.js";
import _ from "lodash";
import multer from "multer";

export default new (class extends controller {
  async editProfile(req, res) {
    const AdressServer = "http://localhost:8080/";
    // find user
    let userField = await this.user.findOne({
      _id: req.user._id,
    });

    // check user exists or not
    if (!userField) {
      return this.response({
        res,
        code: 400,
        message: "کاربری با این مشخصات یافت نشد",
      });
    }
    const storage = multer.diskStorage({
      destination: "uploads",
      filename: (req, file, cb) => {
        cb(null, file.originalname);
      },
    });

    const upload = multer({ storage: storage }).fields([
      { name: "profile" },
      { name: "backgroundImage" },
      { name: "music" },
    ]);

    await upload(req, res, async (err) => {
      if (err) {
        console.log(err);
      }

      if (req.files?.music) {
        req.files.music =
          AdressServer + req.files.music[0].filename;
      }

      if (req.files?.backgroundImage) {
        req.files.backgroundImage =
          AdressServer +
          req.files.backgroundImage[0].filename;
      }
      if (req.files?.profile) {
        req.files.profile =
          AdressServer + req.files.profile[0].filename;
      }

      const user = await this.user.findByIdAndUpdate(
        { _id: req.user._id },
        { ...req.body, ...req.files },
        { new: true }
      );

      return this.response({
        res,
        data: {
          user: _.pick(user, [
            "_id",
            "username",
            "email",
            "bio",
            "music",
            "profile",
            "backgroundImage",
            "timeline",
          ]),
        },
        message: "successful",
      });
    });
  }
})();
