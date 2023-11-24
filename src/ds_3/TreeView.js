(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"), require("bi-internal/services"));
	else if(typeof define === 'function' && define.amd)
		define(["react", "bi-internal/services"], factory);
	else if(typeof exports === 'object')
		exports["@luxms/bi-resources"] = factory(require("react"), require("bi-internal/services"));
	else
		root["@luxms/bi-resources"] = factory(root["react"], root["bi-internal/services"]);
})(self, function(__WEBPACK_EXTERNAL_MODULE__297__, __WEBPACK_EXTERNAL_MODULE__2__) {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 2:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__2__;

/***/ }),

/***/ 297:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__297__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(297);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var bi_internal_services__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony import */ var bi_internal_services__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(bi_internal_services__WEBPACK_IMPORTED_MODULE_1__);



/**
 * ID куба данные которого мы отоборжаем.
 */
var ROOT_KOOB_ID = "luxmsbi.organisations_test";
/**
 * ID куба с перечнем дополнительных колонок.
 */

var FAFORM_KOOB_ID = "luxmsbi.public_faform";
/**
 * Интерфейс сущности, которую мы получаем из БД, и описывающей дополнительную колонку.
 */

/**
 * Преобразование сущностей организаций получаемых из бд к внутреннему формату.
 */
var mapItems = function mapItems(dtos) {
  var organisationsMap = new Map();
  dtos.forEach(function (dto) {
    var organisationData = organisationsMap.has(dto.predpr_pred_id) ? organisationsMap.get(dto.predpr_pred_id) : {
      id: dto.predpr_pred_id,
      name: dto.pname || "",
      hasChildren: dto.children_count > 0,
      formData: new Map()
    };

    if (dto.form_id !== undefined && dto.form_id !== null && dto.form_status) {
      organisationData.formData.set(dto.form_id, dto.form_status);
    }

    organisationsMap.set(organisationData.id, organisationData);
  });
  return Array.from(organisationsMap.values());
};
/**
 * Преобразование сущностей доп. колонок получаемых из бд к внутреннему формату.
 */


var mapColumns = function mapColumns(dtos) {
  return dtos.map(function (dto) {
    return {
      id: dto.frm_id,
      title: dto.title
    };
  });
};
/**
 * Создаем KoobDataService для загрузки орагнизаций.
 */


var createRootKoobDataService = function createRootKoobDataService(filters) {
  if (filters === void 0) {
    filters = {};
  }

  return new bi_internal_services__WEBPACK_IMPORTED_MODULE_1__.KoobDataService(ROOT_KOOB_ID, [{
    id: "predpr_pred_id",
    type: "INTEGER",
    sql: "predpr_pred_id",
    title: "predpr_pred_id"
  }, {
    id: "gr_id",
    type: "INTEGER",
    sql: "gr_id",
    title: "gr_id"
  }, {
    id: "pred_v_id",
    type: "INTEGER",
    sql: "pred_v_id",
    title: "pred_v_id"
  }, {
    id: "pred_n_id",
    type: "INTEGER",
    sql: "pred_n_id",
    title: "pred_n_id"
  }, {
    id: "pname",
    type: "STRING",
    sql: "pname",
    title: "pname"
  }, {
    id: "sname",
    type: "STRING",
    sql: "sname",
    title: "sname"
  }, {
    id: "vname",
    type: "STRING",
    sql: "vname",
    title: "vname"
  }, {
    id: "form_status",
    type: "STRING",
    sql: "form_status",
    title: "form_status"
  }, {
    id: "form_title",
    type: "STRING",
    sql: "form_title",
    title: "form_title"
  }, {
    id: "children_count",
    type: "INTEGER",
    sql: "children_count",
    title: "children_count"
  }], [], filters);
};
/**
 * Создаем KoobDataService для загрузки доп. колонок.
 */


var createFaformKoobDataService = function createFaformKoobDataService() {
  return new bi_internal_services__WEBPACK_IMPORTED_MODULE_1__.KoobDataService(FAFORM_KOOB_ID, [{
    id: "frm_id",
    type: "INTEGER",
    sql: "predpr_pred_id",
    title: "predpr_pred_id"
  }, {
    id: "title",
    type: "STRING",
    sql: "title",
    title: "title"
  }], [], {});
};
/**
 * Стилизиванный тег th
 */


