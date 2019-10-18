const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//To avoid deprecation of mongoose useFindAndModify
mongoose.set("useFindAndModify", false);

//Load Person Model
const Person = require("../../models/Person");

//Load Profile Model
const Profile = require("../../models/Profile");

//@type   -  GET
//@route  -  /api/profile
//@desc   -  route for personal profile of user
//@access -  PRIVATE
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          return res.status(404).json({ profilenotfound: "No profile found." });
        }
        res.json(profile);
      })
      .catch(e => console.log("Got some error in profile " + e));
  }
);

//@type   -  POST
//@route  -  /api/profile/
//@desc   -  route for updating-saving personal profile of user
//@access -  PRIVATE
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const profileValues = {};
    const social = {};
    profileValues.user = req.user.id;
    if (req.body.username) {
      profileValues.username = req.body.username;
    }
    if (req.body.website) {
      profileValues.website = req.body.website;
    }
    if (req.body.portfolio) {
      profileValues.portfolio = req.body.portfolio;
    }
    if (req.body.country) {
      profileValues.country = req.body.country;
    }
    if (typeof req.body.languages !== "undefined") {
      profileValues.languages = req.body.languages.split(",");
    }
    if (req.body.youtube) {
      social.youtube = req.body.youtube;
    }
    if (req.body.instagram) {
      social.instagram = req.body.instagram;
    }
    if (req.body.facebook) {
      social.facebook = req.body.facebook;
    }
    if (Object.entries(social).length !== 0) {
      profileValues.social = social;
    }
    //Do database stuff
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (profile) {
          Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileValues },
            { new: true }
          )
            .then(profile => res.json(profile))
            .catch(err => console.log("Problem in update" + err));
        } else {
          Profile.findOne({ username: profileValues.username })
            .then(profile => {
              if (profile) {
                res.status(400).json({ username: "username already exist" });
              } else {
                //save user
                new Profile(profileValues)
                  .save()
                  .then(profile => {
                    res.json(profile);
                  })
                  .catch(err => console.log(err + " in saving"));
              }
            })
            .catch(err => console.log(err));
        }
      })
      .catch(err => console.log("Problem in fetching profile" + err));
  }
);

//@type   -  GET
//@route  -  /api/profile/:username
//@desc   -  route for getting user profile based on username
//@access -  PUBLIC
router.get("/:username", (req, res) => {
  Profile.findOne({ username: req.params.username })
    .populate("user", ["name", "profilepic"])
    .then(profile => {
      if (!profile) {
        res.status(404).json({ usernotfound: "No user with the username" });
      } else {
        res.json(profile);
      }
    })
    .catch(e => console.log("error in fetching data for username" + e));
});

//@type   -  GET
//@route  -  /api/profile/people
//@desc   -  route for getting everyones profile
//@access -  PUBLIC
router.get("/explore/people", (req, res) => {
  Profile.find()
    .populate("user", ["name", "profilepic"])
    .then(profiles => {
      if (!profiles) {
        res.status(404).json({ usernotfound: "No profile was found" });
      } else {
        res.json(profiles);
      }
    })
    .catch(e => console.log("error in fetching data for username" + e));
});

//@type   -  DELETE
//@route  -  /api/profile/
//@desc   -  route for delete user based on ID
//@access -  PRIVATE
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id });
    Profile.findOneAndRemove({ user: req.user.id })
      .then(() => {
        Person.findOneAndRemove({ _id: req.user.id })
          .then(() => res.json({ success: "delete was a success" }))
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }
);

//@type   -  POST
//@route  -  /api/profile/workrole
//@desc   -  route for workrole
//@access -  PRIVATE

router.post(
  "/workrole",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          res.status(404).json({ usernotfound: "No profile was found" });
        } else {
          const newWork = {
            role: req.body.role,
            company: req.body.company,
            country: req.body.country,
            from: req.body.from,
            to: req.body.to,
            current: req.body.current,
            details: req.body.details
          };
          profile.workrole.unshift(newWork);
          profile
            .save()
            .then(profile => res.json(profile))
            .catch(e => console.log(e));
        }
      })
      .catch(e => console.log(e));
  }
);

//@type   -  DELETE
//@route  -  /api/profile/workrole/:workrole_id
//@desc   -  route for deleting specific workrole
//@access -  PRIVATE
router.delete(
  "/workrole/:workrole_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        //check if there is a profile....todo

        const removethis = profile.workrole
          .map(item => item.id)
          .indexOf(req.params.workrole_id);

        profile.workrole.splice(removethis, 1);

        profile
          .save()
          .then(profile => res.json(profile))
          .catch(e => console.log(e));
      })
      .catch(e => console.log(e));
  }
);

module.exports = router;
