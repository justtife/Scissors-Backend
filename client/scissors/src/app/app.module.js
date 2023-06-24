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
exports.AppModule = void 0;
const core_1 = require("@angular/core");
const platform_browser_1 = require("@angular/platform-browser");
const forms_1 = require("@angular/forms");
const app_routing_module_1 = require("./app-routing.module");
const app_component_1 = require("./app.component");
const signup_component_1 = require("./pages/signup/signup.component");
const login_component_1 = require("./pages/login/login.component");
const navbar_component_1 = require("./component/navbar/navbar.component");
const topnav_component_1 = require("./component/topnav/topnav.component");
const stattab_component_1 = require("./component/stattab/stattab.component");
const main_component_1 = require("./component/main/main.component");
const home_component_1 = require("./pages/home/home.component");
const alert_component_1 = require("./component/alert/alert.component");
const sub_dash_component_1 = require("./pages/sub-dash/sub-dash.component");
const dashboard_module_1 = require("./pages/dashboard/dashboard.module");
const header_module_1 = require("./component/header/header.module");
const user_component_1 = require("./pages/user/user.component");
const http_1 = require("@angular/common/http");
exports.AppModule = (() => {
    let _classDecorators = [(0, core_1.NgModule)({
            declarations: [
                app_component_1.AppComponent,
                // DashboardComponent,
                signup_component_1.SignupComponent,
                login_component_1.LoginComponent,
                navbar_component_1.NavbarComponent,
                topnav_component_1.TopnavComponent,
                stattab_component_1.StattabComponent,
                main_component_1.MainComponent,
                home_component_1.HomeComponent,
                alert_component_1.AlertComponent,
                // HeaderComponent,
                sub_dash_component_1.SubDashComponent,
                user_component_1.UserComponent,
            ],
            imports: [
                platform_browser_1.BrowserModule,
                app_routing_module_1.AppRoutingModule,
                forms_1.FormsModule,
                dashboard_module_1.DashboardModule,
                header_module_1.HeaderModule,
                http_1.HttpClientModule
            ],
            providers: [],
            bootstrap: [app_component_1.AppComponent],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AppModule = _classThis = class {
    };
    __setFunctionName(_classThis, "AppModule");
    (() => {
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        AppModule = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AppModule = _classThis;
})();
