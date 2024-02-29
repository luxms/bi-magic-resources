'use strict';



function ___$insertStyle(css) {
  if (!css) {
    return;
  }
  if (typeof window === 'undefined') {
    return;
  }

  var style = document.createElement('style');

  style.setAttribute('type', 'text/css');
  style.innerHTML = css;
  document.head.appendChild(style);
  return css;
}

Object.defineProperty(exports, '__esModule', { value: true });

var _tslib = require('../../_virtual/_tslib.js');

var styled = require("styled-components").default;
var LoginDemoItemDesc = styled.p(templateObject_1 || (templateObject_1 = _tslib.__makeTemplateObject(["\n  font-size: 0.75rem;\n  display: -webkit-box;\n  -webkit-line-clamp: 7;\n  -webkit-box-orient: vertical;\n  -webkit-box-pack: justify;\n  overflow: hidden;\n  text-overflow: ellipsis;\n"], ["\n  font-size: 0.75rem;\n  display: -webkit-box;\n  -webkit-line-clamp: 7;\n  -webkit-box-orient: vertical;\n  -webkit-box-pack: justify;\n  overflow: hidden;\n  text-overflow: ellipsis;\n"])));
var LoginDemoItemTitle = styled.h3(templateObject_2 || (templateObject_2 = _tslib.__makeTemplateObject(["\n  font-size: 1.25rem;\n  font-weight: bold;\n  color: ", ";\n  text-align: center;\n  margin-bottom: 2rem;\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n  text-overflow: ellipsis;\n"], ["\n  font-size: 1.25rem;\n  font-weight: bold;\n  color: ", ";\n  text-align: center;\n  margin-bottom: 2rem;\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n  text-overflow: ellipsis;\n"])), function (props) { return props.color || props.theme.color20; });
var LoginDemoItemImage = styled.div(templateObject_3 || (templateObject_3 = _tslib.__makeTemplateObject(["\n  width: 100%;\n  height: 12.5rem;\n  margin-bottom: 2rem;\n  display: inline-flex;\n  justify-content: center;\n  align-items: center;\n  img {\n    max-width: 100%;\n    max-height: 100%;\n  }\n"], ["\n  width: 100%;\n  height: 12.5rem;\n  margin-bottom: 2rem;\n  display: inline-flex;\n  justify-content: center;\n  align-items: center;\n  img {\n    max-width: 100%;\n    max-height: 100%;\n  }\n"])));
var LoginDemoItem = styled.div(templateObject_4 || (templateObject_4 = _tslib.__makeTemplateObject(["\n  position: absolute;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  height: 100%;\n  width: 100%;\n  min-height: 37rem;\n  background: ", ";\n  padding: 3rem 3rem 2rem;\n"], ["\n  position: absolute;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  height: 100%;\n  width: 100%;\n  min-height: 37rem;\n  background: ", ";\n  padding: 3rem 3rem 2rem;\n"])), function (props) { return props.background || props.theme.highlightColor5; });
var LoginDemoInner = styled.div(templateObject_5 || (templateObject_5 = _tslib.__makeTemplateObject(["\n    flex-grow: 1;\n    display: flex;\n"], ["\n    flex-grow: 1;\n    display: flex;\n"])));
var LoginDemo = styled.div(templateObject_6 || (templateObject_6 = _tslib.__makeTemplateObject(["\n  display: flex;\n  color: ", ";\n  border-radius: 0.5rem;\n  min-width: min-content;\n  .TinySlider {\n    flex-grow: 1;\n  }\n"], ["\n  display: flex;\n  color: ", ";\n  border-radius: 0.5rem;\n  min-width: min-content;\n  .TinySlider {\n    flex-grow: 1;\n  }\n"])), function (props) { return props.color || props.theme.color20; });
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;

exports.LoginDemo = LoginDemo;
exports.LoginDemoInner = LoginDemoInner;
exports.LoginDemoItem = LoginDemoItem;
exports.LoginDemoItemDesc = LoginDemoItemDesc;
exports.LoginDemoItemImage = LoginDemoItemImage;
exports.LoginDemoItemTitle = LoginDemoItemTitle;
//# sourceMappingURL=LoginDemo.styles.js.map