var Th = function Th(_ref) {
  var children = _ref.children;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("th", {
    style: {
      borderRight: "1px solid darkgray",
      padding: "5px"
    }
  }, children);
};
/**
 * Стилизиванный тег td
 */


var Td = function Td(_ref2) {
  var children = _ref2.children;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("td", {
    style: {
      minWidth: "200px",
      borderRight: "1px solid darkgray",
      padding: "5px"
    }
  }, children);
};

/**
 * Кнопка свернуть/развернуть дочерние организации.
 */
var ShowChildrenButton = function ShowChildrenButton(_ref3) {
  var isOpened = _ref3.isOpened,
      onClick = _ref3.onClick;
  var handleClick = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function () {
    onClick(!isOpened);
  }, [isOpened, onClick]);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
    onClick: handleClick,
    style: {
      border: "1px solid black",
      cursor: "pointer",
      width: "23px",
      height: "23px",
      display: "inline-block",
      textAlign: "center"
    }
  }, isOpened ? "-" : "+");
};
/**
 * Хук загрузки орагнизаций.
 */


var useItems = function useItems(filters) {
  if (filters === void 0) {
    filters = {};
  }

  var dataService = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(function () {
    return createRootKoobDataService(filters);
  }, []);

  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]),
      items = _useState[0],
      setItems = _useState[1];

  var handleSataServiceUpdate = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (model) {
    if (model.error || model.loading) {
      setItems([]);
      return;
    }

    var itemDtos = model.values;
    setItems(mapItems(itemDtos));
  }, [setItems]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    dataService.subscribeUpdatesAndNotify(handleSataServiceUpdate);
    return function () {
      dataService.subscribeUpdatesAndNotify(handleSataServiceUpdate);
    };
  }, [dataService, handleSataServiceUpdate]);
  return items;
};
/**
 * Хук загрузки доп. колонок.
 */


var useFaformColumns = function useFaformColumns() {
  var dataService = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(createFaformKoobDataService, []);

  var _useState2 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]),
      items = _useState2[0],
      setItems = _useState2[1];

  var handleSataServiceUpdate = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (model) {
    if (model.error || model.loading) {
      setItems([]);
      return;
    }

    var itemDtos = model.values;
    setItems(mapColumns(itemDtos));
  }, [setItems]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    dataService.subscribeUpdatesAndNotify(handleSataServiceUpdate);
    return function () {
      dataService.subscribeUpdatesAndNotify(handleSataServiceUpdate);
    };
  }, [dataService, handleSataServiceUpdate]);
  return items;
};

/**
 * Компонента отображающая дочерние организации.
 */
var ItemChildrenView = function ItemChildrenView(_ref4) {
  var item = _ref4.item,
      depth = _ref4.depth,
      formColumns = _ref4.formColumns;
  var items = useItems({
    "PRED_V_ID": ["=", item.id]
  });
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, items.map(function (item) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(ItemView, {
      key: item.id,
      item: item,
      depth: depth + 1,
      formColumns: formColumns
    });
  }));
};

/**
 * Компонента отображающая организацию.
 */
var ItemView = function ItemView(_ref5) {
  var item = _ref5.item,
      depth = _ref5.depth,
      formColumns = _ref5.formColumns;

  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
      isOpened = _useState3[0],
      setIsOpened = _useState3[1];

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("tr", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Td, null, "----".repeat(depth), item.hasChildren && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(ShowChildrenButton, {
    isOpened: isOpened,
    onClick: setIsOpened
  }), item.id), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Td, null, item.name), formColumns.map(function (column) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Td, {
      key: column.id
    }, item.formData.get(column.id) || "No data");
  })), isOpened && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(ItemChildrenView, {
    item: item,
    depth: depth,
    formColumns: formColumns
  }));
};
/**
 * Дерево организаций.
 */


var TreeView = function TreeView(props) {
  var items = useItems({
    "GR_ID": ["=", 7]
  });
  var formColumns = useFaformColumns();
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    style: {
      padding: "20px",
      overflow: "scroll",
      maxHeight: "400px"
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("table", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("thead", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Th, null, "ID"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Th, null, "\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435"), formColumns.map(function (column) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Td, {
      key: column.id
    }, column.title);
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("tbody", null, items.map(function (item) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(ItemView, {
      key: item.id,
      item: item,
      depth: 0,
      formColumns: formColumns
    });
  }))));
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TreeView);
})();

__webpack_exports__ = __webpack_exports__.default;
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=TreeView.js.map