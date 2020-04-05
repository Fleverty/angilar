export function getVersion(): string {
	return APP_VERSION;
}

export function getBuildMode(): "production" | "development" {
	// eslint-disable-next-line no-undef
	return process.env.NODE_ENV;
}
