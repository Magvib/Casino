// router
const express = require('express');
const router = express.Router();

// include prisma
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// login
router.post('/', async (req, res) => {
    // get username and password from request
    const username = req.body.username;
    const password = req.body.password;

    const user = await prisma.users.findFirst({
        where: {
            username: username,
            password: password
        }
    });

    // check if user exists
    if (!user) {
        // set status code to 401
        res.status(401).json({ status: 'error', message: 'Invalid username or password!' });
        return;
    }

    // set session variables
    req.session.user = user.id;
    req.session.username = user.username;

    // send response
    res.json(user);
});

// clear session route
router.get('/logout', (req, res) => {
    // destroy session
    req.session.destroy();
    res.json({ status: 'success' });
});

// get user informaiton
router.get('/user', async (req, res) => {
    if (!req.session.user) {
        res.status(401).json({ status: 'error', message: 'You are not logged in!' });
        return;
    }

    const user = await prisma.users.findFirst({
        where: {
            id: req.session.user
        }
    });

    res.json(user);
});

// export express router
module.exports = router;