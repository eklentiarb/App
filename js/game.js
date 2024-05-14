var b = "https://haylamday.com/";
window.detectLog = null;
const c = {
  BETAisSkinCustom(b) {
    var c = /[a-zA-Z]/;
    return typeof b === "string" && c.test(b);
  },
  testSkinCustom: function (b) {
    if (c.BETAisSkinCustom(b)) {
      return 34 || 33;
    } else {
      return b;
    }
  },
  testSkinMod: function (b) {
    return b >= 399 && b < 999;
  },
  testWear: function (b) {
    return b >= 399 && b < 999;
  },
  isNumberValid: function (b) {
    return b !== "" && b !== null && b !== undefined && !isNaN(b);
  },
  validInput: function (b) {
    if (!c.testSkinMod(b) && !c.BETAisSkinCustom(b)) {
      return b;
    }
    try {
      let b = $("#inputReplaceSkin").val();
      return encodeURI(c.isNumberValid(b) ? b : 35);
    } catch (b) {
      return encodeURI(35);
    }
  },
  aload: false,
  aId: 0
};
var d = localStorage.getItem("inputReplaceSkin");
var e;
var f = null;
var g = false;
var h = {};
window.keyMove = 81;
var i = {
  eventoPrincipal: null,