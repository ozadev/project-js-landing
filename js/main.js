'use strict';

function scrollToId(id) {

    var elemScrollTop = document.getElementById(id).getBoundingClientRect().top;

    if (elemScrollTop == 0) {
        return;
    }

    var scrollStep = 50;
    var lastScroll = false;

    var scrollValue = (elemScrollTop > 0) ? scrollStep: -scrollStep;

    if (Math.abs(elemScrollTop) <= scrollStep) {
        scrollValue = elemScrollTop;
        lastScroll = true;
    }

    window.scrollBy(0, scrollValue);

    if (!lastScroll) {
        setTimeout(scrollToId, 10, id);
    }

    return;
}

function navLinksClickHandler(event) {

    var link = event.target.closest("a");

    if (link === null) {
        return;
    }

    var href = link.getAttribute('href');

    if (href === null) {
        return;
    }

    if (href.search(/#/) !== 0) {
        return;
    }

    event.preventDefault();

    var anchorId = href.split('#')[1];

    scrollToId(anchorId);

    if (link.matches('.nav-head ul li a')) {

        //Change current active navigation (header) link;
        var navlinks = document.querySelectorAll('.nav-head a');

        for (var i = 0; i < navlinks.length; i++) {
            if (navlinks[i].classList.contains('nav-active')) {
                navlinks[i].classList.remove('nav-active');
            }
        }

        link.classList.add('nav-active');
    }
}


function sliderNormalizeWidth(ul) {

    var slides = ul.querySelectorAll('li');

    ul.style.width = slides.length * 100 + '%';

    for(var i = 0; i < slides.length; i++) {
        slides[i].style.width = (100 / slides.length) + '%';
    }

}

function shiftSlide(ul, shiftWidth, direction, tempSlide, finalLeft) {

    var shiftStep = 20;
    var lastShift = false;

    var shiftVal;

    if (shiftWidth < shiftStep) {
        shiftVal = shiftWidth;
        lastShift = true;
    }
    else {
        shiftVal = shiftStep;
    }

    if(direction == 'right') {
        shiftVal = -shiftVal;
    }

    ul.style.left = (parseInt(ul.style.left) + shiftVal) + 'px';

    if (lastShift) {
        if (tempSlide) {
            tempSlide.remove();
            sliderNormalizeWidth(ul);
        }
        if (finalLeft) {
            ul.style.left = finalLeft;
        }

        // Re-enable event handler
        document.querySelector('#home .slider').addEventListener('click', homeSliderClickHandler);

    }
    else {
        setTimeout(shiftSlide, 20, ul, shiftWidth - shiftStep, direction, tempSlide, finalLeft);
    }

}

function homeSliderChange(ul, direction) {

    var slideWidth = ul.querySelector("li").clientWidth;

    if (ul.style.left === '') {
        ul.style.left = '0px';
    }

    var slides = ul.querySelectorAll('li');
    // Index of currently shown slide
    var currSlideIndex = -Math.round(parseInt(ul.style.left) / slideWidth);


    if (direction == 'right' && slides[currSlideIndex].nextElementSibling === null) {
        var tempSlide = ul.appendChild(ul.firstElementChild.cloneNode(true));

        sliderNormalizeWidth(ul);

        shiftSlide(ul, slideWidth, direction, tempSlide, '0px');
        return;
    }

    if(direction == 'left' && slides[currSlideIndex].previousElementSibling === null) {
        var tempSlide = ul.insertBefore(ul.lastElementChild.cloneNode(true), ul.firstElementChild);

        sliderNormalizeWidth(ul);

        ul.style.left = -slideWidth + 'px';

        var finalLeftOffset = -(slides.length - 1) * slideWidth + 'px';

        shiftSlide(ul, slideWidth, direction, tempSlide, finalLeftOffset);
        return;
    }

    shiftSlide(ul, slideWidth, direction);

}

function homeBgChange(direction) {

    var arrImages = ['url("img/home_bg1.jpg")', 'url("img/home_bg2.jpg")', 'url("img/home_bg3.jpg")'];

    var homeBg = document.querySelector('.home-bg');

    var currBg = homeBg.style.backgroundImage;

    // By default 'home_bg1.jpg' set in style.css file
    if (currBg === '') {
        currBg = arrImages[0];
    }

    var currIndex = arrImages.indexOf(currBg);

    if(currIndex == -1) {
        alert('Error during background image changing!');
    }

    var nextIndex = 0;

    if (direction == 'next') {
        if (currIndex != arrImages.length - 1) {
            nextIndex = currIndex + 1;
        }
    }

    if (direction == 'prev') {
        nextIndex = currIndex - 1;
        if (nextIndex == -1) {
            nextIndex = arrImages.length - 1;
        }
    }

    homeBg.style.backgroundImage = arrImages[nextIndex];

}

function homeSliderClickHandler(event) {

    var ul = document.querySelector(".slider .slider-content ul");

    if (event.target.classList.contains('slider-nav-left') || event.target.classList.contains('slider-nav-right')) {
        clearInterval(window.homeSliderAutoTimer);
        clearTimeout(window.homeSliderBusyTimer);
        homeSliderAutoOn();
    }

    // disable event handler to prevent multiple 'homeSliderChange' function call;
    document.querySelector('#home .slider').removeEventListener('click', homeSliderClickHandler);

    if (event.target.classList.contains('slider-nav-left')) {
        homeSliderChange(ul, 'left');
        homeBgChange('prev');
    }

    if (event.target.classList.contains('slider-nav-right')) {
        homeSliderChange(ul, 'right');
        homeBgChange('next');
    }
}

function homeSliderAutoChange() {
    window.homeSliderAutoTimer = setInterval(function() {

        var ul = document.querySelector(".slider .slider-content ul");

        // disable event handler to prevent multiple 'homeSliderChange' function call;
        document.querySelector('#home .slider').removeEventListener('click', homeSliderClickHandler);
        homeSliderChange(ul, 'right');
        homeBgChange('next');
    }, 3000);
}

function homeSliderAutoOn() {
    window.homeSliderBusyTimer = setTimeout(function() {
        homeSliderAutoChange();
    }, 5000);
}


function iconZoomIn(elem) {
    // elem is icon container
    // initial elem.padding == 30%, so icon size 40%
    // finish padding value is 28%, so icon size 44% (110% of original icon size);

    var zoomStep = 1;

    if (elem.style.padding === '') {
        currPadding = 30;
    }
    else {
        var currPadding = parseInt(elem.style.padding);
    }

    if (currPadding <= 28) {
        return;
    }

    elem.style.padding = (currPadding - zoomStep) + '%';
    setTimeout(iconZoomIn, 100, elem);
}

function iconZoomOut(elem) {
    // elem is icon container
    // normal elem.padding == 30%, so icon size 40%
    // padding value after zoom in is 28%, need return it to default;

    var zoomStep = 1;

    var currPadding = parseInt(elem.style.padding);

    if (currPadding >= 30) {
        return;
    }

    elem.style.padding = (currPadding + zoomStep) + '%';
    setTimeout(iconZoomOut, 150, elem);
}

function iconMouseOverHandler(event) {

    var target = event.target;
    if (target.dataset.iconResizeble != 'true') {
        return;
    }
    iconZoomIn(target.parentNode);
}

function iconMouseOutHandler(event) {

    var target = event.target;
    if (target.dataset.iconResizeble != 'true') {
        return;
    }
    iconZoomOut(target.parentNode);
}


function clientsSliderNext() {
    var ul = document.querySelector('.clients-slider ul');

    ul.appendChild(ul.firstElementChild.cloneNode(true));

    ul.style.transition = '1s';
    ul.style.marginLeft = '-' + window.getComputedStyle(ul.firstElementChild).width;

    setTimeout(function() {
        var ul = document.querySelector('.clients-slider ul');
        ul.firstElementChild.remove();
        ul.style.transition = '';
        ul.style.marginLeft = '0px';
    }, 1000);
}

function clientsReviewSliderHandler(event) {

    var target = event.target;

    if (target.tagName != 'LI') {
        return;
    }

    // If already selected
    if (target.classList.contains('active')) {
        return;
    }

    var markerUl = target.parentNode;
    var markers = markerUl.querySelectorAll('li');

    var markerSelIndex = [].indexOf.call(markers, target);

    var sliderUl = document.querySelector(".clients-review-slider ul");

    var slideWidth = parseInt(window.getComputedStyle(sliderUl.firstElementChild).width);

    sliderUl.style.marginLeft = -slideWidth * markerSelIndex + 'px';

    // Change current active marker
    for (var i = 0; i < markers.length; i++) {
        if (markers[i].classList.contains('active')) {
            markers[i].classList.remove('active');
        }
    }

    markers[markerSelIndex].classList.add('active');
}

function checkInput(name, reg, textError) {

    var currInput = document.getElementsByName(name)[0];

    if (reg.test(currInput.value) === false) {
        if (currInput.previousElementSibling === null) {
            currInput.parentNode.insertBefore(textError, currInput);
        }
    }
    else {
        if (currInput.previousElementSibling !== null) {
            if (currInput.previousElementSibling.className == 'text-error') {
                currInput.previousElementSibling.remove();
            }
        }
    }
}

function contactFormValidateHandler(event) {

    var target = event.target;

    var textError = document.createElement('span');
    textError.innerHTML = "Invalid text content!";
    textError.style.color = 'red';
    textError.style.dislpay = 'inline-block';
    textError.style.textAlign = 'left';
    textError.style.fontWeight = '300';
    textError.style.position = 'absolute';
    textError.style.left = '25px';
    textError.style.top = '-25px';
    textError.className = 'text-error';

    if (target.name == 'name') {
        checkInput(target.name, /^[a-zA-Z]*?$/, textError);
    }

    if (target.name == 'email') {
        checkInput(target.name, /^[a-zA-Z0-9@_]*?$/, textError);
    }

    if (target.name == 'subject') {
        checkInput(target.name, /^[a-zA-Z0-9]*?$/, textError);
    }
}


function portfolioAchievementCountHandler(event) {

    if (document.querySelector('#portfolio .portfolio-achievement').getBoundingClientRect().top - document.documentElement.clientHeight < 0) {

        if(window.portfolioAchievementCountTimerId !== undefined) {
            return;
        }

        window.portfolioAchievementCountTimerId = setInterval(function () {

            var elems = document.querySelectorAll('.achievement-number');
            var stepCount = 40;

            for (var i = 0; i < elems.length; i++) {
                var currentVal = +elems[i].innerHTML;
                if (currentVal < +elems[i].dataset.finalValue) {
                    elems[i].innerHTML = currentVal + Math.floor(+elems[i].dataset.finalValue / stepCount);
                }
            }

            document.removeEventListener('scroll', portfolioAchievementCountHandler);

        }, 75);

        setTimeout(function() {
            clearInterval(window.portfolioAchievementCountTimerId);

            var elems = document.querySelectorAll('.achievement-number');
            for (var i = 0; i < elems.length; i++) {
                elems[i].innerHTML = +elems[i].dataset.finalValue;
            }

        }, 3000);

        document.removeEventListener('scroll', portfolioAchievementCountHandler);
        // event.preventDefault();
        // event.stopPropagation();
    }
}


function portfolioImagesFilterHandler(event) {

    var target = event.target;

    if (target.tagName != 'A') {
        return;
    }

    var imagesBlocks = document.querySelectorAll('.portfolio-images > ul > li');
    var filterCategory = target.innerHTML;

    for (var i = 0; i < imagesBlocks.length; i++) {
        if (filterCategory == 'All') {
            imagesBlocks[i].style.display = 'inline-block';
        }
        else {
            if(imagesBlocks[i].dataset.category == filterCategory)
                imagesBlocks[i].style.display = 'inline-block';
            else
                imagesBlocks[i].style.display = 'none';
        }
    }

    // Change current active navigation link;
    var navlinks = document.querySelectorAll('.portfolio-nav a');

    for (var i = 0; i < navlinks.length; i++) {
        if (navlinks[i].classList.contains('nav-active')) {
            navlinks[i].classList.remove('nav-active');
        }
    }

    target.classList.add('nav-active');

}

function teamDescriptionLaunchHandler(event) {
    var link = event.target.closest("a");

    if (link === null) {
        return;
    }

    var linkIndex = [].indexOf.call(document.querySelectorAll('.team-member'), link);

    document.querySelector('.team-member-description').style.display = 'block';

    var membersDescriptions = document.querySelectorAll('.team-member-description ul li');

    for (var i = 0; i < membersDescriptions.length; i++) {
        membersDescriptions[i].style.display = 'none';
    }

    membersDescriptions[linkIndex].style.display = 'block';

    // Change arrow position of member description block;
    var linkBlockCoords = link.getBoundingClientRect();

    var linkBlockCenter = (linkBlockCoords.right + linkBlockCoords.left) * 0.5;

    var arrow = document.querySelector('.team-member-arrow');
    arrow.style.left = linkBlockCenter - parseInt(window.getComputedStyle(arrow).width) * 0.5 + 'px';
}

function circleDiagramDraw(canvas, percents) {

    var degrees = 360 * percents * 0.01;

    var ctx = canvas.getContext("2d");

    var width = canvas.width;
    var height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 6;
    ctx.arc(width/2, height/2, 70, 0, Math.PI*2, false);
    ctx.stroke();

    var radians = degrees * Math.PI / 180;
    ctx.beginPath();
    ctx.strokeStyle = "#ffe600";
    ctx.lineWidth = 6;
    ctx.arc(width/2, height/2, 70, 0 + 90*Math.PI/180, radians + 90*Math.PI/180, false);
    ctx.stroke();

    ctx.fillStyle = "#ffe600";
    ctx.font = "lighter 40px Oswald";
    var text = Math.floor(degrees/360*100) + "%";
    var text_width = ctx.measureText(text).width;
    ctx.fillText(text, width/2 - text_width/2, width/2 + 15);
}


function drawCircleDiagram(elem, currVal) {

    if(currVal < +elem.dataset.percents) {
        circleDiagramDraw(elem.querySelector('canvas'), currVal + 1);
        setTimeout(drawCircleDiagram, 3000 / +elem.dataset.percents, elem, currVal + 1);
    }

}

function aboutSkillCircleDiagramHandler(event) {

    // alert('test');

    if (document.querySelector('.team-member-skill').getBoundingClientRect().top - document.documentElement.clientHeight < 0) {

        // alert(document.querySelector('.team-member-skill').getBoundingClientRect().top - document.documentElement.clientHeight);
        var skillDiagrams = document.querySelectorAll('.team-member-skill');

        for (var i = 0; i < skillDiagrams.length; i++) {
            drawCircleDiagram(skillDiagrams[i], 0);
        }

        document.removeEventListener('scroll', aboutSkillCircleDiagramHandler);
        // event.preventDefault();
        // event.stopPropagation();
    }
}


window.onload = function () {

    homeSliderAutoChange();

    var clientSliderTimerId = setInterval(clientsSliderNext, 3000);

    document.addEventListener('click', navLinksClickHandler);

    document.querySelector('#home .slider').addEventListener('click', homeSliderClickHandler);

    document.querySelector('#services').addEventListener('mouseover', iconMouseOverHandler);
    document.querySelector('#services').addEventListener('mouseout', iconMouseOutHandler);

    document.querySelector('#about').addEventListener('mouseover', iconMouseOverHandler);
    document.querySelector('#about').addEventListener('mouseout', iconMouseOutHandler);

    document.querySelector('#clients .clients-review-marker').addEventListener('click', clientsReviewSliderHandler);

    document.querySelector('#contact .dark-bg form').addEventListener('keyup', contactFormValidateHandler);

    document.addEventListener('scroll', portfolioAchievementCountHandler);

    document.querySelector("#portfolio .portfolio-nav").addEventListener('click', portfolioImagesFilterHandler);

    document.querySelector("#about .team-group").addEventListener('click', teamDescriptionLaunchHandler);

    document.querySelector(".team-member-description").addEventListener('click', function(event) {
        if (event.target.classList.contains('description_close'))
            document.querySelector('.team-member-description').style.display = 'none';
    });
    
    var canvasArr = document.querySelectorAll(".team-member-skill canvas");
    for (var i = 0; i < canvasArr.length; i++)
        circleDiagramDraw(canvasArr[i], 0);

    document.addEventListener('scroll', aboutSkillCircleDiagramHandler);

};



