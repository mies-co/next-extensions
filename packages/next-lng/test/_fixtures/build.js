#!/usr/bin/env node

const path = require("path");
const nextPath = require.resolve("next");

const { dir: nextServerDir } = path.parse(nextPath);
const { dir: nextDir } = path.parse(nextServerDir);
const nextCliPath = path.resolve(nextDir, "bin", "next");

process.argv[2] = "build"; // Inject command line args for when we require the bin

// Run `next build`
require(nextCliPath);
