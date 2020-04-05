const
	child_process = require("child_process"),
	semver = require("semver");

function getVersion() {
	let commitSha = getCommitSha(8);
	let version = semver.parse(require("../package.json").version);
	if (commitSha)
		version.build.push(commitSha);
	version = `${version.toString()}${version.build.length ? `+${version.build.join(".")}` : ""}`;
	return version;
}

function getCommitSha(length) {
	let commitSha = process.env.COMMIT_SHA || process.env.CI_COMMIT_SHA;
	if (!commitSha) {
		try {
			commitSha = child_process.execFileSync("git", ["rev-parse", "HEAD"], { encoding: "ascii", stdio: [undefined, undefined, "ignore"] });
		} catch (err) { /**/ }
	}

	if (commitSha)
		commitSha = commitSha.substr(0, length);

	return commitSha;
}

module.exports = {
	getVersion: getVersion,
};
