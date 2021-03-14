# ionic-react-seed

Ionic React seed project.

## Prerequisites

### Clone this repository

`clone https://github.com/mtsukuda/ionic-react-seed.git`

### Install ionic

`npm install -g @ionic/cli`

### Install Amplify CLI

`npm install -g @aws-amplify/cli`

#### Run npm install

`npm install`

#### Configure General Amplify

`amplify configure`

- make configure with ci and web browser.

## User Component / User Page JSON Configration

  * name `user component name | user page name`
  * import
    * name
    * from
    * type `default | package`
    * props []
  * lifeCycleMethods
  * fetch []
    * format `get | post`
    * name `fetch method name`
    * codeFirst `insert code`
    * codeLast `insert code`
    * apis []
        * args [] `fetch method arguments`
        * api `uri of api`
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
