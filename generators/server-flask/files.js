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
const serverCleanup = require('./cleanup');
const constants = require('../generator-constants');
const { GATEWAY, MICROSERVICE, MONOLITH } = require('../../jdl/jhipster/application-types');
const { JWT, OAUTH2, SESSION } = require('../../jdl/jhipster/authentication-types');
const { GRADLE, MAVEN } = require('../../jdl/jhipster/build-tool-types');
const { SPRING_WEBSOCKET } = require('../../jdl/jhipster/websocket-types');
const databaseTypes = require('../../jdl/jhipster/database-types');
const { COUCHBASE, MARIADB, MONGODB, NEO4J, SQL } = require('../../jdl/jhipster/database-types');
const { SIMPLE_CACHE, FILESYSTEM_CACHE, MEMCACHED, REDIS } = require('../../jdl/jhipster/cache-types');
const cacheTypes = require('../../jdl/jhipster/cache-types');
const { ELASTICSEARCH } = require('../../jdl/jhipster/search-engine-types');
const { KAFKA } = require('../../jdl/jhipster/message-broker-types');
const { CONSUL, EUREKA } = require('../../jdl/jhipster/service-discovery-types');
const { addSectionsCondition, mergeSections } = require('../utils');
const { writeCouchbaseFiles } = require('./files-couchbase');
const { writeSqlFiles } = require('./files-sql');

/* Constants use throughout */
const NO_DATABASE = databaseTypes.NO;
const NO_CACHE = cacheTypes.NO;
const INTERPOLATE_REGEX = constants.INTERPOLATE_REGEX;
const DOCKER_DIR = constants.DOCKER_DIR;
const TEST_DIR = constants.TEST_DIR;
const SERVER_MAIN_SRC_DIR = constants.SERVER_MAIN_SRC_DIR;
const SERVER_MAIN_RES_DIR = constants.SERVER_MAIN_RES_DIR;
const SERVER_TEST_SRC_DIR = constants.SERVER_TEST_SRC_DIR;
const SERVER_TEST_RES_DIR = constants.SERVER_TEST_RES_DIR;
const REACT = constants.SUPPORTED_CLIENT_FRAMEWORKS.REACT;
const VUE = constants.SUPPORTED_CLIENT_FRAMEWORKS.VUE;

const shouldSkipUserManagement = generator =>
  generator.skipUserManagement && (generator.applicationType !== MONOLITH || generator.authenticationType !== OAUTH2);

const liquibaseFiles = {
  serverResource: [
    {
      path: SERVER_MAIN_RES_DIR,
      templates: [
        {
          override: generator => !generator.jhipsterConfig.incrementalChangelog || generator.configOptions.recreateInitialChangelog,
          file: 'config/liquibase/changelog/initial_schema.xml',
          renameTo: () => 'config/liquibase/changelog/00000000000000_initial_schema.xml',
          options: { interpolate: INTERPOLATE_REGEX },
        },
        {
          override: generator => !generator.jhipsterConfig.incrementalChangelog || generator.configOptions.recreateInitialChangelog,
          file: 'config/liquibase/master.xml',
        },
      ],
    },
  ],
};

const mongoDbFiles = {
  docker: [
    {
      path: DOCKER_DIR,
      templates: ['mongodb.yml', 'mongodb-cluster.yml', 'mongodb/MongoDB.Dockerfile', 'mongodb/scripts/init_replicaset.js'],
    },
  ],
  serverResource: [
    {
      condition: generator => !generator.skipUserManagement || (generator.skipUserManagement && generator.authenticationType === OAUTH2),
      path: SERVER_MAIN_SRC_DIR,
      templates: [
        {
          file: 'package/config/dbmigrations/InitialSetupMigration.java',
          renameTo: generator => `${generator.javaDir}config/dbmigrations/InitialSetupMigration.java`,
        },
      ],
    },
    {
      path: SERVER_TEST_SRC_DIR,
      templates: [
        {
          file: 'package/config/MongoDbTestContainer.java',
          renameTo: generator => `${generator.testDir}config/MongoDbTestContainer.java`,
        },
        {
          file: 'package/config/EmbeddedMongo.java',
          renameTo: generator => `${generator.testDir}config/EmbeddedMongo.java`,
        },
        {
          file: 'package/config/TestContainersSpringContextCustomizerFactory.java',
          renameTo: generator => `${generator.testDir}config/TestContainersSpringContextCustomizerFactory.java`,
        },
      ],
    },
    {
      path: SERVER_TEST_RES_DIR,
      templates: [
        {
          file: 'META-INF/spring.factories',
        },
        {
          file: 'testcontainers.properties',
        },
      ],
    },
  ],
};

