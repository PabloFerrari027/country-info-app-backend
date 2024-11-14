"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryContriesRepository = void 0;
class InMemoryContriesRepository {
    constructor() {
        this.items = [];
    }
    async create(country) {
        this.items.push(country);
        return country;
    }
    async findByName(name) {
        return this.items.find(country => country.commonName === name) ?? null;
    }
    async list() {
        return { data: this.items };
    }
}
exports.InMemoryContriesRepository = InMemoryContriesRepository;
