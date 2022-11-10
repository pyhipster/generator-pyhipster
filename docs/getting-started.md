## Requirements
The minimum requirements that need to be installed before we get started are 

 - Python 3.7.9  
 - Java 11.0.12  
 - NodeJS 16.16.0 LTS  
 - NPM 8.11.0  
 - Git 2.33  

After this installation, you will need to add the programs to your PATH. Please refer to the guide for 
[Linux](https://linuxize.com/post/how-to-add-directory-to-path-in-linux/) or [Windows](https://www.computerhope.com/issues/ch000549.htm)
### Validating the install
Open your terminal (Linux) or Command Prompt (Windows) and run the following commands to validate your installation.

#### On Windows
``$> python --version``   
``$> git --version``   
``$> node --version``   
``$> java --version``   
``$> npm --version``   

#### On Linux
``$> python3 --version``   
``$> git --version``   
``$> node --version``   
``$> java --version``   
``$> npm --version``   

## Installing PyHipster
To install the generator run the following command

``npm install -g generator-pyhipster``

## Creating Your First PyHipster Full-Stack Application

Go to any folder and create the project folder

``$> cd my-dir``   
``$> mkdir my-project``   
``$> cd my-project``   
``$> pyhipster``   

This will start the generator and will ask you a couple of questions to generate the application

![Application Generation](images/application-generation.png)

Please see below for an explanation of each of these questions.

```
? Which *type* of application would you like to create? Monolithic application (recommended for simple projects)
```
*Explanation* - Currently only monoliths are supported. So you just have this one choice.    
```
? What is the base name of your application? pyhipster
```
*Explanation* - Provide a name for your project
```
? Which *type* of authentication would you like to use? JWT authentication (stateless, with a token)
```
*Explanation* - Currently only JWT is supported. 
```
? Which *type* of database would you like to use? SQL (SQLite)
```
*Explanation* - SQLite is the only supported database for this release
```
? Which *development* database would you like to use? SQLite with disk-based persistence
```
*Explanation* - You have two options here, wither use a desk-persisted SQLite file or an in-memory SQLite instance
```
? Which *Framework* would you like to use for the client? React
```
*Explanation* - You are given a choice to select either Angular, React, or Vue for your frontend
```
? Do you want to generate the admin UI? Yes
```
*Explanation* - Choose "Yes" if you want to enable user management
```
? Would you like to use a Bootswatch theme (https://bootswatch.com/)? Default JHipster
```
*Explanation* - This will enable UI themes from Bootswatch. Please here to [Bootswatch](https://bootswatch.com/) for more details of available themes
```
? Would you like to enable internationalization support? Yes
```
*Explanation* - Choose this option to enable i18n
```
? Please choose the native language of the application. English
```
*Explanation* - Select the base language of the generated code.
```
? Please choose additional languages to install
```
*Explanation* select all the languages that you would like to support.
```
? Besides unittest and Jest, which testing frameworks would you like to use?
```
*Explanation* - Tests are not covered under the current release.

----   

After selecting the options, PyHipster will work to generate the Python and UI code based on your selections.

Once the application is generated, the tool will automatically install all the necessary Node modules. 

![Installing Node Modules](images/node-modules-installed.png)

We will need 2 terminal/command prompts for running the frontend and backend components simultaneously.

#### Terminal 1 (Backend)
``$> pvnw `` (Windows)   
``$> ./pvnw`` (Linux/Mac)

Once the application is running, we will see the following messages on the terminal   

![Flask Server Started](images/flask-server-started.png)

#### Terminal 2 (Frontend)
``$> npm start ``   

Once the application is running, you will see the following messages.

![Flask Server Started](images/node-server-started.png)

PyHipster will open your default web browser and point to http://locahost:9000

![Frontend Running](images/running-application-ui.png)

Follow the onscreen instructions and login as "admin" or "user" and explore around. 

## Data Model Definition

The JDL is a JHipster-specific domain language where you can describe all your applications, deployments, entities and their relationships in a single file (or more than one) with a user-friendly syntax.
PyHipster reuses JDL for data model definition as well.

Please find more information abuout JDL [here](jdl.md)

## Customizations

### EMail
To configure your own email to work with the generated application, please go to the file ``src/main/python/config/BaseConfig.py`` and edit the following lines to the appropriate values
```python
# Mail Configurations  
MAIL_SERVER = 'smtp.gmail.com'  
MAIL_PORT = 587  
MAIL_USE_TLS = True  
MAIL_USE_SSL = False  
MAIL_USERNAME = 'my-email-id@gmail.com'  
MAIL_PASSWORD = 'my-email-password'
```
**Please note**: If you use the above configuration with your Gmail password, you might need to  [allow less secure apps](https://support.google.com/accounts/answer/6010255?hl=en). The configuration is simpler but less secure. Also by allowing less secure apps you won’t have the ability to use two factor authentication with Gmail. Therefore we highly recommend you use an app password instead of the Gmail password. Please refer to the Gmail configuration document at [Sign in with App Passwords](https://support.google.com/accounts/answer/185833) for more information on how to set this up.

## Tools
- [JHipster Studio](https://www.jhipster.tech/jdl-studio/) for writing JDL files
- [JWT token validator](https://www.jstoolset.com/jwt) for testing JWT tokens   
- [BCrypt Tester](https://bcrypt.online/) for testing password generation and validation   
