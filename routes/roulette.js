// router
const express = require('express');
const router = express.Router();

// include prisma
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// route
router.post('/spin', async (req, res) => {
    // check if user is logged in
    if (!req.session.user) {
        res.status(401).json({ status: 'error', message: 'You are not logged in!' });
        return;
    }

    const user = await prisma.users.findFirst({
        where: {
            id: req.session.user
        }
    });

    // get user balance, bet amount, choice
    var balance = user.balance;
    var bet = parseInt(req.body.bet);
    var choice = req.body.choice;
    var choices = ['red', 'black', 'green'];

    // check if bet is valid
    if (bet < 1 || bet > user.balance) {
        bet = 1;
        return;
    }

    // check if choice is valid
    if (!choices.includes(choice)) {
        res.json({ message: 'Invalid choice!' });
        return;
    }

    // get random number
    var number = Math.floor(Math.random() * 37);

    // get color
    var color = 'green';
    if (number >= 1 && number <= 10) {
        color = number % 2 == 0 ? 'black' : 'red';
    } else if (number >= 11 && number <= 18) {
        color = number % 2 == 0 ? 'red' : 'black';
    } else if (number >= 19 && number <= 28) {
        color = number % 2 == 0 ? 'black' : 'red';
    } else if (number >= 29 && number <= 36) {
        color = number % 2 == 0 ? 'red' : 'black';
    }

    // check if user won
    var won = false;

    if (choice == 'red' && color == 'red') {
        won = true;
    } else if (choice == 'black' && color == 'black') {
        won = true;
    } else if (choice == 'green' && color == 'green') {
        won = true;
    }

    // calculate new balance
    var newBalance = balance;
    if (won) {
        newBalance += bet;
    } else {
        newBalance -= bet;
    }

    // set new balance
    await prisma.users.update({
        where: {
            id: req.session.user
        },
        data: {
            balance: newBalance
        }
    });

    // convert bet into euro format
    var euro = new Intl.NumberFormat('da-DK', { style: 'currency', currency: 'EUR' }).format(bet);
    
    // send response
    res.json({
        number: number,
        color: color,
        won: won,
        balance: newBalance,
        message: won ? 'You won: ' + euro : 'You lost: ' + euro,
        alertType: won ? 'success' : 'error',
    });
});

// export express router
module.exports = router;