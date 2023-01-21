# PyHipster

![pyhipster-logo](docs/images/logo-pyhipster_100.png "PyHipster Logo")

Greetings, Python Hipsters!

PyHipster is a full-stack Python Flask web application generator. 

> PyHipster is an adaptation of JHipster for Python. A big thanks to [Julien Dubois](https://www.julien-dubois.com/) and the entire [JHipster](https://www.jhipster.tech/) team for this wonderful tool. The current version of PyHipster is forked from JHipster 7.8.1.

The current version of the tool is available as an alpha release and not suitable for production deployment.

## Features
- Python 3 Flask backend
- Angular/React/Vue frontend
- JWT, HTTP Session Support
- SQL Database Support (MySQL, MariaDB, PostgreSQL, SQL Server, Oracle, CockroachDB, SQLite)
- CRUD operations for user defined data model
- Caching
- Multilingual *(in progress)*   
- Email integration
- User Management
- Swagger Documentation

## Technology Stack
### Frontend
Single Web page application:  
- Angular or React or Vue  
- Responsive Web Design with Twitter Bootstrap  
- HTML5 Boilerplate  
- Compatible with modern browsers (Chrome, FireFox, Microsoft Edge)    
- Full internationalization support *(in progress)*   
- Optional Sass support for CSS design  

With the great development workflow:
- Installation of new JavaScript libraries with NPM  
- Build, optimization and live reload with Webpack  

### Backend
- Micro web-development framework [Flask 2.2](https://flask.palletsprojects.com/en/2.2.x/)   
- REST API support using [flask-restx](https://flask-restx.readthedocs.io/en/latest/) with Swagger Documentation
- Database integration using [Flask-SQLAlchemy 3](https://flask-sqlalchemy.palletsprojects.com/en/3.0.x/)    
- Server side caching using [Flask-Caching](https://flask-caching.readthedocs.io/en/latest/)
- (De-)Serialization support through [Marshmallow](https://marshmallow.readthedocs.io/en/stable/index.html), [Flask-Marshmallow](https://flask-marshmallow.readthedocs.io/en/latest/), and  [marshmallow-sqlalchemy](https://marshmallow-sqlalchemy.readthedocs.io/en/latest/index.html)    
- JWT authentication [Flask-JWT-Extended](https://flask-jwt-extended.readthedocs.io/en/stable/), HTTP Session Authentication [Flask-Login](https://flask-login.readthedocs.io/en/latest/)    
- Email support using [Flask-Mail](https://pythonhosted.org/Flask-Mail/) 

## Limitations
For the current version the tool has certain limitations 
- No Test coverage for the Python code
- Only monolith support
- No support for Docker

For more information, please continue your journey with the [getting started guide](docs/getting-started.md)

