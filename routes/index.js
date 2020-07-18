const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')

const Session = require('../models/Session')

// @desc    Login/Landing page
// @route   GET /
router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'loginlay'
    })
})

// @desc    Dashboard
// @route   GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
        const sessions = await Session.find({user: req.user.id }).lean()
        res.render('dashboard', {
            name: req.user.firstName,
            sessions
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

module.exports = router