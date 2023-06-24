"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@angular/core/testing");
const url_service_service_1 = require("./url-service.service");
describe('UrlServiceService', () => {
    let service;
    beforeEach(() => {
        testing_1.TestBed.configureTestingModule({});
        service = testing_1.TestBed.inject(url_service_service_1.UrlServiceService);
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