const neo4jFiles = {
  docker: [
    {
      path: DOCKER_DIR,
      templates: ['neo4j.yml'],
    },
  ],
  serverResource: [
    {
      condition: generator => !generator.skipUserManagement || generator.authenticationType === OAUTH2,
      path: SERVER_MAIN_SRC_DIR,
      templates: [
        {
          file: 'package/config/neo4j/Neo4jMigrations.java',
          renameTo: generator => `${generator.javaDir}config/neo4j/Neo4jMigrations.java`,
        },
      ],
    },
    {
      condition: generator => !generator.skipUserManagement || generator.authenticationType === OAUTH2,
      path: SERVER_MAIN_RES_DIR,
      templates: ['config/neo4j/migrations/user__admin.json', 'config/neo4j/migrations/user__user.json'],
    },
  ],
  serverTestFw: [
    {
      path: SERVER_TEST_SRC_DIR,
      templates: [
        {
          file: 'package/AbstractNeo4jIT.java',
          renameTo: generator => `${generator.testDir}/AbstractNeo4jIT.java`,
        },
      ],
    },
  ],
};

const cassandraFiles = {
  docker: [
    {
      path: DOCKER_DIR,
      templates: [
        // docker-compose files
        'cassandra.yml',
        'cassandra-cluster.yml',
        'cassandra-migration.yml',
        // dockerfiles
        'cassandra/Cassandra-Migration.Dockerfile',
        // scripts
        'cassandra/scripts/autoMigrate.sh',
        'cassandra/scripts/execute-cql.sh',
      ],
    },
  ],
  serverResource: [
    {
      path: SERVER_MAIN_RES_DIR,
      templates: [
        'config/cql/create-keyspace-prod.cql',
        'config/cql/create-keyspace.cql',
        'config/cql/drop-keyspace.cql',
        { file: 'config/cql/changelog/README.md', method: 'copy' },
      ],
    },
    {
      condition: generator =>
        generator.applicationType !== MICROSERVICE && (!generator.skipUserManagement || generator.authenticationType === OAUTH2),
      path: SERVER_MAIN_RES_DIR,
      templates: [
        { file: 'config/cql/changelog/create-tables.cql', renameTo: () => 'config/cql/changelog/00000000000000_create-tables.cql' },
        {
          file: 'config/cql/changelog/insert_default_users.cql',
          renameTo: () => 'config/cql/changelog/00000000000001_insert_default_users.cql',
        },
      ],
    },
  ],
  serverTestFw: [
    {
      path: SERVER_TEST_SRC_DIR,
      templates: [
        {
          file: 'package/CassandraKeyspaceIT.java',
          renameTo: generator => `${generator.testDir}CassandraKeyspaceIT.java`,
        },
        {
          file: 'package/config/CassandraTestContainer.java',
          renameTo: generator => `${generator.testDir}config/CassandraTestContainer.java`,
        },
        {
          file: 'package/config/EmbeddedCassandra.java',
          renameTo: generator => `${generator.testDir}config/EmbeddedCassandra.java`,
        },
        {
          file: 'package/config/TestContainersSpringContextCustomizerFactory.java',
          renameTo: generator => `${generator.testDir}config/TestContainersSpringContextCustomizerFactory.java`,
        },
      ],
    },
    {
      path: SERVER_TEST_RES_DIR,
      templates: [
        {
          file: 'META-INF/spring.factories',
        },
        {
          file: 'testcontainers.properties',
        },
      ],
    },
  ],
};

/**
 * The default is to use a file path string. It implies use of the template method.
 * For any other config an object { file:.., method:.., template:.. } can be used
 */
