import path from "path";

import chai from "chai";
import chaiHttp from "chai-http";

import puppeteer from "puppeteer";
import { setConfig } from "next/config";

import nextConfig from "./_fixtures/next.config";

setConfig(nextConfig); // Set the config before doing/importing anything
global.nextConfig = nextConfig;

chai.use(chaiHttp);
chai.should();

global.chai = chai;
global.pup = puppeteer;

const pkg = require(path.resolve("./package.json"));

before(async function () {
	this.timeout(8000);
	console.log(`Starting tests for ${pkg.name}`);
});
