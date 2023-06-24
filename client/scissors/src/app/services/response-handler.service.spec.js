"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@angular/core/testing");
const response_handler_service_1 = require("./response-handler.service");
describe('ResponseHandlerService', () => {
    let service;
    beforeEach(() => {
        testing_1.TestBed.configureTestingModule({});
        service = testing_1.TestBed.inject(response_handler_service_1.ResponseHandlerService);
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
