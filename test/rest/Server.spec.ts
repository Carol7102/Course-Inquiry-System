import Server from "../../src/rest/Server";
import InsightFacade from "../../src/controller/InsightFacade";
import chai, {expect, use} from "chai";
import chaiHttp from "chai-http";
import * as fs from "fs";
import {it} from "mocha";
import {InsightError, NotFoundError} from "../../src/controller/IInsightFacade";

describe("Facade D3", function () {

	let facade: InsightFacade;
	let server: Server;

	let SERVER_URL = "http://localhost:4321";

	use(chaiHttp);

	before(function () {
		facade = new InsightFacade();
		server = new Server(4321);
		// TODO: start server here once and handle errors properly
		server.start();
	});

	after(function () {
		// TODO: stop server here once!
		server.stop();
	});

	beforeEach(function () {
		// might want to add some process logging here to keep track of what"s going on
	});

	afterEach(function () {
		// might want to add some process logging here to keep track of what"s going on
	});

	describe("GET/DEL/POST", function () {
		describe("200", function () {
			it("delete", function () {
				try {
					return chai.request(SERVER_URL)
						.delete("/dataset/c2")
						.then(function (res) {
							// console.log(res.status);
							expect(res.status).to.be.equal(200);
							expect(res.body).to.be.deep.equal({result: "c2"});
						}).catch(function(err) {
							expect.fail(err);
						});
				} catch (err) {
					expect.fail();
				}
			});
			it("get", function () {
				try {
					return chai.request(SERVER_URL)
						.get("/datasets")
						.then(function (res) {
							expect(res.status).to.be.equal(200);
							expect(res.body).to.be.deep.equal({
								result: [
									{id: "c2", kind: "courses", numRows: 64612},
									// {id: "rooms", kind: "rooms", numRows: 364}
								]
							});
						})
						.catch(function (err) {
							console.log(err);
							expect.fail(err);
						});
				} catch (err) {
					expect.fail();
				}
			});
			it("1 valid dataset", function () {
				try {
					return chai.request(SERVER_URL)
						.put("/dataset/c2/courses")
						.send(fs.readFileSync("./test/resources/archives/courses.zip"))
						.set("Content-Type", "application/x-zip-compressed")
						.then(function (res) {
							// some logging here please!
							// console.log("1");
							expect(res.status).to.be.equal(200);
							expect(res.body).to.be.deep.equal({result: ["c2"]});
						})
						.catch(function (err) {
							// some logging here please!
							console.log(err);
							expect.fail(err);
						});
				} catch (err) {
					// and some more logging here!
					expect.fail();
				}
			});
			it("2 valid datasets", function () {
				try {
					return chai.request(SERVER_URL)
						.put("/dataset/rooms/rooms")
						// .send()
						.send(fs.readFileSync("./test/resources/archives/rooms.zip"))
						.set("Content-Type", "application/x-zip-compressed")
						.then(function (res) {
							// some logging here please!j
							expect(res.status).to.be.equal(200);
							// console.log("1");
							expect(res.body).to.be.deep.equal({result: ["c2","rooms"]});
						})
						.catch(function () {
							// some logging here please!
							expect.fail();
						});
				} catch (err) {
					// and some more logging here!
					expect.fail();
				}
			});
		});

		describe("400", function () {
			it("underscore in id", function () {
				try {
					return chai.request(SERVER_URL)
						.put("/dataset/my_courses/courses")
						// .send("../resources/archives/courses.zip")
						.attach("datasetZip", "./test/resources/archives/courses.zip")
						.set("Content-Type", "application/x-zip-compressed")
						.then(function (res) {
							// some logging here please!
							expect(res.status).to.be.equal(400);
							expect(res.body["error"]).to.match(/.*/);
						})
						.catch(function (err) {
							// some logging here please!
							expect.fail();
						});
				} catch (err) {
					// and some more logging here!
					expect.fail();
				}
			});
			it("whitespace in id", function () {
				try {
					return chai.request(SERVER_URL)
						.put("/dataset/ /courses")
						// .send("../resources/archives/courses.zip")
						.attach("datasetZip", "./test/resources/archives/courses.zip")
						.set("Content-Type", "application/x-zip-compressed")
						.then(function (res) {
							// some logging here please!
							expect(res.status).to.be.equal(400);
							expect(res.body["error"]).to.match(/.*/);
						})
						.catch(function (err) {
							// some logging here please!
							expect.fail();
						});
				} catch (err) {
					// and some more logging here!
					expect.fail();
				}
			});
			it("empty body", function () {
				try {
					return chai.request(SERVER_URL)
						.put("/dataset/courses/courses")
						.then(function (res) {
							// some logging here please!
							expect(res.status).to.be.equal(400);
							expect(res.body["error"]).to.match(/.*/);
						})
						.catch(function (err) {
							// some logging here please!
							expect.fail();
						});
				} catch (err) {
					// and some more logging here!
					expect.fail();
				}
			});
		});

		// Sample on how to format PUT requests
		/*
		it("PUT test for courses dataset", function () {
			try {
				return chai.request(SERVER_URL)
					.put(ENDPOINT_URL)
					.send(ZIP_FILE_DATA)
					.set("Content-Type", "application/x-zip-compressed")
					.then(function (res: Response) {
						// some logging here please!
						expect(res.status).to.be.equal(200);
					})
					.catch(function (err) {
						// some logging here please!
						expect.fail();
					});
			} catch (err) {
				// and some more logging here!
			}
		});
		*/

		// The other endpoints work similarly. You should be able to find all instructions at the chai-http documentation
	});

	describe("POST /query", function () {
		describe("200", function () {
			it("valid transformation", function () {
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
					return chai.request(SERVER_URL)
						.post("/query")
						.send(q2)
						.then(function (res) {
							// some logging here please!
							// console.log(res.status);
							expect(res.status).to.be.equal(200);

						})
						.catch(function (err) {
							// some logging here please!
							expect.fail();
						});
				} catch (err) {
					// and some more logging here!
				}
			});
		});
		describe("400", function () {
			it("invalid1", function () {
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
					return chai.request(SERVER_URL)
						.post("/query")
						.send(q1)
						.then(function (res) {
							// some logging here please!
							// console.log(res.status);
							expect(res.status).to.be.equal(400);
						})
						.catch(function (err) {
							// some logging here please!
							expect.fail();
						});
				} catch (err) {
					// and some more logging here!
				}
			});
		});
	});
});
