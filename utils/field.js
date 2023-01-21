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

const assert = require('assert');
const _ = require('lodash');
const { isReservedTableName } = require('../jdl/jhipster/reserved-keywords');
const { BlobTypes, CommonDBTypes, RelationalOnlyDBTypes } = require('../jdl/jhipster/field-types');
const { MIN, MINLENGTH, MINBYTES, MAX, MAXBYTES, MAXLENGTH, PATTERN, REQUIRED, UNIQUE } = require('../jdl/jhipster/validations');
const { MYSQL, SQL } = require('../jdl/jhipster/database-types');
const { MapperTypes } = require('../jdl/jhipster/entity-options');

const { MAPSTRUCT } = MapperTypes;
const { TEXT, IMAGE, ANY } = BlobTypes;
const {
  BOOLEAN,
  BIG_DECIMAL,
  DOUBLE,
  DURATION,
  FLOAT,
  INSTANT,
  INTEGER,
  LOCAL_DATE,
  LONG,
  STRING,
  UUID,
  ZONED_DATE_TIME,
  IMAGE_BLOB,
  ANY_BLOB,
  TEXT_BLOB,
  BLOB,
} = CommonDBTypes;
const { BYTES, BYTE_BUFFER } = RelationalOnlyDBTypes;

const fakeStringTemplateForFieldName = columnName => {
  let fakeTemplate;
  if (columnName === 'first_name') {
    fakeTemplate = 'name.firstName';
  } else if (columnName === 'last_name') {
    fakeTemplate = 'name.lastName';
  } else if (columnName === 'job_title') {
    fakeTemplate = 'name.jobTitle';
  } else if (columnName === 'telephone' || columnName === 'phone') {
    fakeTemplate = 'phone.phoneNumber';
  } else if (columnName === 'zip_code' || columnName === 'post_code') {
    fakeTemplate = 'address.zipCode';
  } else if (columnName === 'city') {
    fakeTemplate = 'address.city';
  } else if (columnName === 'street_name' || columnName === 'street') {
    fakeTemplate = 'address.streetName';
  } else if (columnName === 'country') {
    fakeTemplate = 'address.country';
  } else if (columnName === 'country_code') {
    fakeTemplate = 'address.countryCode';
  } else if (columnName === 'color') {
    fakeTemplate = 'commerce.color';
  } else if (columnName === 'account') {
    fakeTemplate = 'finance.account';
  } else if (columnName === 'account_name') {
    fakeTemplate = 'finance.accountName';
  } else if (columnName === 'currency_code') {
    fakeTemplate = 'finance.currencyCode';
  } else if (columnName === 'currency_name') {
    fakeTemplate = 'finance.currencyName';
  } else if (columnName === 'currency_symbol') {
    fakeTemplate = 'finance.currencySymbol';
  } else if (columnName === 'iban') {
    fakeTemplate = 'finance.iban';
  } else if (columnName === 'bic') {
    fakeTemplate = 'finance.bic';
  } else if (columnName === 'email') {
    fakeTemplate = 'internet.email';
  } else if (columnName === 'url') {
    fakeTemplate = 'internet.url';
  } else {
    fakeTemplate = 'random.words';
  }
  return `{{${fakeTemplate}}}`;
};

