# ionic-react-seed

Ionic React seed project.

## Prerequisites

### install ionic

`npm install -g @ionic/cli`

### install Amplify CLI

`npm install -g @aws-amplify/cli`

#### Configure General Amplify

`amplify configure`

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
