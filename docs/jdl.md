# JDL
## Using files

You can use JDL files to generate entities:
-   Create a file with the extension ‘.jh’ or ‘.jdl’,
-   Declare your entities and relationships or create and download the file with  [JDL-Studio](https://start.jhipster.tech/jdl-studio/) 
- Then run  `pyhipster jdl my_file.jdl`  in your JHipster application’s root folder.

and  _Voilà_, you are done!

If you work in a team, perhaps you would like to have multiple files instead of one. We added this option so that you don’t manually concatenate all the files into one, you have to run:

```
pyhipster jdl my_file1.jdl my_file2.jdl
```
## Datatypes
The following data types are available in JDL

 - String 
 - Integer 
 - Long	 
 - BigDecimal 
 - Float	 
 - Double	 
 - Enum	 
 - Boolean	
 - LocalDate 
 - ZonedDateTime 
 - Instant 
 - Duration 
 - UUID	 
 - Blob	 
 - AnyBlob	
 - ImageBlob 
 - TextBlob

## Entity Definition
The entity declaration is done as follows:

```
entity <entity name> {
  <field name> <field type> <validation>
}
```
-   `<entity name>`  the name of the entity,
-   `<field name>`  the name of one field of the entity,
-   `<field type>`  the JHipster supported type of the field,
-   `<validation>`  the validations for the field.

### Basic example

```jdl
entity A
```
This is equivalent to:
```jdl
entity A(a) {}
```
The former the simpler form, without specifying a “body” (braces for fields) and a table name.   

----------
### With fields

```jdl
entity A {
  name String
  age Integer
}
```
----------
### With field validations
```jdl
entity A {
  name String required
  age Integer
}
```
----------

### Blob declaration

JHipster gives a great choice as one can choose between an image type or any binary type. JDL lets you do the same. Create a custom type (see DataType) with the editor, name it according to these conventions:

-   `AnyBlob`  or  `Blob`  to create a field of the “any” binary type;
-   `ImageBlob`  to create a field meant to be an image.
-   `TextBlob`  to create a field for a CLOB (long text).

And you can create as many DataTypes as you like.

## Enumerations

Enumerations are types with fixed values:
```jdl
enum Type {
  A,
  B(b)
}
entity E {
  name Type
}
```

Notice how enumeration’s values are optional.
They only have one validation:  `required`.

### Basic example
```jdl
enum Country {
  BELGIUM,
  FRANCE,
  ITALY
}
```
And its use:

```jdl
enum Country {}
entity A {
  country Country
}
```

## Relationships

Relationships between entities are also available and are declared with the  `relationship`  keyword.

```jdl
entity A
entity B

relationship OneToOne {
  A{a} to B{b}
}

```
Here’s what we can see:
-   `OneToOne`  is the relationship type
-   we declare the source and the destination of the relationship (from  `A`  to  `B`)
-   we also declare the injected fields in each entity (`a`  in  `B`, and  `b`  in  `A`)

There are four relationship types:

-   `OneToOne`
-   `OneToMany`
-   `ManyToOne`
-   `ManyToMany`

### Multiple relationship bodies

If you’re tired of having  _n_  relationships of the same type in your JDL file, don’t worry! There’s a solution.

Take this JDL sample for instance:

```jdl
relationship OneToOne {
  A to B
}
relationship OneToOne {
  B to C
}
relationship OneToOne {
  C to D
}
relationship OneToOne {
  D to A
}

```

The solution consists in having every relationship body inside on relationship declaration, like this:

```jdl
relationship OneToOne {
  A to B,
  B to C,
  C to D,
  D to A
}

```

This syntax is really useful when:

-   You have lots of relationships of the same type,
-   You want to know what the relationships are,
-   You don’t want to waste time looking for them in your JDL file(s)

----------

### Syntax

Relationship declaration is done as follows:

```
relationship (OneToMany | ManyToOne | OneToOne | ManyToMany) {
  <from entity>[{<relationship name>[(<display field>)]}] to <to entity>[{<relationship name>[(<display field>)]}]
}
```

-   `(OneToMany | ManyToOne| OneToOne | ManyToMany)`  is the type of your relationship,
-   `<from entity>`  is the name of the entity owner of the relationship: the source,
-   `<to entity>`  is the name of the entity where the relationship goes to: the destination,
-   `<relationship name>`  is the name of the field having the other end as type,
-   `<display field>`  is the name of the field that should show up in select boxes (default:  `id`),
----------

### Examples

#### Basic example
```jdl
relationship OneToOne {
  A to B
}
```

Note that this example is the same as:

```jdl
relationship OneToOne {
  A{b} to B{a}
}
```

Not specifying an injected field is the short form of having a bidirectional relationship.

Another example:

```jdl
relationship OneToOne {
  A{b} to B
}

```

This will generate a unidirectional relationship. You can only find entity B through entity A, but you cannot find entity A through entity B.

----------

#### With injected fields

```jdl
relationship ManyToMany {
  A{b} to B{a}
}

```

This is a bidirectional relationship, meaning that both entities will be generated with an “instance” of the other entity.

### Commenting 
#### Commenting Entities
Commenting is possible in the JDL for entities and fields, and will generate documentation (Javadoc or JSDoc, depending on the backend).

```jdl
/**
 * This is a comment
 * about a class
 * @author Someone
 */
entity A {
  /**
   * This comment will also be used!
   * @type...
   */
   name String
   age Integer // this is yet another comment
}
```

The JDL possesses its own kind of comment:

-   ``//`` an ignored comment

Therefore, anything that starts with  `//`  is considered an comment for JDL. Please note that the JDL Studio directives that start with  `#`  will be ignored during parsing.

Please note, commas are not mandatory but it’s wiser to have them so as not to make mistakes in the code.  

#### Commenting

Adding comments for relationships is possible:

```jdl
relationship OneToOne {
  /** This comment will be put before b in entity A*/
  A{b}
  to
  /** This comment will be put before a in entity B*/
  B{a}
}
```

The same commenting rules as entities are applied here.