/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./pages/_app.js":
/*!***********************!*\
  !*** ./pages/_app.js ***!
  \***********************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var lodash_merge__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lodash/merge */ \"lodash/merge\");\n/* harmony import */ var lodash_merge__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(lodash_merge__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var wagmi_chains__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! wagmi/chains */ \"wagmi/chains\");\n/* harmony import */ var wagmi_chains__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(wagmi_chains__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _utils_suppressWalletConnectErrors__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/suppressWalletConnectErrors */ \"./utils/suppressWalletConnectErrors.js\");\n/* harmony import */ var _rainbow_me_rainbowkit__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @rainbow-me/rainbowkit */ \"@rainbow-me/rainbowkit\");\n/* harmony import */ var wagmi__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! wagmi */ \"wagmi\");\n/* harmony import */ var wagmi__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(wagmi__WEBPACK_IMPORTED_MODULE_7__);\n/* harmony import */ var wagmi_providers_jsonRpc__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! wagmi/providers/jsonRpc */ \"wagmi/providers/jsonRpc\");\n/* harmony import */ var wagmi_providers_jsonRpc__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(wagmi_providers_jsonRpc__WEBPACK_IMPORTED_MODULE_8__);\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_rainbow_me_rainbowkit__WEBPACK_IMPORTED_MODULE_6__]);\n_rainbow_me_rainbowkit__WEBPACK_IMPORTED_MODULE_6__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n\n\n\n\n\n\n\n\nconst { chains , provider  } = (0,wagmi__WEBPACK_IMPORTED_MODULE_7__.configureChains)([\n    wagmi_chains__WEBPACK_IMPORTED_MODULE_4__.sepolia\n], [\n    (0,wagmi_providers_jsonRpc__WEBPACK_IMPORTED_MODULE_8__.jsonRpcProvider)({\n        rpc: (chain)=>{\n            if (chain.id !== wagmi_chains__WEBPACK_IMPORTED_MODULE_4__.sepolia.id) return null;\n            return {\n                http: `https://sepolia.infura.io/v3/313d61c497b74eaeac16e57f2cb20b72`\n            };\n        }\n    })\n]);\nconst { connectors  } = (0,_rainbow_me_rainbowkit__WEBPACK_IMPORTED_MODULE_6__.getDefaultWallets)({\n    appName: \"Custome Dex\",\n    projectId: \"c4f79cc821944d9680842e34466bfbd9\",\n    chains\n});\nconst wagmiClient = (0,wagmi__WEBPACK_IMPORTED_MODULE_7__.createClient)({\n    autoConnect: false,\n    // Suppress WalletConnect WebSocket errors in development\n    connectors,\n    provider\n});\nconst myTheme = lodash_merge__WEBPACK_IMPORTED_MODULE_3___default()((0,_rainbow_me_rainbowkit__WEBPACK_IMPORTED_MODULE_6__.midnightTheme)(), {\n    colors: {\n        accentColor: \"#18181b\",\n        accentColorForeground: \"#fff\"\n    }\n});\nconst MyApp = ({ Component , pageProps  })=>{\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(wagmi__WEBPACK_IMPORTED_MODULE_7__.WagmiConfig, {\n        client: wagmiClient,\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_rainbow_me_rainbowkit__WEBPACK_IMPORTED_MODULE_6__.RainbowKitProvider, {\n            chains: chains,\n            theme: myTheme,\n            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                ...pageProps\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\admin\\\\Apps\\\\tokenswap\\\\pages\\\\_app.js\",\n                lineNumber: 58,\n                columnNumber: 11\n            }, undefined)\n        }, void 0, false, {\n            fileName: \"C:\\\\Users\\\\admin\\\\Apps\\\\tokenswap\\\\pages\\\\_app.js\",\n            lineNumber: 57,\n            columnNumber: 9\n        }, undefined)\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\admin\\\\Apps\\\\tokenswap\\\\pages\\\\_app.js\",\n        lineNumber: 55,\n        columnNumber: 5\n    }, undefined);\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MyApp);\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLmpzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBMEI7QUFDSztBQUVFO0FBQ1U7QUFDTDtBQUM2QztBQU9uRDtBQUVtQztBQUNUO0FBRTFELE1BQU0sRUFBRVksTUFBTSxHQUFFQyxRQUFRLEdBQUUsR0FBR0wsc0RBQWUsQ0FDMUM7SUFBQ04saURBQU87Q0FBQyxFQUNUO0lBQ0NTLHdFQUFlLENBQUM7UUFDZEcsR0FBRyxFQUFFLENBQUNDLEtBQUssR0FBSztZQUNkLElBQUlBLEtBQUssQ0FBQ0MsRUFBRSxLQUFLZCxvREFBVSxFQUFFLE9BQU8sSUFBSSxDQUFDO1lBQ3pDLE9BQU87Z0JBQ0xlLElBQUksRUFBRSxDQUFDLDZEQUE2RCxDQUFDO2FBQ3RFLENBQUM7U0FDSDtLQUNGLENBQUM7Q0FDRixDQUNGO0FBRUQsTUFBTSxFQUFFQyxVQUFVLEdBQUUsR0FBR2QseUVBQWlCLENBQUM7SUFDdkNlLE9BQU8sRUFBRSxhQUFhO0lBQ3RCQyxTQUFTLEVBQUUsa0NBQWtDO0lBQzdDUixNQUFNO0NBQ1AsQ0FBQztBQUVGLE1BQU1TLFdBQVcsR0FBR1osbURBQVksQ0FBQztJQUMvQmEsV0FBVyxFQUFFLEtBQUs7SUFDbEIseURBQXlEO0lBQ3pESixVQUFVO0lBQ1ZMLFFBQVE7Q0FDVCxDQUFDO0FBRUYsTUFBTVUsT0FBTyxHQUFHdEIsbURBQUssQ0FBQ00scUVBQWEsRUFBRSxFQUFFO0lBQ3JDaUIsTUFBTSxFQUFFO1FBQ05DLFdBQVcsRUFBRSxTQUFTO1FBQ3RCQyxxQkFBcUIsRUFBRSxNQUFNO0tBQzlCO0NBQ0YsQ0FBQztBQUVGLE1BQU1DLEtBQUssR0FBRyxDQUFDLEVBQUVDLFNBQVMsR0FBRUMsU0FBUyxHQUFFLEdBQUs7SUFDMUMscUJBQ0UsOERBQUNuQiw4Q0FBVztRQUFDb0IsTUFBTSxFQUFFVCxXQUFXO2tCQUU1Qiw0RUFBQ2hCLHNFQUFrQjtZQUFDTyxNQUFNLEVBQUVBLE1BQU07WUFBRW1CLEtBQUssRUFBRVIsT0FBTztzQkFDaEQsNEVBQUNLLFNBQVM7Z0JBQUUsR0FBR0MsU0FBUzs7Ozs7eUJBQUk7Ozs7O3FCQUNUOzs7OztpQkFFWCxDQUNkO0NBQ0g7QUFFRCxpRUFBZUYsS0FBSyxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdW5pc3dhcC10b2tlbi1tYXJrZXRwbGFjZS8uL3BhZ2VzL19hcHAuanM/ZTBhZCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCBcIi4uL3N0eWxlcy9nbG9iYWxzLmNzc1wiO1xyXG5cclxuaW1wb3J0IG1lcmdlIGZyb20gXCJsb2Rhc2gvbWVyZ2VcIjtcclxuaW1wb3J0IFwiQHJhaW5ib3ctbWUvcmFpbmJvd2tpdC9zdHlsZXMuY3NzXCI7XHJcbmltcG9ydCB7IHNlcG9saWEgfSBmcm9tICd3YWdtaS9jaGFpbnMnXHJcbmltcG9ydCB7IHN1cHByZXNzV2FsbGV0Q29ubmVjdEVycm9ycyB9IGZyb20gJy4uL3V0aWxzL3N1cHByZXNzV2FsbGV0Q29ubmVjdEVycm9ycyc7XHJcblxyXG5pbXBvcnQge1xyXG4gIGdldERlZmF1bHRXYWxsZXRzLFxyXG4gIFJhaW5ib3dLaXRQcm92aWRlcixcclxuICBkYXJrVGhlbWUsXHJcbiAgbWlkbmlnaHRUaGVtZSxcclxufSBmcm9tIFwiQHJhaW5ib3ctbWUvcmFpbmJvd2tpdFwiO1xyXG5cclxuaW1wb3J0IHsgY29uZmlndXJlQ2hhaW5zLCBjcmVhdGVDbGllbnQsIFdhZ21pQ29uZmlnIH0gZnJvbSBcIndhZ21pXCI7XHJcbmltcG9ydCB7IGpzb25ScGNQcm92aWRlciB9IGZyb20gXCJ3YWdtaS9wcm92aWRlcnMvanNvblJwY1wiO1xyXG5cclxuY29uc3QgeyBjaGFpbnMsIHByb3ZpZGVyIH0gPSBjb25maWd1cmVDaGFpbnMoXHJcbiAgW3NlcG9saWFdLFxyXG4gIFtcclxuICAganNvblJwY1Byb3ZpZGVyKHtcclxuICAgICBycGM6IChjaGFpbikgPT4ge1xyXG4gICAgICAgaWYgKGNoYWluLmlkICE9PSBzZXBvbGlhLmlkKSByZXR1cm4gbnVsbDtcclxuICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgIGh0dHA6IGBodHRwczovL3NlcG9saWEuaW5mdXJhLmlvL3YzLzMxM2Q2MWM0OTdiNzRlYWVhYzE2ZTU3ZjJjYjIwYjcyYCxcclxuICAgICAgIH07XHJcbiAgICAgfSxcclxuICAgfSlcclxuICBdXHJcbik7XHJcblxyXG5jb25zdCB7IGNvbm5lY3RvcnMgfSA9IGdldERlZmF1bHRXYWxsZXRzKHtcclxuICBhcHBOYW1lOiBcIkN1c3RvbWUgRGV4XCIsXHJcbiAgcHJvamVjdElkOiBcImM0Zjc5Y2M4MjE5NDRkOTY4MDg0MmUzNDQ2NmJmYmQ5XCIsXHJcbiAgY2hhaW5zLFxyXG59KTtcclxuXHJcbmNvbnN0IHdhZ21pQ2xpZW50ID0gY3JlYXRlQ2xpZW50KHtcclxuICBhdXRvQ29ubmVjdDogZmFsc2UsXHJcbiAgLy8gU3VwcHJlc3MgV2FsbGV0Q29ubmVjdCBXZWJTb2NrZXQgZXJyb3JzIGluIGRldmVsb3BtZW50XHJcbiAgY29ubmVjdG9ycyxcclxuICBwcm92aWRlcixcclxufSk7XHJcblxyXG5jb25zdCBteVRoZW1lID0gbWVyZ2UobWlkbmlnaHRUaGVtZSgpLCB7XHJcbiAgY29sb3JzOiB7XHJcbiAgICBhY2NlbnRDb2xvcjogXCIjMTgxODFiXCIsXHJcbiAgICBhY2NlbnRDb2xvckZvcmVncm91bmQ6IFwiI2ZmZlwiLFxyXG4gIH0sXHJcbn0pO1xyXG5cclxuY29uc3QgTXlBcHAgPSAoeyBDb21wb25lbnQsIHBhZ2VQcm9wcyB9KSA9PiB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxXYWdtaUNvbmZpZyBjbGllbnQ9e3dhZ21pQ2xpZW50fT5cclxuICAgXHJcbiAgICAgICAgPFJhaW5ib3dLaXRQcm92aWRlciBjaGFpbnM9e2NoYWluc30gdGhlbWU9e215VGhlbWV9PlxyXG4gICAgICAgICAgPENvbXBvbmVudCB7Li4ucGFnZVByb3BzfSAvPlxyXG4gICAgICAgIDwvUmFpbmJvd0tpdFByb3ZpZGVyPlxyXG4gICAgIFxyXG4gICAgPC9XYWdtaUNvbmZpZz5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgTXlBcHA7XHJcbiJdLCJuYW1lcyI6WyJSZWFjdCIsIm1lcmdlIiwic2Vwb2xpYSIsInN1cHByZXNzV2FsbGV0Q29ubmVjdEVycm9ycyIsImdldERlZmF1bHRXYWxsZXRzIiwiUmFpbmJvd0tpdFByb3ZpZGVyIiwiZGFya1RoZW1lIiwibWlkbmlnaHRUaGVtZSIsImNvbmZpZ3VyZUNoYWlucyIsImNyZWF0ZUNsaWVudCIsIldhZ21pQ29uZmlnIiwianNvblJwY1Byb3ZpZGVyIiwiY2hhaW5zIiwicHJvdmlkZXIiLCJycGMiLCJjaGFpbiIsImlkIiwiaHR0cCIsImNvbm5lY3RvcnMiLCJhcHBOYW1lIiwicHJvamVjdElkIiwid2FnbWlDbGllbnQiLCJhdXRvQ29ubmVjdCIsIm15VGhlbWUiLCJjb2xvcnMiLCJhY2NlbnRDb2xvciIsImFjY2VudENvbG9yRm9yZWdyb3VuZCIsIk15QXBwIiwiQ29tcG9uZW50IiwicGFnZVByb3BzIiwiY2xpZW50IiwidGhlbWUiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./pages/_app.js\n");

