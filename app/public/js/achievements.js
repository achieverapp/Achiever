$(document).ready(function()
{

    //load the navbar
    $("#navbar").load("/html/navbar.html", function () { //load the navbar at the top of the page
        $("#nav-schedule").addClass("nav-active");
        resizeNav();
    });


    
})
//build the list of user achievements
function buildAchievementsList()
{
    //not yet in the html file will add in
    var achievementsUL=document.getElementById("achievements-list");
    var userAchievements;
    getUserAchievements(
    {
        owner:currUserId
    },function(result,error)
    {   
    userAchievements=result.data;
    var completed=[];

    userAchievements.forEach(userAchievement => 
            {userAchievements.achievementId
            completed.push(userAchievement);
            achievementsUL.appendChild(buildAchievementCard(userAchievement));
            });
    })
}
function buildAchievementsCard(userAchievement)
{
var achievementCardNode=document.createElement("li");
achievementCardNode.id=userAchievement.achievementId;
achievementCardNode.addClass("card");
achievementCardNode.addClass("achievement-card")
achievementCardNode.innerHTML=
"<div class=achievement-card-container"+
"<h2 class='fas fa-trophy' style=display: 'inline' border-color: 'white'>&nbsp;</h2>"+
"<div class= card-header>"+
"<h2 class='achievements-title'>"+userAchievement.achievementId.title+"</h2>"+
"</div>"+
"<div class=container>"+
"<p class='achievements-description'>&nbsp"+userAchievement.achievementId.description+"</p>"+
"<h2 class='achievement-counter'&nbsp"+userAchievement.achievementId.counter+"</h2>";
return achievementCardNode;
}
