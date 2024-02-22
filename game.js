// ==UserScript==
// @name         Wormate.io Zoom Hack
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Allows you to zoom in/out using mouse wheel
// @author       You
// @match        https://wormate.io/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Initialize zoom level
    let zoomLevel = 1;

    // Add event listener for mouse wheel scroll
    document.addEventListener('wheel', function(e) {
        // Prevent default behavior
        e.preventDefault();

        // Update zoom level
        zoomLevel += e.deltaY * 0.001;
        zoomLevel = Math.min(Math.max(zoomLevel, 0.5), 2);

        // Update canvas style
        let canvas = document.querySelector('canvas');
        canvas.style.transform = `scale(${zoomLevel})`;
    });
})();
