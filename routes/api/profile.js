import express from 'express';
const router = express.Router();

// @route   GET api/profile
// @desc    Test Route
// @access  public
router.get('/', (req, res) => {
	res.send('Profile route');
});

export default router;
