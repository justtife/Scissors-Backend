"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@angular/core/testing");
const user_service_service_1 = require("./user-service.service");
describe('UserServiceService', () => {
    let service;
    beforeEach(() => {
        testing_1.TestBed.configureTestingModule({});
        service = testing_1.TestBed.inject(user_service_service_1.UserServiceService);
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