const baseServerFiles = {
  jib: [
    {
      path: 'src/main/docker/jib/',
      templates: ['entrypoint.sh'],
    },
  ],
  packageJson: [
    {
      condition: generator => generator.skipClient,
      templates: ['package.json'],
    },
  ],
  docker: [
    {
      path: DOCKER_DIR,
      templates: [
        'app.yml',
        'jhipster-control-center.yml',
        'sonar.yml',
        'monitoring.yml',
        'prometheus/prometheus.yml',
        'grafana/provisioning/dashboards/dashboard.yml',
        'grafana/provisioning/dashboards/JVM.json',
        'grafana/provisioning/datasources/datasource.yml',
      ],
    },
    {
      condition: generator => generator.databaseTypeSql && !generator.prodDatabaseTypeOracle,
      path: DOCKER_DIR,
      templates: [{ file: generator => `${generator.prodDatabaseType}.yml` }],
    },
    {
      condition: generator => generator.cacheProvider === MEMCACHED,
      path: DOCKER_DIR,
      templates: ['memcached.yml'],
    },
    {
      condition: generator => generator.cacheProvider === REDIS,
      path: DOCKER_DIR,
      templates: ['redis.yml', 'redis-cluster.yml', 'redis/Redis-Cluster.Dockerfile', 'redis/connectRedisCluster.sh'],
    },
    {
      condition: generator => generator.searchEngine === ELASTICSEARCH,
      path: DOCKER_DIR,
      templates: ['elasticsearch.yml'],
    },
    {
      condition: generator => generator.messageBroker === KAFKA,
      path: DOCKER_DIR,
      templates: ['kafka.yml'],
    },
    {
      condition: generator => !!generator.serviceDiscoveryType,
      path: DOCKER_DIR,
      templates: [{ file: 'config/README.md', renameTo: () => 'central-server-config/README.md' }],
    },
    {
      condition: generator => generator.serviceDiscoveryType && generator.serviceDiscoveryType === CONSUL,
      path: DOCKER_DIR,
      templates: [
        'consul.yml',
        { file: 'config/git2consul.json', method: 'copy' },
        { file: 'config/consul-config/application.yml', renameTo: () => 'central-server-config/application.yml' },
      ],
    },
    {
      condition: generator => generator.serviceDiscoveryType && generator.serviceDiscoveryType === EUREKA,
      path: DOCKER_DIR,
      templates: [
        'jhipster-registry.yml',
        {
          file: 'config/docker-config/application.yml',
          renameTo: () => 'central-server-config/docker-config/application.yml',
        },
        {
          file: 'config/localhost-config/application.yml',
          renameTo: () => 'central-server-config/localhost-config/application.yml',
        },
      ],
    },
    {
      condition: generator => !!generator.enableSwaggerCodegen,
      path: DOCKER_DIR,
      templates: ['swagger-editor.yml'],
    },
    {
      condition: generator => generator.authenticationType === OAUTH2 && generator.applicationType !== MICROSERVICE,
      path: DOCKER_DIR,
      templates: [
        'keycloak.yml',
        { file: 'config/realm-config/jhipster-realm.json', renameTo: () => 'realm-config/jhipster-realm.json' },
        { file: 'config/realm-config/jhipster-users-0.json', method: 'copy', renameTo: () => 'realm-config/jhipster-users-0.json' },
      ],
    },
    {
      condition: generator => generator.serviceDiscoveryType || generator.applicationTypeGateway || generator.applicationTypeMicroservice,
      path: DOCKER_DIR,
      templates: ['zipkin.yml'],
    },
  ],
  serverBuild: [
    {
      templates: [
        // { file: 'checkstyle.xml', options: { interpolate: INTERPOLATE_REGEX } },
        { file: 'devcontainer/devcontainer.json', renameTo: () => '.devcontainer/devcontainer.json' },
        { file: 'devcontainer/Dockerfile', renameTo: () => '.devcontainer/Dockerfile' },
        // { file: 'version.py', renameTo: () => 'version.py' },
        // {
        //   file: 'requirements.txt',
        //   renameTo: () => 'requirements.txt'
        // },
        { file: 'pyproject.toml', renameTo: () => 'pyproject.toml' },
        { file: 'poetry.toml', renameTo: () => 'poetry.toml' },
      ],
    },
    {
      condition: generator => generator.databaseTypeSql && generator.devDatabaseTypeSQLiteDisk ,
      templates: [
        { file: 'pyhipster.db3', method: 'copy', noEjs: true },
      ],
    },
    // {
    //   condition: generator => !generator.skipClient,
    //   templates: [
    //     { file: 'npmw', method: 'copy', noEjs: true },
    //     { file: 'npmw.cmd', method: 'copy', noEjs: true },
    //   ],
    // },
    // {
    //   condition: generator => !generator.skipServer,
    //   templates: [
    //     {
    //       file: 'pvnw',
    //       renameTo: () => 'pvnw'
    //     },
    //     {
    //       file: 'pvnw.cmd',
    //       renameTo: () => 'pvnw.cmd'
    //     },
    //   ],
    // },
  ],
  serverResource: [
    {
      condition: generator => generator.clientFramework === REACT,
      path: SERVER_MAIN_RES_DIR,
      templates: [
        {
          file: 'banner-react.txt',
          method: 'copy',
          noEjs: true,
          renameTo: () => 'banner.txt',
        },
      ],
    },
    {
      condition: generator => generator.clientFramework === VUE,
      path: SERVER_MAIN_RES_DIR,
      templates: [
        {
          file: 'banner-vue.txt',
          method: 'copy',
          noEjs: true,
          renameTo: () => 'banner.txt',
        },
      ],
    },
    {
      condition: generator => generator.clientFramework !== REACT && generator.clientFramework !== VUE,
      path: SERVER_MAIN_RES_DIR,
      templates: [{ file: 'banner.txt', method: 'copy', noEjs: true }],
    },
    {
      condition: generator => !!generator.enableSwaggerCodegen,
      path: SERVER_MAIN_RES_DIR,
      templates: ['swagger/api.yml'],
    },
    {
      path: SERVER_MAIN_RES_DIR,
      templates: [
        // Thymeleaf templates
        { file: 'templates/error.html', method: 'copy' },
        // 'logback-spring.xml',
        // 'config/application.yml',
        // 'config/application-dev.yml',
        'config/application-tls.yml',
        // 'config/application-prod.yml',
        'i18n/messages.properties',
        // {
        //   file: 'config/base-config.py',
        //   renameTo: generator => `${generator.javaDir}config/BaseConfig.py`,
        // },
      ],
    },
  ],
  serverJavaAuthConfig: [
    {
      path: SERVER_MAIN_SRC_DIR,
      templates: [
        {
          file: 'package/security/AuthoritiesConstants.py',
          renameTo: generator => `${generator.javaDir}security/AuthoritiesConstants.py`,
        },
        {
          file: 'package/security/SecurityUtils.py',
          renameTo: generator => `${generator.javaDir}security/SecurityUtils.py`,
        },
      ],
    },
    {
      condition: generator => generator.applicationType === MONOLITH && generator.authenticationType === JWT,
      path: SERVER_MAIN_SRC_DIR,
      templates: [
        {
          file: 'package/web/rest/UserJWTController.py',
          renameTo: generator => `${generator.javaDir}rest/UserJWTController.py`,
        },
        {
          file: 'package/web/rest/__init__.py',
          renameTo: generator => `${generator.javaDir}rest/__init__.py`,
        },
      ],
    },
    {
      condition: generator => generator.applicationType === MONOLITH && generator.authenticationType === SESSION,
      path: SERVER_MAIN_SRC_DIR,
      templates: [
        {
          file: 'package/web/rest/__init__.py',
          renameTo: generator => `${generator.javaDir}rest/__init__.py`,
        },
        {
          file: 'package/web/rest/UserSessionController.py',
          renameTo: generator => `${generator.javaDir}rest/UserSessionController.py`,
        },
        {
          file: 'package/web/rest/LogoutResource.py',
          renameTo: generator => `${generator.javaDir}rest/LogoutResource.py`,
        },
      ],
    },
  ],
  serverPythonApp: [
    {
      path: SERVER_MAIN_SRC_DIR,
      templates: [{ file: 'package/application.py', renameTo: generator => `${generator.javaDir}${generator.capitalizedBaseName}App.py` }],
    },
    {
      path: SERVER_MAIN_SRC_DIR,
      templates: [{ file: 'package/WebSerializer.py', renameTo: generator => `${generator.javaDir}WebSerializer.py` }],
    },
    {
      path: SERVER_MAIN_SRC_DIR,
      templates: [{ file: 'package/DatabaseConfig.py', renameTo: generator => `${generator.javaDir}DatabaseConfig.py` }],
    },
    {
      condition: generator => [SIMPLE_CACHE, FILESYSTEM_CACHE, MEMCACHED, REDIS].includes(generator.cacheProvider),
      path: SERVER_MAIN_SRC_DIR,
      templates: [{ file: 'package/CacheConfiguration.py', renameTo: generator => `${generator.javaDir}CacheConfiguration.py` }],
    },
    {
      path: SERVER_MAIN_SRC_DIR,
      templates: [{ file: 'package/MailConfiguration.py', renameTo: generator => `${generator.javaDir}MailConfiguration.py` }],
    },
    {
      path: SERVER_MAIN_SRC_DIR,
      templates: [{ file: 'package/__init__.py', renameTo: generator => `${generator.javaDir}__init__.py` }],
    },
    {
      path: SERVER_MAIN_SRC_DIR,
      templates: [{ file: 'package/__init__.py', renameTo: generator => `${generator.javaDir}security/__init__.py` }],
    }
  ],
  serverJavaConfig: [
    {
      path: SERVER_MAIN_SRC_DIR,
      templates: [
        {
          file: generator => `package/config/BaseConfig.py`,
          renameTo: generator => `${generator.javaDir}config/BaseConfig.py`,
        },
        {
          file: generator => `package/config/FakeDataLoader.py`,
          renameTo: generator => `${generator.javaDir}config/FakeDataLoader.py`,
        },
      ],
    },
    {
      path: SERVER_MAIN_SRC_DIR,
      templates: [
        {
          file: generator => `package/config/__init__.py`,
          renameTo: generator => `${generator.javaDir}config/__init__.py`,
        },
      ],
    },
  ],
  serverPythonDomain : [
    {
      condition: generator => [SQL, MONGODB, NEO4J, COUCHBASE].includes(generator.databaseType),
      path: SERVER_MAIN_SRC_DIR,
      templates: [
        {
          file: 'package/domain/AbstractAuditingEntity.py',
          renameTo: generator => `${generator.javaDir}domain/AbstractAuditingEntity.py`,
        },
      ],
    },
  ],
  serverPythonSchema : [
    {
      condition: generator => [SQL, MONGODB, NEO4J, COUCHBASE].includes(generator.databaseType),
      path: SERVER_MAIN_SRC_DIR,
      templates: [
        {
          file: 'package/schema/__init__.py',
          renameTo: generator => `${generator.javaDir}schema/__init__.py`,
        },
        {
          file: 'package/schema/UserSchema.py',
          renameTo: generator => `${generator.javaDir}schema/UserSchema.py`,
        },
        {
          file: 'package/schema/Authority.py',
          renameTo: generator => `${generator.javaDir}schema/Authority.py`,
        },
        {
          file: 'package/web/rest/AuthorityResource.py',
          renameTo: generator => `${generator.javaDir}rest/AuthorityResource.py`,
        },
      ],
    },
  ],
  serverPythonUnitTests : [

  ],
  serverJavaService: [
    {
      condition: generator => generator.messageBroker === KAFKA,
      path: SERVER_MAIN_SRC_DIR,
      templates: [
        {
          file: 'package/config/KafkaSseConsumer.java',
          renameTo: generator => `${generator.javaDir}config/KafkaSseConsumer.java`,
        },
        {
          file: 'package/config/KafkaSseProducer.java',
          renameTo: generator => `${generator.javaDir}config/KafkaSseProducer.java`,
        },
      ],
    },
  ],
  serverTestReactive: [
    {
      condition: generator => generator.reactive,
      path: SERVER_TEST_SRC_DIR,
      templates: [
        {
          file: 'package/config/JHipsterBlockHoundIntegration.java',
          renameTo: generator => `${generator.testDir}config/JHipsterBlockHoundIntegration.java`,
        },
      ],
    },
    {
      condition: generator => generator.reactive,
      path: SERVER_TEST_RES_DIR,
      templates: ['META-INF/services/reactor.blockhound.integration.BlockHoundIntegration'],
    },
  ],
  springBootOauth2: [
    {
      condition: generator => generator.authenticationTypeOauth2 && generator.applicationTypeMonolith,
      path: SERVER_MAIN_SRC_DIR,
      templates: [
        {
          file: 'package/config/OAuth2Configuration.java',
          renameTo: generator => `${generator.javaDir}config/OAuth2Configuration.java`,
        },
      ],
    },
    {
      condition: generator => generator.authenticationTypeOauth2 && !generator.applicationTypeMicroservice,
      path: SERVER_MAIN_SRC_DIR,
      templates: [
        {
          file: generator => `package/web/filter/OAuth2${generator.reactive ? 'Reactive' : ''}RefreshTokensWebFilter.java`,
          renameTo: generator => `${generator.javaDir}web/filter/OAuth2${generator.reactive ? 'Reactive' : ''}RefreshTokensWebFilter.java`,
        },
      ],
    },
    {
      condition: generator => generator.authenticationTypeOauth2 && !generator.applicationTypeMicroservice,
      path: SERVER_TEST_SRC_DIR,
      templates: [
        { file: 'package/test/util/OAuth2TestUtil.java', renameTo: generator => `${generator.testDir}test/util/OAuth2TestUtil.java` },
      ],
    },
  ],
  serverTestFw: [
      {
      condition: generator => generator.databaseType === SQL && !generator.reactive,
      path: SERVER_TEST_RES_DIR,
      templates: ['config/application-testcontainers.yml'],
    },
    {
      condition: generator => generator.prodDatabaseType === MARIADB && !generator.reactive,
      path: SERVER_TEST_RES_DIR,
      templates: [{ file: 'testcontainers/mariadb/my.cnf', method: 'copy', noEjs: true }],
    },
    {
      condition: generator => generator.reactiveSqlTestContainers,
      path: SERVER_TEST_SRC_DIR,
      templates: [
        {
          file: 'package/ReactiveSqlTestContainerExtension.java',
          renameTo: generator => `${generator.testDir}ReactiveSqlTestContainerExtension.java`,
        },
      ],
    },
    {
      condition: generator => generator.serviceDiscoveryType,
      path: SERVER_TEST_RES_DIR,
      templates: ['config/bootstrap.yml'],
    },
    {
      condition: generator =>
        generator.authenticationType === OAUTH2 && (generator.applicationType === MONOLITH || generator.applicationType === GATEWAY),
      path: SERVER_TEST_SRC_DIR,
      templates: [
        {
          file: 'package/web/rest/LogoutResourceIT.java',
          renameTo: generator => `${generator.testDir}rest/LogoutResourceIT.java`,
        },
      ],
    },
    {
      condition: generator => generator.gatlingTests,
      path: TEST_DIR,
      templates: [
        // Create Gatling test files
        'gatling/conf/gatling.conf',
        'gatling/conf/logback.xml',
      ],
    },
    {
      condition: generator => generator.cucumberTests,
      path: SERVER_TEST_SRC_DIR,
      templates: [
        // Create Cucumber test files
        { file: 'package/cucumber/CucumberIT.java', renameTo: generator => `${generator.testDir}cucumber/CucumberIT.java` },
        {
          file: 'package/cucumber/stepdefs/StepDefs.java',
          renameTo: generator => `${generator.testDir}cucumber/stepdefs/StepDefs.java`,
        },
        {
          file: 'package/cucumber/CucumberTestContextConfiguration.java',
          renameTo: generator => `${generator.testDir}cucumber/CucumberTestContextConfiguration.java`,
        },
      ],
    },
    {
      condition: generator => generator.cucumberTests,
      path: SERVER_TEST_RES_DIR,
      templates: [{ file: 'package/features/gitkeep', renameTo: generator => `${generator.testDir}cucumber/gitkeep`, noEjs: true }],
    },
    {
      condition: generator => generator.messageBroker === KAFKA,
      path: SERVER_TEST_SRC_DIR,
      templates: [
        {
          file: 'package/config/KafkaTestContainer.java',
          renameTo: generator => `${generator.testDir}config/KafkaTestContainer.java`,
        },
        {
          file: 'package/config/EmbeddedKafka.java',
          renameTo: generator => `${generator.testDir}config/EmbeddedKafka.java`,
        },
        {
          file: 'package/config/TestContainersSpringContextCustomizerFactory.java',
          renameTo: generator => `${generator.testDir}config/TestContainersSpringContextCustomizerFactory.java`,
        },
      ],
    },
    {
      condition: generator => generator.messageBroker === KAFKA,
      path: SERVER_TEST_RES_DIR,
      templates: [
        {
          file: 'META-INF/spring.factories',
        },
        {
          file: 'testcontainers.properties',
        },
      ],
    },
  ],
  serverPythonUserManagement: [
    {
      condition: generator => generator.isUsingBuiltInUser(),
      path: SERVER_MAIN_SRC_DIR,
      templates: [
        {
          file: 'package/domain/User.py',
          renameTo: generator => `${generator.javaDir}domain/${generator.asEntity('User')}.py`,
        },
      ],
    },
    {
      condition: generator => generator.isUsingBuiltInUser(),
      path: SERVER_TEST_SRC_DIR,
      templates: [
        {
          file: 'package/unit_tests/Test_User.py',
          renameTo: generator => `${generator.testDir}unit_tests/Test_${generator.asEntity('User')}.py`,
        },
      ],
    },
    {
      condition: generator => generator.isUsingBuiltInUser(),
      path: SERVER_MAIN_SRC_DIR,
      templates: [
        {
          file: 'package/domain/Authority.py',
          renameTo: generator => `${generator.javaDir}domain/Authority.py`,
        },
      ],
    },
    {
      condition: generator => generator.isUsingBuiltInUser(),
      path: SERVER_TEST_SRC_DIR,
      templates: [
        {
          file: 'package/unit_tests/Test_Authority.py',
          renameTo: generator => `${generator.testDir}unit_tests/Test_${generator.asEntity('User')}.py`,
        },
      ],
    },
    {
      condition: generator => authenticationType === JWT,
      path: SERVER_TEST_SRC_DIR,
      templates: [
        {
          file: 'package/functional_tests/Test_UserJWTController.py',
          renameTo: generator => `${generator.testDir}functional_tests/Test_UserJWTController.py`,
        },
      ],
    },
    {
      condition: generator => generator.isUsingBuiltInUser(),
      path: SERVER_MAIN_SRC_DIR,
      templates: [
        {
          file: 'package/domain/__init__.py',
          renameTo: generator => `${generator.javaDir}domain/__init__.py`,
        },
      ],
    },
    {
      condition: generator => !generator.skipUserManagement,
      path: SERVER_MAIN_SRC_DIR,
      templates: [
          {
          file: 'package/web/rest/AccountResource.py',
          renameTo: generator => `${generator.javaDir}rest/AccountResource.py`,
        },
        { file: 'package/web/rest/UserResource.py', renameTo: generator => `${generator.javaDir}rest/UserResource.py` },
        {
          file: 'package/web/rest/PublicUserResource.py',
          renameTo: generator => `${generator.javaDir}rest/PublicUserResource.py`,
        },
      ],
    },
  ],
  serverJavaUserManagement: [
    {
      condition: generator =>
        (generator.authenticationType === OAUTH2 && generator.applicationType !== MICROSERVICE) ||
        (!generator.skipUserManagement && generator.databaseType === SQL),
      path: SERVER_MAIN_RES_DIR,
      templates: ['config/liquibase/data/user.csv'],
    },
    {
      condition: generator =>
        (generator.authenticationType === OAUTH2 && generator.applicationType !== MICROSERVICE && generator.databaseType === SQL) ||
        (!generator.skipUserManagement && generator.databaseType === SQL),
      path: SERVER_MAIN_RES_DIR,
      templates: ['config/liquibase/data/authority.csv', 'config/liquibase/data/user_authority.csv'],
    },
    {
      path: SERVER_MAIN_SRC_DIR,
      templates: [
        {
          file: 'package/web/rest/AppManagment.py',
          renameTo: generator => `${generator.javaDir}rest/AppManagment.py`,
        },
      ],
    },
    {
      condition: generator => !generator.skipUserManagement,
      path: SERVER_MAIN_RES_DIR,
      templates: ['templates/mail/activationEmail.html', 'templates/mail/creationEmail.html', 'templates/mail/passwordResetEmail.html'],
    },
    {
      condition: generator =>
        !generator.skipUserManagement && generator.cucumberTests && !generator.databaseTypeMongodb && !generator.databaseTypeCassandra,
      path: SERVER_TEST_SRC_DIR,
      templates: [
        {
          file: 'package/cucumber/stepdefs/UserStepDefs.java',
          renameTo: generator => `${generator.testDir}cucumber/stepdefs/UserStepDefs.java`,
        },
      ],
    },
    {
      condition: generator =>
        !generator.skipUserManagement && generator.cucumberTests && !generator.databaseTypeMongodb && !generator.databaseTypeCassandra,
      path: SERVER_TEST_RES_DIR,
      templates: [
        {
          file: 'package/features/user/user.feature',
          renameTo: generator => `${generator.testDir}cucumber/user.feature`,
        },
      ],
    },
    // {
    //   condition: generator => !generator.skipUserManagement,
    //   path: SERVER_TEST_RES_DIR,
    //   templates: [
    //     /* User management java test files */
    //     'templates/mail/testEmail.html',
    //   ],
    // },
    {
      condition: generator => !generator.skipUserManagement && !generator.enableTranslation,
      path: SERVER_TEST_RES_DIR,
      templates: ['i18n/messages_en.properties'],
    },
    {
      condition: generator => !generator.skipUserManagement,
      path: SERVER_TEST_SRC_DIR,
      templates: [
        // {
        //   file: 'package/service/MailServiceIT.java',
        //   renameTo: generator => `${generator.testDir}service/MailServiceIT.java`,
        // },
        // {
        //   file: 'package/service/UserServiceIT.java',
        //   renameTo: generator => `${generator.testDir}service/UserServiceIT.java`,
        // },
        // {
        //   file: 'package/service/mapper/UserMapperTest.java',
        //   renameTo: generator => `${generator.testDir}service/mapper/UserMapperTest.java`,
        // },
        // {
        //   file: 'package/config/NoOpMailConfiguration.java',
        //   renameTo: generator => `${generator.testDir}config/NoOpMailConfiguration.java`,
        // },
        // {
        //   file: 'package/web/rest/PublicUserResourceIT.java',
        //   renameTo: generator => `${generator.testDir}web/rest/PublicUserResourceIT.java`,
        // },
        // {
        //   file: 'package/web/rest/UserResourceIT.java',
        //   renameTo: generator => `${generator.testDir}web/rest/UserResourceIT.java`,
        // },
      ],
    },
    // {
    //   condition: generator => !generator.skipUserManagement && generator.authenticationType !== OAUTH2,
    //   path: SERVER_TEST_SRC_DIR,
    //   templates: [
    //     {
    //       file: 'package/web/rest/AccountResourceIT.java',
    //       renameTo: generator => `${generator.testDir}web/rest/AccountResourceIT.java`,
    //     },
    //   ],
    // },
    // {
    //   condition: generator => !generator.skipUserManagement && generator.authenticationType === OAUTH2,
    //   path: SERVER_TEST_SRC_DIR,
    //   templates: [
    //     {
    //       file: 'package/web/rest/AccountResourceIT_oauth2.java',
    //       renameTo: generator => `${generator.testDir}web/rest/AccountResourceIT.java`,
    //     },
    //   ],
    // },
    // {
    //   path: SERVER_TEST_SRC_DIR,
    //   templates: [
    //     {
    //       file: 'package/web/rest/WithUnauthenticatedMockUser.java',
    //       renameTo: generator => `${generator.testDir}web/rest/WithUnauthenticatedMockUser.java`,
    //     },
    //   ],
    // },
  ],
};

