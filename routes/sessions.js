const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')

const Session = require('../models/Session')

// @desc    Show add page
// @route   GET /sessions/add
router.get('/add', ensureAuth, (req, res) => {
    res.render('sessions/add')
})

// @desc    Process add form
// @route   POST /sessions
router.post('/', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id
        await Session.create(req.body)
        res.redirect('dashboard')
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

// @desc    Show all sessions
// @route   GET /sessions
router.get('/', ensureAuth, async (req, res) => {
    try {
        const sessions = await Session.find({ status: 'public' })
            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean()

        res.render('sessions/index', {
            sessions,
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

// @desc    Show single session
// @route   GET /sessions/:id
router.get('/:id', ensureAuth, async (req, res) => {
    try {
        let session = await Session.findById(req.params.id)
        .populate('user')
        .lean()

        if (!session) {
            return res.render('error/404')
        }

        res.render('sessions/show', {
            session
        })
    } catch (err) {
        console.error(err)
        res.render('error/404')
    }
})

// @desc    Show edit page
// @route   GET /sessions/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
    try {
        const session = await Session.findOne({
            _id: req.params.id
        }).lean()

        if (!session) {
        return res.render('error/404')
        }

        if (session.user != req.user.id) {
            res.redirect('/sessions')
        } else {
            res.render('sessions/edit', {
                session
            })
        }
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
})

// @desc    Update session
// @route   PUT /sessions/:id
router.put('/:id', ensureAuth, async (req, res) => {
    try {
        let session = await Session.findById(req.params.id).lean()

        if (!session) {
            return res.render('error/404')
        }

        if (session.user != req.user.id) {
            res.redirect('/sessions')
        } else {
            session = await Session.findOneAndUpdate({_id: req.params.id}, req.body, {
                new: true,
                runValidators: true
            })

            res.redirect('/dashboard')
        }
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
})

// @desc    Delete Session
// @route   DELETE /sessions/:id
router.delete('/:id', ensureAuth, async (req, res) => {
    try {
      let session = await Session.findById(req.params.id).lean()
  
      if (!session) {
        return res.render('error/404')
      }
   
     if (session.user != req.user.id) {   
          res.redirect('/sessions')
      } else {
          await Session.remove({ _id: req.params.id }) 
          res.redirect('/dashboard')
      }
    } catch (err) {
      console.error(err)
      return res.render('error/500')
    }
  })

// @desc    User sessions
// @route   GET /sessions/user/:userId
router.get('/user/:userId', ensureAuth, async (req, res) => {
    try {
        const sessions = await Session.find({
            user: req.params.userId,
            status: 'public'
        })
        .populate('user')
        .lean()

        res.render('sessions/index', {
            sessions
        })
    } catch (error) {
        console.error(err)
        res.render('error/500')
    }
})

module.exports = router