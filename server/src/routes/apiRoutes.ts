import { getTeamInfo } from '../api/api.js';

const { Router } = require('express');

const router = Router();

router.get('/teaminfo/:id', getTeamInfo);
