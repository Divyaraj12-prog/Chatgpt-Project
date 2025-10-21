const express = require('express');
const router = express.Router();

const { registerController, loginController, meController } = require('../Controllers/user.controller');
const auth = require('../middleware/auth.middleware');

router.post('/register', registerController);
router.post('/login', loginController);
router.get('/me', auth, meController);

module.exports = router;