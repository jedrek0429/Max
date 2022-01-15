"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CommandManager {
    constructor(client) {
        this.client = client;
        this.commands = client.commands;
        this.commandsData = [];
    }
    setup() {
        var _a, _b;
        for (const command of [...this.commands.values()]) {
            this.commandsData.push(command.data);
        }
        (_b = (_a = this.client.application) === null || _a === void 0 ? void 0 : _a.commands) === null || _b === void 0 ? void 0 : _b.set(this.commandsData);
    }
}
exports.default = CommandManager;
