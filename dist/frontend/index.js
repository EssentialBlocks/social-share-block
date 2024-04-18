/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!*************************!*\
  !*** ./src/frontend.js ***!
  \*************************/
document.addEventListener("DOMContentLoaded", function (event) {
  var socialShareLinks = document.querySelectorAll(".eb-social-share-wrapper");
  if (!socialShareLinks) return;
  socialShareLinks.forEach(function (socialShareLink) {
    var links = socialShareLink.querySelectorAll("ul.eb-social-shares li a");
    var _loop = function _loop(i) {
      links[i].addEventListener("click", function (e) {
        e.preventDefault();
        var link = this.getAttribute("href");
        window.open(link, "", " scrollbars=yes,menubar=no,width=500,height=400,resizable=yes,toolbar=no,location=no,status=no");
      });
      links[i].addEventListener("mouseenter", function (e) {
        e.preventDefault();
        links[i].classList.add("eb-slide-out");
      });
      links[i].addEventListener("mouseleave", function (e) {
        e.preventDefault();
        links[i].classList.remove("eb-slide-out");
      });
    };
    for (var i = 0; i < links.length; i++) {
      _loop(i);
    }
  });
});
/******/ })()
;
//# sourceMappingURL=index.js.map