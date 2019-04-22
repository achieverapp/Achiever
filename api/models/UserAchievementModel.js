class UserAchievements
{
    constructor(UserAchievement)
    {
        this.owner=UserAchievement.owner==null?null:UserAchievement.owner;
        this.datesAchieved=UserAchievement.datesAchieved==null?[]:UserAchievement.datesAchieved;
        this.recent=UserAchievement.recent==null? new Date().toISOString:UserAchievement.recent;
        this.achievementId=UserAchievement.achievementId==null?null:UserAchievement.achievementId;
    }
}