const express = require('express');
const router = express.Router({ mergeParams: true });

module.exports = (achievementController) => {
  // Get all achievements
  router.get('/', achievementController.get);
  
  // Get user's achievements
  router.get('/users/:userId', achievementController.getUserAchievements);
  
  // Check and award eligible achievements
  router.post('/users/:userId/check', achievementController.checkEligibleAchievements);

  
  // Award an achievement to a user
  router.post('/users/:userId/:achievementId', achievementController.awardAchievement);
  
    
  return router;
};