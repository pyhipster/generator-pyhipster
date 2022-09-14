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
 const needleServer = require('./needle-entity-server');
 const constants = require('../../generator-constants');
 
 const SERVER_MAIN_SRC_DIR = constants.SERVER_MAIN_SRC_DIR;

 module.exports = class extends needleServer {
    addEntitiesToAPIList(entityClass) {
        console.log("Initializing Needle API");
        this.addEntityResourceBlueprintToList(entityClass);
        this.addEntityImportToList(entityClass);
        this.addEntityResourceImportToList(entityClass);
      }

      addEntityImportToList(entry) {
        const errorMessage = chalk.yellow(`\nUnable to add domain entity ${entry} to __init__.py file.`);
        const cachePath = `${SERVER_MAIN_SRC_DIR}rest/__init__.py`;
    
        const needle = `pyhipster-needle-domain-add-entity-import`;
        const content = `from domain import ${entry}`;
        this._doAddBlockContentToFile(cachePath, needle, content, errorMessage);
      }
    
      addEntityResourceImportToList(entry) {
        const errorMessage = chalk.yellow(`\nUnable to add ${entry} resource to __init__.py file.`);
        const cachePath = `${SERVER_MAIN_SRC_DIR}rest/__init__.py`;
    
        const needle = `pyhipster-needle-rest-api-list-add-entry-import`;
        const content = `from rest import ${entry}Resource`;
        this._doAddBlockContentToFile(cachePath, needle, content, errorMessage);
      }

      addEntityResourceBlueprintToList(entry) {
        const errorMessage = chalk.yellow(`\nUnable to add ${entry} blueprint to __init__.py file.`);
        const cachePath = `${SERVER_MAIN_SRC_DIR}rest/__init__.py`;
    
        const needle = `pyhipster-needle-rest-api-list-add-entry`;
        const content = `app.register_blueprint(${entry}Resource.bp)`;
        this._doAddBlockContentToFile(cachePath, needle, content, errorMessage);
      }
    
      _doAddBlockContentToFile(cachePath, needle, content, errorMessage) {
        const rewriteFileModel = this.generateFileModel(cachePath, needle, content);
        this.addBlockContentToFile(rewriteFileModel, errorMessage);
      }
 };