const generateFakeDataForField = (field, faker, changelogDate, type = 'csv') => {
  let data;
  if (field.fakerTemplate) {
    data = faker.faker(field.fakerTemplate);
  } else if (field.fieldValidate && field.fieldValidateRules.includes('pattern')) {
    const re = field.createRandexp();
    if (!re) {
      return undefined;
    }
    const generated = re.gen();
    if (type === 'csv' || type === 'cypress') {
      data = generated.replace(/"/g, '');
    } else {
      data = generated;
    }
    if (data.length === 0) {
      data = undefined;
    }
  } else if (field.fieldIsEnum) {
    if (field.fieldValues.length !== 0) {
      const enumValues = field.enumValues;
      data = enumValues[faker.datatype.number(enumValues.length - 1)].name;
    } else {
      data = undefined;
    }
  } else if (field.fieldType === DURATION && type === 'cypress') {
    data = `PT${faker.datatype.number({ min: 1, max: 59 })}M`;

    // eslint-disable-next-line no-template-curly-in-string
  } else if ([INTEGER, LONG, FLOAT, '${floatType}', DOUBLE, BIG_DECIMAL, DURATION].includes(field.fieldType)) {
    data = faker.datatype.number({
      max: field.fieldValidateRulesMax ? parseInt(field.fieldValidateRulesMax, 10) : undefined,
      min: field.fieldValidateRulesMin ? parseInt(field.fieldValidateRulesMin, 10) : undefined,
    });
  } else if ([INSTANT, ZONED_DATE_TIME, LOCAL_DATE].includes(field.fieldType)) {
    // Iso: YYYY-MM-DDTHH:mm:ss.sssZ
    const date = faker.date.recent(1, changelogDate);
    const isoDate = date.toISOString();
    if (field.fieldType === LOCAL_DATE) {
      data = isoDate.split('T')[0];
    } else if (type === 'json-serializable') {
      data = date;
    } else {
      // Write the date without milliseconds so Java can parse it
      // See https://stackoverflow.com/a/34053802/150868
      // YYYY-MM-DDTHH:mm:ss
      data = isoDate.split('.')[0];
      if (type === 'cypress') {
        // YYYY-MM-DDTHH:mm
        data = data.substr(0, data.length - 3);
      }
    }
  } else if (field.fieldType === BYTES && field.fieldTypeBlobContent !== TEXT) {
    data = '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';
  } else if (field.fieldType === BYTES && field.fieldTypeBlobContent === TEXT) {
    data = 'Welcome to PyHipster!! This helps you to quickly generate, develop, & deploy modern web applications using Python 3 and Flask.';
  } else if (field.fieldType === STRING) {
    data = field.id ? faker.datatype.uuid() : faker.fake(fakeStringTemplateForFieldName(field.columnName));
  } else if (field.fieldType === UUID) {
    data = faker.datatype.uuid();
  } else if (field.fieldType === BOOLEAN) {
    data = faker.datatype.boolean();
  }

  if (field.fieldType === BYTES && type === 'json-serializable') {
    data = Buffer.from(data).toString('base64');
  }

  // Validation rules
  if (data !== undefined && field.fieldValidate === true) {
    // manage String max length
    if (field.fieldValidateRules.includes(MAXLENGTH)) {
      const maxlength = field.fieldValidateRulesMaxlength;
      data = data.substring(0, maxlength);
    }

    // manage String min length
    if (field.fieldValidateRules.includes(MINLENGTH)) {
      const minlength = field.fieldValidateRulesMinlength;
      data = data.length > minlength ? data : data + 'X'.repeat(minlength - data.length);
    }

    // test if generated data is still compatible with the regexp as we potentially modify it with min/maxLength
    if (field.fieldValidateRules.includes(PATTERN) && !new RegExp(`^${field.fieldValidateRulesPattern}$`).test(data)) {
      data = undefined;
    }
  }
  if (
    data !== undefined &&
    type === 'ts' &&
    // eslint-disable-next-line no-template-curly-in-string
    ![BOOLEAN, INTEGER, LONG, FLOAT, '${floatType}', DOUBLE, BIG_DECIMAL].includes(field.fieldType)
  ) {
    data = `'${data}'`;
  } else if (data !== undefined && type === 'csv' && field.fieldValidate && field.fieldValidateRules.includes(PATTERN)) {
    data = `"${data}"`;
  }

  return data;
};

function _derivedProperties(field) {
  const fieldType = field.fieldType;
  const fieldTypeBlobContent = field.fieldTypeBlobContent;
  const validationRules = field.fieldValidate ? field.fieldValidateRules : [];
  _.defaults(field, {
    blobContentTypeText: fieldTypeBlobContent === TEXT,
    blobContentTypeImage: fieldTypeBlobContent === IMAGE,
    blobContentTypeAny: fieldTypeBlobContent === ANY,
    fieldTypeBoolean: fieldType === BOOLEAN,
    fieldTypeBigDecimal: fieldType === BIG_DECIMAL,
    fieldTypeDouble: fieldType === DOUBLE,
    fieldTypeDuration: fieldType === DURATION,
    fieldTypeFloat: fieldType === FLOAT,
    fieldTypeInstant: fieldType === INSTANT,
    fieldTypeInteger: fieldType === INTEGER,
    fieldTypeLocalDate: fieldType === LOCAL_DATE,
    fieldTypeLong: fieldType === LONG,
    fieldTypeString: fieldType === STRING,
    fieldTypeUUID: fieldType === UUID,
    fieldTypeZonedDateTime: fieldType === ZONED_DATE_TIME,
    fieldTypeImageBlob: fieldType === IMAGE_BLOB,
    fieldTypeAnyBlob: fieldType === ANY_BLOB,
    fieldTypeTextBlob: fieldType === TEXT_BLOB,
    fieldTypeBlob: fieldType === BLOB,
    fieldTypeBytes: fieldType === BYTES,
    fieldTypeByteBuffer: fieldType === BYTE_BUFFER,
    fieldTypeNumeric:
      fieldType === INTEGER || fieldType === LONG || fieldType === FLOAT || fieldType === DOUBLE || fieldType === BIG_DECIMAL,
    fieldTypeBinary: fieldType === BYTES || fieldType === BYTE_BUFFER,
    fieldTypeTimed: fieldType === ZONED_DATE_TIME || fieldType === INSTANT,
    fieldTypeCharSequence: fieldType === STRING || fieldType === UUID,
    fieldTypeTemporal: fieldType === ZONED_DATE_TIME || fieldType === INSTANT || fieldType === LOCAL_DATE,
    fieldValidationRequired: validationRules.includes(REQUIRED),
    fieldValidationMin: validationRules.includes(MIN),
    fieldValidationMinLength: validationRules.includes(MINLENGTH),
    fieldValidationMax: validationRules.includes(MAX),
    fieldValidationMaxLength: validationRules.includes(MAXLENGTH),
    fieldValidationPattern: validationRules.includes(PATTERN),
    fieldValidationUnique: validationRules.includes(UNIQUE),
    fieldValidationMinBytes: validationRules.includes(MINBYTES),
    fieldValidationMaxBytes: validationRules.includes(MAXBYTES),
  });
}

function prepareFieldForTemplates(entityWithConfig, field, generator) {
  _.defaults(field, {
    propertyName: field.fieldName,
    fieldNameCapitalized: _.upperFirst(field.fieldName),
    fieldNameUnderscored: _.snakeCase(field.fieldName),
    fieldNameHumanized: _.startCase(field.fieldName),
    fieldTranslationKey: `${entityWithConfig.i18nKeyPrefix}.${field.fieldName}`,
    tsType: generator.getTypescriptKeyType(field.fieldType),
    entity: entityWithConfig,
  });
  const fieldType = field.fieldType;
  if (field.mapstructExpression) {
    assert.equal(
      entityWithConfig.dto,
      MAPSTRUCT,
      `@MapstructExpression requires an Entity with mapstruct dto [${entityWithConfig.name}.${field.fieldName}].`
    );
    // Remove from Entity.java and liquibase.
    field.transient = true;
    // Disable update form.
    field.readonly = true;
  }

  if (field.id) {
    if (field.autoGenerate === undefined) {
      field.autoGenerate = !entityWithConfig.primaryKey.composite && [LONG, UUID].includes(field.fieldType);
    }

    if (!field.autoGenerate) {
      field.liquibaseAutoIncrement = false;
      field.jpaGeneratedValue = false;
      field.autoGenerateByService = false;
      field.autoGenerateByRepository = false;
      field.requiresPersistableImplementation = true;
    } else if (entityWithConfig.databaseType !== SQL) {
      field.liquibaseAutoIncrement = false;
      field.jpaGeneratedValue = false;
      field.autoGenerateByService = field.fieldType === UUID;
      field.autoGenerateByRepository = !field.autoGenerateByService;
      field.requiresPersistableImplementation = false;
      field.readonly = true;
    } else if (entityWithConfig.reactive) {
      field.liquibaseAutoIncrement = field.fieldType === LONG;
      field.jpaGeneratedValue = false;
      field.autoGenerateByService = !field.liquibaseAutoIncrement;
      field.autoGenerateByRepository = !field.autoGenerateByService;
      field.requiresPersistableImplementation = !field.liquibaseAutoIncrement;
      field.readonly = true;
    } else {
      const defaultGenerationType = entityWithConfig.prodDatabaseType === MYSQL ? 'identity' : 'sequence';
      field.jpaGeneratedValue = field.jpaGeneratedValue || field.fieldType === LONG ? defaultGenerationType : true;
      field.autoGenerateByService = false;
      field.autoGenerateByRepository = true;
      field.requiresPersistableImplementation = false;
      field.readonly = true;
      if (field.jpaGeneratedValue === 'identity') {
        field.liquibaseAutoIncrement = true;
      }
    }
  }

  field.fieldIsEnum = !field.id && fieldIsEnum(fieldType);
  field.fieldWithContentType = (fieldType === BYTES || fieldType === BYTE_BUFFER) && field.fieldTypeBlobContent !== TEXT;
  if (field.fieldWithContentType) {
    field.contentTypeFieldName = `${field.fieldName}ContentType`;
  }

  if (entityWithConfig.prodDatabaseType) {
    // TODO move to server generator.
    prepareServerFieldForTemplates(entityWithConfig, field, generator);
  }

  prepareClientFieldForTemplates(entityWithConfig, field, generator);

  if (field.fieldIsEnum) {
    field.enumValues = getEnumValuesWithCustomValues(field.fieldValues);
  }

  field.fieldValidate = Array.isArray(field.fieldValidateRules) && field.fieldValidateRules.length >= 1;
  field.nullable = !(field.fieldValidate === true && field.fieldValidateRules.includes(REQUIRED));
  field.unique = field.fieldValidate === true && field.fieldValidateRules.includes(UNIQUE);
  if (field.unique) {
    field.uniqueConstraintName = generator.getUXConstraintName(
      entityWithConfig.entityTableName,
      field.columnName,
      entityWithConfig.prodDatabaseType
    );
  }
  if (field.fieldValidate === true && field.fieldValidateRules.includes(MAXLENGTH)) {
    field.maxlength = field.fieldValidateRulesMaxlength || 255;
  }

  const faker = entityWithConfig.faker;
  field.createRandexp = () => {
    // check if regex is valid. If not, issue warning and we skip fake data generation.
    try {
      // eslint-disable-next-line no-new
      new RegExp(field.fieldValidateRulesPattern);
    } catch (e) {
      generator.warning(`${field.fieldName} pattern is not valid: ${field.fieldValidateRulesPattern}. Skipping generating fake data. `);
      return undefined;
    }
    return faker.createRandexp(field.fieldValidateRulesPattern);
  };

  field.uniqueValue = [];

  field.generateFakeData = (type = 'csv') => {
    let data = generateFakeDataForField(field, faker, entityWithConfig.changelogDateForRecent, type);
    // manage uniqueness
    if (field.fieldValidate === true && field.fieldValidateRules.includes(UNIQUE)) {
      let i = 0;
      while (field.uniqueValue.indexOf(data) !== -1) {
        if (i++ === 5) {
          data = undefined;
          break;
        }
        data = generateFakeDataForField(field, faker, entityWithConfig.changelogDateForRecent, type);
      }
      if (data !== undefined) {
        field.uniqueValue.push(data);
      }
    }
    if (data === undefined) {
      generator.warning(`Error generating fake data for field ${field.fieldName}`);
    }
    return data;
  };
  field.path = [field.fieldName];
  field.relationshipsPath = [];
  field.reference = fieldToReference(entityWithConfig, field);
  _derivedProperties(field);
  return field;
}

function fieldIsEnum(fieldType) {
  return ![
    STRING,
    INTEGER,
    LONG,
    FLOAT,
    DOUBLE,
    BIG_DECIMAL,
    LOCAL_DATE,
    INSTANT,
    ZONED_DATE_TIME,
    DURATION,
    UUID,
    BOOLEAN,
    BYTES,
    BYTE_BUFFER,
  ].includes(fieldType);
}

/**
 * From an enum's values (with or without custom values), returns the enum's values without custom values.
 * @param {String} enumValues - an enum's values.
 * @return {Array<String>} the formatted enum's values.
 */
function getEnumValuesWithCustomValues(enumValues) {
  if (!enumValues || enumValues === '') {
    throw new Error('Enumeration values must be passed to get the formatted values.');
  }
  return enumValues.split(',').map(enumValue => {
    if (!enumValue.includes('(')) {
      return { name: enumValue.trim(), value: enumValue.trim() };
    }
    const matched = /\s*(.+?)\s*\((.+?)\)/.exec(enumValue);
    return {
      name: matched[1],
      value: matched[2],
    };
  });
}

function prepareClientFieldForTemplates(entityWithConfig, field, generator) {
  if (field.fieldValidateRulesPatternAngular === undefined) {
    field.fieldValidateRulesPatternAngular = field.fieldValidateRulesPattern
      ? field.fieldValidateRulesPattern.replace(/"/g, '&#34;')
      : field.fieldValidateRulesPattern;
  }

  if (field.fieldValidateRulesPatternReact === undefined) {
    field.fieldValidateRulesPatternReact = field.fieldValidateRulesPattern
      ? field.fieldValidateRulesPattern.replace(/'/g, "\\'")
      : field.fieldValidateRulesPattern;
  }
}

function prepareServerFieldForTemplates(entityWithConfig, field, generator) {
  if (field.fieldNameAsDatabaseColumn === undefined) {
    const fieldNameUnderscored = _.snakeCase(field.fieldName);
    const jhiFieldNamePrefix = generator.getColumnName(entityWithConfig.jhiPrefix);

    if (isReservedTableName(fieldNameUnderscored, entityWithConfig.prodDatabaseType)) {
      if (!jhiFieldNamePrefix) {
        generator.warning(
          `The field name '${fieldNameUnderscored}' is regarded as a reserved keyword, but you have defined an empty jhiPrefix. This might lead to a non-working application.`
        );
        field.fieldNameAsDatabaseColumn = fieldNameUnderscored;
      } else {
        field.fieldNameAsDatabaseColumn = `${jhiFieldNamePrefix}_${fieldNameUnderscored}`;
      }
    } else {
      field.fieldNameAsDatabaseColumn = fieldNameUnderscored;
    }
  }
  field.columnName = field.fieldNameAsDatabaseColumn;

  if (field.fieldInJavaBeanMethod === undefined) {
    // Handle the specific case when the second letter is capitalized
    // See http://stackoverflow.com/questions/2948083/naming-convention-for-getters-setters-in-java
    if (field.fieldName.length > 1) {
      const firstLetter = field.fieldName.charAt(0);
      const secondLetter = field.fieldName.charAt(1);
      if (firstLetter === firstLetter.toLowerCase() && secondLetter === secondLetter.toUpperCase()) {
        field.fieldInJavaBeanMethod = firstLetter.toLowerCase() + field.fieldName.slice(1);
      } else {
        field.fieldInJavaBeanMethod = _.upperFirst(field.fieldName);
      }
    } else {
      field.fieldInJavaBeanMethod = _.upperFirst(field.fieldName);
    }
  }

  if (field.fieldValidateRulesPatternJava === undefined) {
    field.fieldValidateRulesPatternJava = field.fieldValidateRulesPattern
      ? field.fieldValidateRulesPattern.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
      : field.fieldValidateRulesPattern;
  }
}

function fieldToReference(entity, field, pathPrefix = []) {
  return {
    id: field.id,
    entity,
    field,
    multiple: false,
    owned: true,
    doc: field.javadoc,
    label: field.fieldNameHumanized,
    name: field.fieldName,
    type: field.fieldType,
    nameCapitalized: field.fieldNameCapitalized,
    path: [...pathPrefix, field.fieldName],
  };
}

module.exports = { prepareFieldForTemplates, fieldIsEnum, getEnumValuesWithCustomValues, fieldToReference };
