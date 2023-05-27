"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Server_1 = __importDefault(require("../../src/rest/Server"));
const InsightFacade_1 = __importDefault(require("../../src/controller/InsightFacade"));
const chai_1 = __importStar(require("chai"));
const chai_http_1 = __importDefault(require("chai-http"));
const fs = __importStar(require("fs"));
const mocha_1 = require("mocha");
describe("Facade D3", function () {
    let facade;
    let server;
    let SERVER_URL = "http://localhost:4321";
    (0, chai_1.use)(chai_http_1.default);
    before(function () {
        facade = new InsightFacade_1.default();
        server = new Server_1.default(4321);
        server.start();
    });
    after(function () {
        server.stop();
    });
    beforeEach(function () {
    });
    afterEach(function () {
    });
    describe("GET/DEL/POST", function () {
        describe("200", function () {
            (0, mocha_1.it)("delete", function () {
                try {
                    return chai_1.default.request(SERVER_URL)
                        .delete("/dataset/c2")
                        .then(function (res) {
                        (0, chai_1.expect)(res.status).to.be.equal(200);
                        (0, chai_1.expect)(res.body).to.be.deep.equal({ result: "c2" });
                    }).catch(function (err) {
                        chai_1.expect.fail(err);
                    });
                }
                catch (err) {
                    chai_1.expect.fail();
                }
            });
            (0, mocha_1.it)("get", function () {
                try {
                    return chai_1.default.request(SERVER_URL)
                        .get("/datasets")
                        .then(function (res) {
                        (0, chai_1.expect)(res.status).to.be.equal(200);
                        (0, chai_1.expect)(res.body).to.be.deep.equal({
                            result: [
                                { id: "c2", kind: "courses", numRows: 64612 },
                            ]
                        });
                    })
                        .catch(function (err) {
                        console.log(err);
                        chai_1.expect.fail(err);
                    });
                }
                catch (err) {
                    chai_1.expect.fail();
                }
            });
            (0, mocha_1.it)("1 valid dataset", function () {
                try {
                    return chai_1.default.request(SERVER_URL)
                        .put("/dataset/c2/courses")
                        .send(fs.readFileSync("./test/resources/archives/courses.zip"))
                        .set("Content-Type", "application/x-zip-compressed")
                        .then(function (res) {
                        (0, chai_1.expect)(res.status).to.be.equal(200);
                        (0, chai_1.expect)(res.body).to.be.deep.equal({ result: ["c2"] });
                    })
                        .catch(function (err) {
                        console.log(err);
                        chai_1.expect.fail(err);
                    });
                }
                catch (err) {
                    chai_1.expect.fail();
                }
            });
            (0, mocha_1.it)("2 valid datasets", function () {
                try {
                    return chai_1.default.request(SERVER_URL)
                        .put("/dataset/rooms/rooms")
                        .send(fs.readFileSync("./test/resources/archives/rooms.zip"))
                        .set("Content-Type", "application/x-zip-compressed")
                        .then(function (res) {
                        (0, chai_1.expect)(res.status).to.be.equal(200);
                        (0, chai_1.expect)(res.body).to.be.deep.equal({ result: ["c2", "rooms"] });
                    })
                        .catch(function () {
                        chai_1.expect.fail();
                    });
                }
                catch (err) {
                    chai_1.expect.fail();
                }
            });
        });
        describe("400", function () {
            (0, mocha_1.it)("underscore in id", function () {
                try {
                    return chai_1.default.request(SERVER_URL)
                        .put("/dataset/my_courses/courses")
                        .attach("datasetZip", "./test/resources/archives/courses.zip")
                        .set("Content-Type", "application/x-zip-compressed")
                        .then(function (res) {
                        (0, chai_1.expect)(res.status).to.be.equal(400);
                        (0, chai_1.expect)(res.body["error"]).to.match(/.*/);
                    })
                        .catch(function (err) {
                        chai_1.expect.fail();
                    });
                }
                catch (err) {
                    chai_1.expect.fail();
                }
            });
            (0, mocha_1.it)("whitespace in id", function () {
                try {
                    return chai_1.default.request(SERVER_URL)
                        .put("/dataset/ /courses")
                        .attach("datasetZip", "./test/resources/archives/courses.zip")
                        .set("Content-Type", "application/x-zip-compressed")
                        .then(function (res) {
                        (0, chai_1.expect)(res.status).to.be.equal(400);
                        (0, chai_1.expect)(res.body["error"]).to.match(/.*/);
                    })
                        .catch(function (err) {
                        chai_1.expect.fail();
                    });
                }
                catch (err) {
                    chai_1.expect.fail();
                }
            });
            (0, mocha_1.it)("empty body", function () {
                try {
                    return chai_1.default.request(SERVER_URL)
                        .put("/dataset/courses/courses")
                        .then(function (res) {
                        (0, chai_1.expect)(res.status).to.be.equal(400);
                        (0, chai_1.expect)(res.body["error"]).to.match(/.*/);
                    })
                        .catch(function (err) {
                        chai_1.expect.fail();
                    });
                }
                catch (err) {
                    chai_1.expect.fail();
                }
            });
        });
    });
    describe("POST /query", function () {
        describe("200", function () {
            (0, mocha_1.it)("valid transformation", function () {
                const q2 = {
                    WHERE: {
                        GT: {
                            courses_avg: 99
                        }
                    },
                    OPTIONS: {
                        COLUMNS: [
                            "courses_dept",
                            "courses_avg"
                        ],
                        ORDER: "courses_avg"
                    }
                };
                try {
                    return chai_1.default.request(SERVER_URL)
                        .post("/query")
                        .send(q2)
                        .then(function (res) {
                        (0, chai_1.expect)(res.status).to.be.equal(200);
                    })
                        .catch(function (err) {
                        chai_1.expect.fail();
                    });
                }
                catch (err) {
                }
            });
        });
        describe("400", function () {
            (0, mocha_1.it)("invalid1", function () {
                const q1 = {
                    WHERE: {
                        GG: {
                            courses_avg: 99
                        }
                    },
                    OPTIONS: {
                        COLUMNS: [
                            "courses_dept",
                            "courses_avg"
                        ],
                        ORDER: "courses_avg"
                    }
                };
                try {
                    return chai_1.default.request(SERVER_URL)
                        .post("/query")
                        .send(q1)
                        .then(function (res) {
                        (0, chai_1.expect)(res.status).to.be.equal(400);
                    })
                        .catch(function (err) {
                        chai_1.expect.fail();
                    });
                }
                catch (err) {
                }
            });
        });
    });
});
//# sourceMappingURL=Server.spec.js.map