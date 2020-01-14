const router = require('express').Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Load Profile model
const Profile = require('../models/profile.model');

//Load User model
const User = require('../models/user.model');

//@route 	GET routes/profile/test
//@desc 	Test profile route
//@access 	public
router.get('/test', (req, res) => res.json({msg: 'profile works'}));

//@route 	GET routes/profile
//@desc 	Get current user profile
//@access 	private

router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
	const errors = {};
	User.findOne({user: req.user.id})
		.then((profile) => {
			if (!profile) {
				errors.noprofile = 'There is no profile for this user';
				return res.status(404).json(errors);
			}
			res.json(profile);
		})
		.catch((err) => res.status(404).json(err));
});

//@route 	POST routes/profile
//@desc 	Create new user profile
//@access 	private

router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
	const errors = {};
	const profileFields = {};
	profileFields.user = req.user.id;
	if (req.body.signIn) profileFields.signin = req.body.signIn;
	if (req.body.signOut) profileFields.signin = req.body.signOut;
	// if (req.body.signin) profileFields.signin = req.body.signin;
	User.findOne({user: req.user.id})
		.then((profile) => {
			if (profile) {
				//Update
				Profile.findOneAndUpdate(
					{user: req.body.id},
					{signIn: req.body.signin},
					{$set: profileFields},
					{new: true}
				).then((profile) => res.json(profile));
			} else {
				//Create
				new Profile(profileFields).save().then((profile) => res.json(profile));
			}
		})
		.catch((err) => res.status(404).json(err));
});

module.exports = router;
