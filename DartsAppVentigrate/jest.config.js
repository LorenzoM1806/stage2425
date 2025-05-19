export default {
    transform: {
        '^.+\\.(js|jsx|ts|tsx)?$': ['babel-jest'],
    },
    extensionsToTreatAsEsm: [".ts", ".tsx",  ".jsx"],
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Mock CSS imports
        '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/mocks/fileMock.js'
    },
    testEnvironment: 'jest-environment-jsdom', // Ensure jsdom is being used
    setupFiles: ['./jest.setup.js'],
};