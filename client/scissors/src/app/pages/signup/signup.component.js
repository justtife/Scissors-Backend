"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignupComponent = void 0;
const core_1 = require("@angular/core");
const alert_component_1 = require("src/app/component/alert/alert.component");
exports.SignupComponent = (() => {
    let _classDecorators = [(0, core_1.Component)({
            selector: 'app-signup',
            templateUrl: './signup.component.html',
            styleUrls: ['./signup.component.scss'],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _alertComponent_decorators;
    let _alertComponent_initializers = [];
    var SignupComponent = _classThis = class {
        constructor(http, route) {
            this.http = (__runInitializers(this, _instanceExtraInitializers), http);
            this.route = route;
            this.isSubmitting = false;
            this.user = {};
            this.responseMessage = '';
            this.responseType = {
                type: '',
                icon: '',
            };
            this.alertComponent = __runInitializers(this, _alertComponent_initializers, void 0);
            this.countries = [
                { name: 'Country 1', code: 'C1' },
                { name: 'Country 2', code: 'C2' },
                { name: 'Country 3', code: 'C3' },
                // Add more countries as needed
            ];
        }
        resetAlert() {
            if (this.alertComponent) {
                this.alertComponent.resetAlert();
            }
        }
        onFileSelected(event) {
            const inputElement = event.target;
            if (!inputElement.files || inputElement.files.length === 0) {
                return;
            }
            const file = inputElement.files;
            this.selectedFile = file;
            this.user.profilePic = file;
            console.log(inputElement.files);
        }
        onSubmit() {
            return __awaiter(this, void 0, void 0, function* () {
                console.log(this.user);
                this.isSubmitting = true;
                try {
                    this.http.signUser(this.user).subscribe((response) => {
                        this.apiResponse = response;
                        this.responseType.type = 'alert-success';
                        this.responseType.icon = 'bi-hand-thumbs-up';
                        localStorage.setItem('token', response.token);
                        localStorage.setItem('userID', response.data.userID);
                        setTimeout(() => {
                            this.route.navigate(['/dashboard']);
                            this.isSubmitting = false;
                        }, 3000);
                    }, (error) => {
                        this.apiResponse = error.error;
                        this.responseType.type = 'alert-warning';
                        this.responseType.icon = 'bi-exclamation-triangle';
                        this.isSubmitting = false;
                        this.resetAlert();
                    });
                }
                catch (err) {
                    console.log(err);
                }
            });
        }
    };
    __setFunctionName(_classThis, "SignupComponent");
    (() => {
        _alertComponent_decorators = [(0, core_1.ViewChild)(alert_component_1.AlertComponent)];
        __esDecorate(null, null, _alertComponent_decorators, { kind: "field", name: "alertComponent", static: false, private: false, access: { has: obj => "alertComponent" in obj, get: obj => obj.alertComponent, set: (obj, value) => { obj.alertComponent = value; } } }, _alertComponent_initializers, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        SignupComponent = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SignupComponent = _classThis;
})();
