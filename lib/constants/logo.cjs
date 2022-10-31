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
const packagejs = require('../../package.json');

// module.exports.logo = `${chalk.green('        ██╗')}${chalk.red(' ██╗   ██╗ ████████╗ ███████╗   ██████╗ ████████╗ ████████╗ ███████╗')}
// ${chalk.green('        ██║')}${chalk.red(' ██║   ██║ ╚══██╔══╝ ██╔═══██╗ ██╔════╝ ╚══██╔══╝ ██╔═════╝ ██╔═══██╗')}
// ${chalk.green('        ██║')}${chalk.red(' ████████║    ██║    ███████╔╝ ╚█████╗     ██║    ██████╗   ███████╔╝')}
// ${chalk.green('  ██╗   ██║')}${chalk.red(' ██╔═══██║    ██║    ██╔════╝   ╚═══██╗    ██║    ██╔═══╝   ██╔══██║')}
// ${chalk.green('  ╚██████╔╝')}${chalk.red(' ██║   ██║ ████████╗ ██║       ██████╔╝    ██║    ████████╗ ██║  ╚██╗')}
// ${chalk.green('   ╚═════╝ ')}${chalk.red(' ╚═╝   ╚═╝ ╚═══════╝ ╚═╝       ╚═════╝     ╚═╝    ╚═══════╝ ╚═╝   ╚═╝')}
//                             https://www.jhipster.tech
// ${chalk.white('Welcome to JHipster')} ${chalk.yellow(`v${packagejs.version}`)}
// `;
module.exports.logo = `
${chalk.green('.----------------.  .----------------. ')}${chalk.red(' .----------------.  .----------------.  .----------------.  .----------------.  .----------------.  .----------------.  .----------------.')} 
${chalk.green('| .--------------. || .--------------. ')}${chalk.red('|| .--------------. || .--------------. || .--------------. || .--------------. || .--------------. || .--------------. || .--------------. |')}
${chalk.green('| |   ______     | || |  ____  ____  | ')}${chalk.red('|| |  ____  ____  | || |     _____    | || |   ______     | || |    _______   | || |  _________   | || |  _________   | || |  _______     | |')}
${chalk.green('| |  |_   __ \\   | || | |_  _||_  _| | ')}${chalk.red('|| | |_   ||   _| | || |    |_   _|   | || |  |_   __ \\   | || |   /  ___  |  | || | |  _   _  |  | || | |_   ___  |  | || | |_   __ \\    | |')}
${chalk.green('| |    | |__) |  | || |   \\ \\  / /   | ')}${chalk.red('|| |   | |__| |   | || |      | |     | || |    | |__) |  | || |  |  (__ \\_|  | || | |_/ | | \\_|  | || |   | |_  \\_|  | || |   | |__) |   | |')}
${chalk.green('| |    |  ___/   | || |    \\ \\/ /    | ')}${chalk.red('|| |   |  __  |   | || |      | |     | || |    |  ___/   | || |   \\\'.___`-.  | || |     | |      | || |   |  _|  _   | || |   |  __ /    | |')}
${chalk.green('| |   _| |_      | || |    _|  |_    | ')}${chalk.red('|| |  _| |  | |_  | || |     _| |_    | || |   _| |_      | || |  |`\\____) |  | || |    _| |_     | || |  _| |___/ |  | || |  _| |  \\ \\_  | |')}
${chalk.green('| |  |_____|     | || |   |______|   | ')}${chalk.red('|| | |____||____| | || |    |_____|   | || |  |_____|     | || |  |_______.\'  | || |   |_____|    | || | |_________|  | || | |____| |___| | |')}
${chalk.green('| |              | || |              | ')}${chalk.red('|| |              | || |              | || |              | || |              | || |              | || |              | || |              | |')}
${chalk.green('| \'--------------\' || \'--------------\' ')}${chalk.red('|| \'--------------\' || \'--------------\' || \'--------------\' || \'--------------\' || \'--------------\' || \'--------------\' || \'--------------\' |')}
${chalk.green('\'----------------\'  \'----------------\' ')}${chalk.red(' \'----------------\'  \'----------------\'  \'----------------\'  \'----------------\'  \'----------------\'  \'----------------\'  \'----------------\'')} 
${chalk.white('Welcome to PyHipster')} ${chalk.yellow(`v${packagejs.version}`)}
`;
