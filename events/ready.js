"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.name = void 0;
exports.name = "ready";
const run = (client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log(`${(_a = client.user) === null || _a === void 0 ? void 0 : _a.username} is ready.`);
    client.commandManager.setup();
    yield dbSetup(client);
});
exports.run = run;
const dbSetup = (client) => {
    client.db.query(`
		CREATE TABLE IF NOT EXISTS nicks ( id VARCHAR(18) PRIMARY KEY, nick VARCHAR(255) )
	`)
        .then(res => console.log("The database is now ready to use!"))
        .catch(e => console.error("Error while preparing database:\n" + e.stack));
};
