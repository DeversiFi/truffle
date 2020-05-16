const command = {
  command: "debug",
  description:
    "Interactively debug any transaction on the blockchain (experimental)",
  builder: {
    _: {
      type: "string"
    },
    network: {
      describe: "Network to connect to",
      type: "string",
      default: "development"
    },
    external: {
      describe: "Allow debugging of external contracts",
      alias: "x",
      type: "boolean",
      default: false
    }
  },
  help: {
    usage:
      "truffle debug [--network <network>] [--external] [<transaction_hash>]",
    options: [
      {
        option: "--network",
        description: "Network to connect to.  Default: development"
      },
      {
        option: "--external",
        description: "Allows debugging of external contracts.  Alias: -x"
      },
      {
        option: "<transaction_hash>",
        description:
          "Transaction ID to use for debugging.  Mandatory if --external is passed."
      }
    ]
  },
  run: function(options, done) {
    const debugModule = require("debug");
    const debug = debugModule("lib:commands:debug");

    const { Environment } = require("@truffle/environment");
    const Config = require("@truffle/config");

    const { CLIDebugger } = require("../debug");

    Promise.resolve()
      .then(async () => {
        const config = Config.detect(options);
        await Environment.detect(config);

        const txHash = config._[0]; //may be undefined
        if (config.external && txHash === undefined) {
          throw new Error(
            "External mode requires a specific transaction to debug"
          );
        }
        return await new CLIDebugger(config, { txHash }).run();
      })
      .then(interpreter => interpreter.start(done))
      .catch(done);
  }
};

module.exports = command;
