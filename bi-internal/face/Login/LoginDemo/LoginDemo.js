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

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var LoginDemo_styles = require('./LoginDemo.styles.js');
var index = require('../../TinySlider/index.js');

var LoginDemo = function (_a) {
    var children = _a.children;
    return (React__default.createElement(LoginDemo_styles.LoginDemo, { className: "LoginDemo" },
        React__default.createElement(LoginDemo_styles.LoginDemoInner, { className: "LoginDemo__Inner" },
            React__default.createElement(index, null, children))));
};
var LoginDemoItem = function (_a) {
    var className = _a.className, children = _a.children, background = _a.background;
    return (React__default.createElement(LoginDemo_styles.LoginDemoItem, { background: background }, children));
};
var LoginDemoItemTitle = function (_a) {
    var className = _a.className, children = _a.children;
    return (React__default.createElement(LoginDemo_styles.LoginDemoItemTitle, null, children));
};
var LoginDemoItemDesc = function (_a) {
    var className = _a.className, children = _a.children;
    return (React__default.createElement(LoginDemo_styles.LoginDemoItemDesc, null, children));
};
var LoginDemoItemImage = function (_a) {
    var className = _a.className, children = _a.children;
    return (React__default.createElement(LoginDemo_styles.LoginDemoItemImage, null, children));
};
LoginDemo.Item = LoginDemoItem;
LoginDemo.ItemTitle = LoginDemoItemTitle;
LoginDemo.ItemDesc = LoginDemoItemDesc;
LoginDemo.ItemImage = LoginDemoItemImage;

module.exports = LoginDemo;
//# sourceMappingURL=LoginDemo.js.map
