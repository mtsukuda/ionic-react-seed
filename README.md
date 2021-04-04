# ionic-react-seed

Ionic React seed project.

## Requirement Cloud Account

- AWS (Cognito)
- Firebase

## Prerequisites

### Clone this repository

`git clone https://github.com/mtsukuda/ionic-react-seed.git <YourProjectName>`

### Install ionic

`npm install -g @ionic/cli`

### Install Amplify CLI

`npm install -g @aws-amplify/cli`

#### Enter the ionic-react-seed directory, and run npm install

`npm install`

#### Init Firebase Hosting

`firebase init`

- select `Hosting: Configure and deploy Firebase Hosting site`.
- select `Create a new project`.
- `? Please specify a unique project id` --> your project name.
- `? What would you like to call your project?` --> blank / your project name.
- skip all subsequent questions.

#### Overwrite Firebase JSON

`npm run firebase-json-overwrite`

#### Configure General Amplify

`amplify configure`

- make amplify configure with ci and web browser.

#### Init Amplify

`amplify init`

- aws-exports file will be created.

#### Run Npm Command to Create Sample Apps

`npm run create-sample`

#### Create Front API

`npm run create-front-api`

#### Then Build and Deploy Sample Apps!!

`npm run buildndeploy`

## User Component / User Page JSON Configration

  * name `user component name | user page name`
  * import
    * name
    * from
    * type `default | package`
    * props []
  * lifeCycleMethods
  * fetch []
    * method `get | post`
    * name `fetch method name`
    * codeFirst `insert code`
    * codeLast `insert code`
    * apis []
      * config `config of own api`
        * path `inner function name of own api`
        * properties [] `property for post body -> post format required`
          * key `key of property`
          * require `yes`
      * args [] `fetch method arguments`
      * uri `uri of api`
      * postTypeName `post format only: name of post type`
      * postType `post format only: type of post`
      * postBody [] `post format only: body of post data`
      * responseTypeName `name of response type`
      * responseType `type of response`
  * renderBeforeReturn []
  * defaultProps []
    * name
    * initial
  * tags []
    * tag
    * componentMethod
      * states []
        * name
        * initial
      * methods []
    * props []
    * noCR `yes`
    * content
    * contentAT
    * single `yes`
    * child [] 
