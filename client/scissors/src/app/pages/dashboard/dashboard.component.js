"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.push(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.push(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardComponent = void 0;
const core_1 = require("@angular/core");
exports.DashboardComponent = (() => {
    let _classDecorators = [(0, core_1.Component)({
            selector: 'app-dashboard',
            templateUrl: './dashboard.component.html',
            styleUrls: ['./dashboard.component.scss'],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _pageTitle_decorators;
    let _pageTitle_initializers = [];
    let _pageSubTitle_decorators;
    let _pageSubTitle_initializers = [];
    var DashboardComponent = _classThis = class {
        constructor() {
            this.pageTitle = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _pageTitle_initializers, void 0));
            this.pageSubTitle = __runInitializers(this, _pageSubTitle_initializers, void 0);
            this.isWidthToggled = true;
        }
        toggleWidth() {
            this.isWidthToggled = !this.isWidthToggled;
        }
    };
    __setFunctionName(_classThis, "DashboardComponent");
    (() => {
        _pageTitle_decorators = [(0, core_1.Input)()];
        _pageSubTitle_decorators = [(0, core_1.Input)()];
        __esDecorate(null, null, _pageTitle_decorators, { kind: "field", name: "pageTitle", static: false, private: false, access: { has: obj => "pageTitle" in obj, get: obj => obj.pageTitle, set: (obj, value) => { obj.pageTitle = value; } } }, _pageTitle_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _pageSubTitle_decorators, { kind: "field", name: "pageSubTitle", static: false, private: false, access: { has: obj => "pageSubTitle" in obj, get: obj => obj.pageSubTitle, set: (obj, value) => { obj.pageSubTitle = value; } } }, _pageSubTitle_initializers, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        DashboardComponent = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DashboardComponent = _classThis;
})();
