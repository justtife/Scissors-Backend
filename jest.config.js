"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    testEnvironment: 'node',
    roots: ['./src'],
    testMatch: [
        '**/__tests__/**/*.+(js|ts)',
        '**/?(*.)+(spec|test).+(js|ts)',
    ],
    moduleFileExtensions: ['js', 'json', 'ts', 'node'],
};
exports.default = config;
