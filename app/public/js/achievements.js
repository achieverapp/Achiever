$(document).ready(function () {
    $("#navbar").load("/html/navbar.html", function () { //load the navbar at the top of the page
        $("#nav-achievements").addClass("nav-active");
    });
    buildAchievementsList();
})
/**
 * Builds the list of achievements for the page with a given sort function.
 * 
 *
 */
//build the list of user achievements
function buildAchievementsList() {
    //not yet in the html file will add in
    var achievementsUL = document.getElementById("achievements-list");
    var userAchievements;
    getUserAchievements({
        owner: currUserId
    }, function (result, error) {
        userAchievements = result.data;
        achievementsId = userAchievements.achievementId
        var completed = [];

        userAchievements.forEach(userAchievement => {
            userAchievements.achievementId
            completed.push(userAchievement);
            achievementsUL.appendChild(buildAchievementCard(userAchievement));
        });
    })
}
/**
 * Builds the achivement card
 * @param userAchievement: pass in a userAchivement object
 */
function buildAchievementCard(userAchievement)
{
var achievementCardNode = document.createElement("li");
achievementCardNode.id = userAchievements.achievementId;
achievementsId = achievementCardNode.id;
getAchievement(achievementId, function (error, result) {
    achievements = result.data;
    achievementCardNode.addClass("card");
    achievementCardNode.addClass("achievement-card")
    achievementCardNode.innerHTML =
        "<div class=achievement-card-container" +
        "<h2 class='fas fa-trophy' style=display: 'inline' border-color: 'white'>&nbsp;</h2>" +
        "<div class= card-header>" +
        "<h2 class='achievements-title'>" + achievements.title + "</h2>" +
        "</div>" +
        "<div class=container>" +
        "<p class='achievements-description'>&nbsp" + achievements.description + "</p>" +
        "<h2 class='achievement-counter'&nbsp" + achievements.counter + "</h2>" +
        "</div>"
    return achievementCardNode;
})
}