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
exports.AlertComponent = void 0;
const core_1 = require("@angular/core");
exports.AlertComponent = (() => {
    let _classDecorators = [(0, core_1.Component)({
            selector: 'app-alert',
            templateUrl: './alert.component.html',
            styleUrls: ['./alert.component.scss'],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _responseMessage_decorators;
    let _responseMessage_initializers = [];
    let _responseType_decorators;
    let _responseType_initializers = [];
    let _responseIcon_decorators;
    let _responseIcon_initializers = [];
    var AlertComponent = _classThis = class {
        constructor() {
            this.responseMessage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _responseMessage_initializers, void 0));
            this.responseType = __runInitializers(this, _responseType_initializers, void 0);
            this.responseIcon = __runInitializers(this, _responseIcon_initializers, void 0);
            this.showAlert = true;
            this.showTimerAlert = false;
            this.timerDuration = 5000; // 5 seconds
        }
        onCancelClick() {
            this.showAlert = false;
        }
        resetAlert() {
            this.showAlert = true;
            setTimeout(() => {
                this.showAlert = false;
            }, 5000);
        }
    };
    __setFunctionName(_classThis, "AlertComponent");
    (() => {
        _responseMessage_decorators = [(0, core_1.Input)()];
        _responseType_decorators = [(0, core_1.Input)()];
        _responseIcon_decorators = [(0, core_1.Input)()];
        __esDecorate(null, null, _responseMessage_decorators, { kind: "field", name: "responseMessage", static: false, private: false, access: { has: obj => "responseMessage" in obj, get: obj => obj.responseMessage, set: (obj, value) => { obj.responseMessage = value; } } }, _responseMessage_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _responseType_decorators, { kind: "field", name: "responseType", static: false, private: false, access: { has: obj => "responseType" in obj, get: obj => obj.responseType, set: (obj, value) => { obj.responseType = value; } } }, _responseType_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _responseIcon_decorators, { kind: "field", name: "responseIcon", static: false, private: false, access: { has: obj => "responseIcon" in obj, get: obj => obj.responseIcon, set: (obj, value) => { obj.responseIcon = value; } } }, _responseIcon_initializers, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        AlertComponent = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AlertComponent = _classThis;
})();