const serverFiles = mergeSections(
  baseServerFiles,
  // addSectionsCondition(h2Files, context => context.devDatabaseTypeH2Any),
  addSectionsCondition(liquibaseFiles, context => context.databaseTypeSql),
  addSectionsCondition(mongoDbFiles, context => context.databaseTypeMongodb),
  addSectionsCondition(neo4jFiles, context => context.databaseTypeNeo4j),
  addSectionsCondition(cassandraFiles, context => context.databaseTypeCassandra)
);

function writeFiles() {
  return {
    setUp() {
      this.javaDir = ''; // `${this.packageFolder}/`;
      this.testDir = ''; //`${this.packageFolder}/`;

      // this.generateKeyStore();
    },

    cleanupFiles() {
      if (this.isJhipsterVersionLessThan('7.6.1')) {
        if (this.authenticationTypeOauth2 && !this.databaseTypeNo) {
          this.removeFile(`${this.mainJavaPackageDir}web/rest/UserResource.java`);
          // this.removeFile(`${this.mainJavaPackageDir}rest/UserResource.py`);
        }
      }
    },

    cleanupOldServerFiles() {
      serverCleanup.cleanupOldServerFiles(
        this,
        `${SERVER_MAIN_SRC_DIR}/${this.javaDir}`,
        `${SERVER_TEST_SRC_DIR}/${this.testDir}`,
        SERVER_MAIN_RES_DIR,
        SERVER_TEST_RES_DIR
      );
    },

    writeFiles() {
      return this.writeFilesToDisk(serverFiles);
    },

    ...writeCouchbaseFiles(),

    ...writeSqlFiles(),
  };
}

module.exports = {
  writeFiles,
  serverFiles,
};
