var loggedIn = false; //global flag that signals if the user is signed in


/**
 * initialize the page when the document is loaded
 */
$(document).ready(function () {
    resizeNav()
    setQueryParams()
    
    var userId = getQueryParam("userId") // store the current userID from the query parameters
    if ("" !== userId && null !== userId && typeof userId !== 'undefined') { //if that userID is actually there, show that the user is logged in.
        loggedIn = true;
        setCurrentPageTitle();
    }
    else { //If there is no user ID, show that they are logged out.
        $('.logged-in').hide();
        $('.logged-out').show();
        disableMenu();
    }
});

/**
 * Event handler for window resize events. Switches nav between mobile and desktop versions as appropriate.
 */
$(window).resize(resizeNav);

/**
 * Shows the correct navbar based on screen resolution. Mobile nav is used for screens narrower than 640px, desktop for larger.
 */
function resizeNav() {
    // If the window is scaled to mobile, use the hamburger navbar
    if ($(window).width() <= 640) {
        $(".nav-large").hide();
        $(".nav-smol").show();
    }
    // Otherwise, use the default nav bar with page tabs
    else {
        $(".nav-large").show();
        $(".nav-smol").hide();
    }
}

/**
 * updates page navigation links to pass the current user id as a query parameter.
 */
function setQueryParams() {
    var url = window.location.href;
    var temp = url.split('userId=')[1]
    if (typeof temp === 'undefined') {
        return
    }
    var userId = url.split('userId=')[1].split('&')[0]
    $('.nav-link').attr('href', function (i, h) {
        return h + (h.indexOf('?') != -1 ? "&userId=" : "?userId=" + userId);
    });
}

/**
 * Gets the specified query param from the current page url
 * @param {*} param: the name of the query parameter to get
 */
function getQueryParam(param) {
    var url = window.location.href
    temp = url.split(`${param}=`)[1]
    if (typeof temp === 'undefined') {
        return null
    }
    return url.split(`${param}=`)[1].split('&')[0]
}

/**
 * Updates the mobile navbar to display the current page title.
 */
function setCurrentPageTitle() {
    $('.nav-title').html(document.title);
}

/**
 * Disable mobile nav expansion when the user is logged out.
 */
function disableMenu() {
    $('.navbar-toggler').removeAttr('data-toggle')
    $("#navIconMobile").removeClass('fa-bars').addClass('fa-check-double')
}