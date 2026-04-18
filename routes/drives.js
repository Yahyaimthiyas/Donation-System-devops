const express = require('express');
const {
  getDrives,
  createDrive,
  getMyDrives,
  updateDriveStatus,
  updateDrive,
  deleteDrive,
  addDriveUpdate,
  getDrive,
} = require('../controllers/drives');

const router = express.Router();

const auth = require('../middleware/auth');
const { check } = require('express-validator');

router.route('/')
  .get(getDrives)
  .post(
    [
      auth('beneficiary'),
      check('title', 'Title is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('location', 'Location is required').not().isEmpty(),
      check('startDate', 'Start date is required').isISO8601(),
      check('endDate', 'End date is required').isISO8601(),
    ],
    createDrive
  );

router.get('/my-drives', auth(), getMyDrives);

router.put('/:id/status', auth('admin'), updateDriveStatus);

router.route('/:id')
  .get(getDrive)
  .put(auth('beneficiary'), updateDrive)
  .delete(auth(['admin', 'beneficiary']), deleteDrive);

router.post('/:id/updates', auth('beneficiary'), addDriveUpdate);

module.exports = router;

module.exports = router;