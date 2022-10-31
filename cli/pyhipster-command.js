/**
 * Copyright 2013-2022 the original author or authors from the JHipster project.
 *
 * This file is part of the JHipster project, see https://www.jhipster.tech/
 * for more information.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const chalk = require('chalk');
const { Command, Option } = require('commander');

class PyHipsterCommand extends Command {
  createCommand(name) {
    return new PyHipsterCommand(name);
  }

  /**
   * Alternative for alias() accepting chaining with undefined value.
   * @param {String} alias
   * @return {PyHipsterCommand} this;
   */
  addAlias(alias) {
    if (alias) {
      this.alias(alias);
    }
    return this;
  }

  /**
   * Register a callback to be executed before _parseCommand.
   * Used to lazy load options.
   * @param {Function} lazyBuildCommandCallBack
   * @return {PyHipsterCommand} this;
   */
  lazyBuildCommand(lazyBuildCommandCallBack) {
    this._lazyBuildCommandCallBack = lazyBuildCommandCallBack;
    return this;
  }

  /**
   * Register callback to customize _excessArguments behavior.
   * @param {Function} excessArgumentsCallback
   * @return {PyHipsterCommand} this;
   */
  excessArgumentsCallback(excessArgumentsCallback) {
    this._excessArgumentsCallback = excessArgumentsCallback;
    return this;
  }

  /**
   * @private
   * Override _excessArguments to customize behavior.
   */
  _excessArguments(receivedArgs) {
    if (this._excessArgumentsCallback) {
      this._excessArgumentsCallback(receivedArgs);
    } else {
      super._excessArguments(receivedArgs);
    }
  }

  /**
   * @private
   * Override _parseCommand to execute a callback before parsing.
   */
  async _parseCommand(operands, unknown) {
    if (this._lazyBuildCommandCallBack) {
      await this._lazyBuildCommandCallBack(operands, unknown);
    }
    return super._parseCommand(operands, unknown);
  }

  /**
   * Override addOption to register a negative alternative for every option.
   * @param {Option} option
   * @return {PyHipsterCommand} this;
   */
  addOption(option) {
    if (!option.long || option.required || option.optional) {
      return super.addOption(option);
    }
    if (option.negate) {
      // Add a affirmative option for negative boolean options.
      // Should be done before, because commander adds a non working affirmative by itself.
      super.addOption(new Option(option.long.replace(/^--no-/, '--')).hideHelp());
    }
    const result = super.addOption(option);
    if (!option.negate) {
      // Add a hidden negative option for affirmative boolean options.
      super.addOption(new Option(option.long.replace(/^--/, '--no-')).hideHelp());
    }
    return result;
  }

  /**
   * Register arguments using cli/commands.js structure.
   * @param {String[]} args
   * @return {PyHipsterCommand} this;
   */
  addCommandArguments(args) {
    if (Array.isArray(args)) {
      args.forEach(arg => this.argument(arg));
    }
    return this;
  }

  /**
   * Register options using cli/commands.js structure.
   * @param {object[]} lazyBuildCommandCallBack
   * @return {PyHipsterCommand} this;
   */
  addCommandOptions(opts = []) {
    opts.forEach(opt => this._addCommandOption(opt));
    return this;
  }

  _addCommandOption(opt) {
    const additionalDescription = opt.blueprint ? chalk.yellow(` (blueprint option: ${opt.blueprint})`) : '';
    return this.addOption(new Option(opt.option, opt.desc + additionalDescription).default(opt.default));
  }

  /**
   * Register arguments using generator._arguments structure.
   * @param {object[]} generatorArgs
   * @return {PyHipsterCommand} this;
   */
  addGeneratorArguments(generatorArgs = []) {
    if (!generatorArgs) return this;
    generatorArgs.forEach(argument => {
      let argName = argument.type === Array ? `${argument.name}...` : argument.name;
      argName = argument.required ? `<${argName}>` : `[${argName}]`;
      this.argument(argName, argument.description);
    });
    return this;
  }

  /**
   * Register options using generator._options structure.
   * @param {object} options
   * @param {string} blueprintOptionDescription - description of the blueprint that adds the option
   * @return {PyHipsterCommand} this;
   */
  addGeneratorOptions(options = {}, blueprintOptionDescription) {
    Object.entries(options).forEach(([key, value]) => {
      this._addGeneratorOption(key, value, blueprintOptionDescription);
    });
    return this;
  }

  _addGeneratorOption(optionName, optionDefinition, additionalDescription = '') {
    if (optionName === 'help') {
      return undefined;
    }
    const longOption = `--${optionName}`;
    const existingOption = this._findOption(longOption);
    if (this._findOption(longOption)) {
      return existingOption;
    }

    let cmdString = '';
    if (optionDefinition.alias) {
      cmdString = `-${optionDefinition.alias}, `;
    }
    cmdString = `${cmdString}${longOption}`;
    if (optionDefinition.type === String) {
      cmdString = optionDefinition.required !== false ? `${cmdString} <value>` : `${cmdString} [value]`;
    } else if (optionDefinition.type === Array) {
      cmdString = optionDefinition.required !== false ? `${cmdString} <value...>` : `${cmdString} [value...]`;
    }
    const option = new Option(cmdString, optionDefinition.description + additionalDescription)
      .default(optionDefinition.default)
      .hideHelp(optionDefinition.hide);
    if (optionDefinition.choices && optionDefinition.choices.length > 0) {
      option.choices(optionDefinition.choices);
    }
    return this.addOption(option);
  }
}

module.exports = PyHipsterCommand;
