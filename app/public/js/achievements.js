$(document).ready(function()
{

    //load the navbar
    $("#navbar").load("/html/navbar.html", function () { //load the navbar at the top of the page
        $("#nav-schedule").addClass("nav-active");
        resizeNav();
    });


    
})

function buildAchievementsList()
{
getUserAchievements({
    owner:currUserId
},function(result,error)
{
    
})
}