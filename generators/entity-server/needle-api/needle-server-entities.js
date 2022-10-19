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
 const _ = require('lodash');
 const pluralize = require('pluralize');

 const SERVER_MAIN_SRC_DIR = constants.SERVER_MAIN_SRC_DIR;
 module.exports = class extends needleServer {
    addEntitiesToAPIList(entityClass) {
        const pluralEntity = pluralize(entityClass);
        const lowerCaseEntities = _.lowerCase(pluralEntity);
        const entityMethod = _.replace(lowerCaseEntities, ' ', '_'); 

        this.addEntityNamespaceToList(entityClass, entityMethod);
        this.addEntityResourceListToNamespace(entityClass, entityMethod);
        this.addEntityResourceListCountToNamespace(entityClass, entityMethod);
        this.addEntityResourceToNamespace(entityClass, entityMethod);
        this.addEntityResourceImportToList(entityClass, entityMethod);
      }
    
      addEntityResourceImportToList(entry, entityMethod) {
        const errorMessage = chalk.yellow(`\nUnable to add ${entry} resource to __init__.py file.`);
        const cachePath = `${SERVER_MAIN_SRC_DIR}rest/__init__.py`;
    
        const needle = `pyhipster-needle-rest-api-list-add-entry-import`;
        const content = `from .${entry}Resource import ${entityMethod}_list_ns`;
        this._doAddBlockContentToFile(cachePath, needle, content, errorMessage);
      }

      addEntityNamespaceToList(entry, entityMethod) {
        const errorMessage = chalk.yellow(`\nUnable to add ${entry} namespace to __init__.py file.`);
        const cachePath = `${SERVER_MAIN_SRC_DIR}rest/__init__.py`;
    
        const needle = `pyhipster-needle-rest-api-list-add-namespaces`;
        const content = `api.add_namespace(${entityMethod}_list_ns)`;
        this._doAddBlockContentToFile(cachePath, needle, content, errorMessage);
      }

      addEntityResourceListToNamespace(entry, entityMethod) {
        const errorMessage = chalk.yellow(`\nUnable to add ${entry} resource to namespace in __init__.py file.`);
        const cachePath = `${SERVER_MAIN_SRC_DIR}rest/__init__.py`;
    
        const needle = `pyhipster-needle-rest-api-list-add-resource-list`;
        const content = `${entityMethod}_list_ns.add_resource(${entry}Resource.${entry}ResourceList, "")`;
        this._doAddBlockContentToFile(cachePath, needle, content, errorMessage);
      }

      addEntityResourceListCountToNamespace(entry, entityMethod) {
        const errorMessage = chalk.yellow(`\nUnable to add ${entry} resource to namespace in __init__.py file.`);
        const cachePath = `${SERVER_MAIN_SRC_DIR}rest/__init__.py`;
    
        const needle = `pyhipster-needle-rest-api-list-add-resource-list-count`;
        const content = `${entityMethod}_list_ns.add_resource(${entry}Resource.${entry}ResourceListCount, "/count")`;
        this._doAddBlockContentToFile(cachePath, needle, content, errorMessage);
      }

      addEntityResourceToNamespace(entry, entityMethod) {
        const errorMessage = chalk.yellow(`\nUnable to add ${entry} resource to namespace in __init__.py file.`);
        const cachePath = `${SERVER_MAIN_SRC_DIR}rest/__init__.py`;
    
        const needle = `pyhipster-needle-rest-api-list-add-resource`;
        const content = `${entityMethod}_list_ns.add_resource(${entry}Resource.${entry}Resource, "/<int:id>")`;
        this._doAddBlockContentToFile(cachePath, needle, content, errorMessage);
      }
    
      _doAddBlockContentToFile(cachePath, needle, content, errorMessage) {
        const rewriteFileModel = this.generateFileModel(cachePath, needle, content);
        this.addBlockContentToFile(rewriteFileModel, errorMessage);
      }
 };