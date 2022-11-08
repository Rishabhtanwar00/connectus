import express from 'express';
const router = express.Router();

// @route   GET api/users
// @desc    Test Route
// @access  public
router.get('/', (req, res) => {
	res.send('Users route');
});

export default router;
