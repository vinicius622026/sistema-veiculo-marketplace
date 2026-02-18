module.exports = {
  moduleNameMapper: {
    "\.(css|less)$": "identity-obj-proxy",
  },
  testPathIgnorePatterns: ["<rootDir>/.next/"],
  transform: {
    ".+\.(js|ts|jsx|tsx)$": "babel-jest",
  },
  testEnvironment: "jsdom",
};