/***/ }),

/***/ "./utils/suppressWalletConnectErrors.js":
/*!**********************************************!*\
  !*** ./utils/suppressWalletConnectErrors.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"suppressWalletConnectErrors\": () => (/* binding */ suppressWalletConnectErrors)\n/* harmony export */ });\n// Utility to suppress WalletConnect WebSocket connection errors in development\nconst suppressWalletConnectErrors = ()=>{\n    if (false) {}\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi91dGlscy9zdXBwcmVzc1dhbGxldENvbm5lY3RFcnJvcnMuanMuanMiLCJtYXBwaW5ncyI6Ijs7OztBQUFBLCtFQUErRTtBQUN4RSxNQUFNQSwyQkFBMkIsR0FBRyxJQUFNO0lBQy9DLElBQUksS0FBdUUsRUFBRSxFQVk1RTtDQUNGLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly91bmlzd2FwLXRva2VuLW1hcmtldHBsYWNlLy4vdXRpbHMvc3VwcHJlc3NXYWxsZXRDb25uZWN0RXJyb3JzLmpzP2I5NzYiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gVXRpbGl0eSB0byBzdXBwcmVzcyBXYWxsZXRDb25uZWN0IFdlYlNvY2tldCBjb25uZWN0aW9uIGVycm9ycyBpbiBkZXZlbG9wbWVudFxyXG5leHBvcnQgY29uc3Qgc3VwcHJlc3NXYWxsZXRDb25uZWN0RXJyb3JzID0gKCkgPT4ge1xyXG4gIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50Jykge1xyXG4gICAgY29uc3Qgb3JpZ2luYWxFcnJvciA9IGNvbnNvbGUuZXJyb3I7XHJcbiAgICBjb25zb2xlLmVycm9yID0gKC4uLmFyZ3MpID0+IHtcclxuICAgICAgY29uc3QgbWVzc2FnZSA9IGFyZ3NbMF07XHJcbiAgICAgIGlmICh0eXBlb2YgbWVzc2FnZSA9PT0gJ3N0cmluZycgJiYgXHJcbiAgICAgICAgICAobWVzc2FnZS5pbmNsdWRlcygnV2ViU29ja2V0IGNvbm5lY3Rpb24gdG8nKSAmJiBcclxuICAgICAgICAgICBtZXNzYWdlLmluY2x1ZGVzKCd3YWxsZXRjb25uZWN0Lm9yZycpICYmIFxyXG4gICAgICAgICAgIG1lc3NhZ2UuaW5jbHVkZXMoJ2ZhaWxlZCcpKSkge1xyXG4gICAgICAgIHJldHVybjsgLy8gU3VwcHJlc3MgV2FsbGV0Q29ubmVjdCBXZWJTb2NrZXQgZXJyb3JzXHJcbiAgICAgIH1cclxuICAgICAgb3JpZ2luYWxFcnJvci5hcHBseShjb25zb2xlLCBhcmdzKTtcclxuICAgIH07XHJcbiAgfVxyXG59OyAiXSwibmFtZXMiOlsic3VwcHJlc3NXYWxsZXRDb25uZWN0RXJyb3JzIiwicHJvY2VzcyIsIm9yaWdpbmFsRXJyb3IiLCJjb25zb2xlIiwiZXJyb3IiLCJhcmdzIiwibWVzc2FnZSIsImluY2x1ZGVzIiwiYXBwbHkiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./utils/suppressWalletConnectErrors.js\n");

/***/ }),

/***/ "./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "lodash/merge":
/*!*******************************!*\
  !*** external "lodash/merge" ***!
  \*******************************/
/***/ ((module) => {

"use strict";
module.exports = require("lodash/merge");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "wagmi":
/*!************************!*\
  !*** external "wagmi" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("wagmi");

/***/ }),

/***/ "wagmi/chains":
/*!*******************************!*\
  !*** external "wagmi/chains" ***!
  \*******************************/
/***/ ((module) => {

"use strict";
module.exports = require("wagmi/chains");

/***/ }),

/***/ "wagmi/providers/jsonRpc":
/*!******************************************!*\
  !*** external "wagmi/providers/jsonRpc" ***!
  \******************************************/
/***/ ((module) => {

"use strict";
module.exports = require("wagmi/providers/jsonRpc");

/***/ }),

/***/ "@rainbow-me/rainbowkit":
/*!*****************************************!*\
  !*** external "@rainbow-me/rainbowkit" ***!
  \*****************************************/
/***/ ((module) => {

"use strict";
module.exports = import("@rainbow-me/rainbowkit");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./pages/_app.js"));
module.exports = __webpack_exports__;

})();