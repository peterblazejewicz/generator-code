
'use strict';
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var path = require('path');

var VSCodeGenerator = yeoman.generators.Base.extend({

  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);
  },

  init: function () {
    this.log(yosay('Welcome to the Visual Studio Code generator!'));
    this.templatedata = {};
  },

  genType: function () {
    var done = this.async();

    var prompts = [{
      type: 'list',
      name: 'genType',
      message: 'What would you like to do?',
      choices: [
        {
          name: 'Get started with a sample application',
          value: 'sample'
        }
      ]
    }];

    this.prompt(prompts, function (props) {
      this.genType = props.genType;
      done();
    }.bind(this));

  },

  sampleType: function () {
    var done = this.async();

    if (this.genType === 'sample') {

      var prompts = [{
        name: 'sampleType',
        message: 'What type of application would you like?',
        default: 'express',
        type: 'list',
        choices: ['express']
      }];

      this.prompt(prompts, function (props) {
        this.sampleType = props.sampleType;
        done();
      }.bind(this));
    } else {
      done();
    }

  },

  configSample: function () {
    var done = this.async();
    var app = 'expressApp';


    if (this.sampleType === 'express') {


      var prompts = [
        {
          name: 'applicationName',
          message: 'What\'s the name of your application?',
          default: app
        },
        {
          name: 'languageType',
          message: 'What language do you prefer (we like TypeScript!)?',
          type: 'list',
          default: 'TypeScript',
          choices: ['TypeScript', 'JavaScript']
        },
        {
          name: 'gitInit',
          type: 'confirm',
          message: 'Initialize a git repository?',
          default: true
        }];

      this.prompt(prompts, function (props) {
        this.languageType = props.languageType;
        switch (this.languageType) {
          case 'TypeScript':
            this.type = 'expressTS';
            break;
          case 'JavaScript':
            this.type = 'expressJS';
            break;
          default:
            this.type = 'expressJS';
            break;
        }
        this.templatedata.namespace = props.applicationName;
        this.templatedata.applicationname = props.applicationName;
        this.applicationName = props.applicationName;
        this.gitInit = props.gitInit;
        done();
      }.bind(this));

    } else {
      done();
    }
  },

  generate: function () {
    var done = this.async();

    this.sourceRoot(path.join(__dirname, './templates/projects'));
    this._writingExpress();
    done();

  },

  _writingExpress: function () {

    var context = {
      appName: this.applicationName
    };

    //copy files and folders that are common to both JS and TS 
    this.sourceRoot(path.join(__dirname, '../templates/projects/expressCommon'));
        
    // now copy app specific files and folders
    switch (this.type) {
      case 'expressJS':
        this.sourceRoot(path.join(__dirname, '../templates/projects/' + this.type));

        this.directory(this.sourceRoot() + '/.vscode', this.applicationName + '/.vscode');
        this.template(this.sourceRoot() + '/bin/www', this.applicationName + '/bin/www', context);
        this.directory(this.sourceRoot() + '/public', this.applicationName + '/public');
        this.directory(this.sourceRoot() + '/routes', this.applicationName + '/routes');
        this.directory(this.sourceRoot() + '/styles', this.applicationName + '/styles');
        this.directory(this.sourceRoot() + '/tests', this.applicationName + '/tests');
        this.directory(this.sourceRoot() + '/typings', this.applicationName + '/typings');
        this.directory(this.sourceRoot() + '/views', this.applicationName + '/views');
        this.copy(this.sourceRoot() + '/_gitignore', this.applicationName + '/.gitignore');
        this.template(this.sourceRoot() + '/_package.json', this.applicationName + '/package.json', context);
        this.copy(this.sourceRoot() + '/app.js', this.applicationName + '/app.js');
        this.copy(this.sourceRoot() + '/gulpfile.js', this.applicationName + '/gulpfile.js');
        this.copy(this.sourceRoot() + '/jsconfig.json', this.applicationName + '/jsconfig.json');
        this.template(this.sourceRoot() + '/README.md', this.applicationName + '/README.md', context);
        this.copy(this.sourceRoot() + '/tsd.json', this.applicationName + '/tsd.json');
        this.copy(this.sourceRoot() + '/vscodequickstart.md', this.applicationName + '/vscodequickstart.md');

        break;

      case 'expressTS':

        this.sourceRoot(path.join(__dirname, '../templates/projects/' + this.type));

        this.directory(this.sourceRoot() + '/.vscode', this.applicationName + '/.vscode');
        this.directory(this.sourceRoot() + '/src', this.applicationName + '/src');
        this.template(this.sourceRoot() + '/src/www.ts', this.applicationName + '/src/www.ts', context);
        this.template(this.sourceRoot() + '/src/www.js', this.applicationName + '/src/www.js', context);
        this.directory(this.sourceRoot() + '/tests', this.applicationName + '/tests');
        this.directory(this.sourceRoot() + '/typings', this.applicationName + '/typings');
        this.copy(this.sourceRoot() + '/_gitignore', this.applicationName + '/.gitignore');
        this.template(this.sourceRoot() + '/_package.json', this.applicationName + '/package.json', context);
        this.copy(this.sourceRoot() + '/gulpfile.js', this.applicationName + '/gulpfile.js');
        this.template(this.sourceRoot() + '/README.md', this.applicationName + '/README.md', context);
        this.copy(this.sourceRoot() + '/tsd.json', this.applicationName + '/tsd.json');
        this.copy(this.sourceRoot() + '/vscodequickstart.md', this.applicationName + '/vscodequickstart.md');

        break;

      default:
        // unknown why we are here, get out!
        return;
    }
    
    // NOTE: this.sourceRoot is set in the switch statement above
    // copy common file and folder names that have different content

  },

  install: function () {
    var done = this.async();

    switch (this.type) {

      case 'expressJS':
      // fall through
      
      case 'expressTS':

        if (this.noNpmInstall) {
          break;
        }

        process.chdir(this.applicationName);

        this.installDependencies({
          bower: false,
          npm: true
        });

        if (this.gitInit) {
          this.spawnCommand('git', ['init', '--quiet']);
        }

        done();

        break;

      default:
        break;
    }
  },


  end: function () {

    switch (this.type) {

      case 'expressJS':
      // fall through
      case 'expressTS':
        this.log('\r\n');
        this.log('Your project ' + chalk.bold(this.applicationName) + ' has been created! Next steps:');
        this.log('');
        this.log('We recommended installing the TypeScript Definition File Manager (http://definitelytyped.org/tsd/) globally using the following command. This will let you easily download additional definition files to any folder.');
        this.log('');
        this.log(chalk.bold('     npm install tsd -g'));
        this.log('');
        this.log('To start editing with Visual Studio Code, use the following commands.');
        this.log('');
        this.log(chalk.bold('     cd ' + this.applicationName));
        this.log(chalk.bold('     code .'));
        this.log(' ');
        this.log('For more information, visit http://code.visualstudio.com and follow us @code.');
        this.log('\r\n');

        break;


      default:
        break;
    }

    if (this.notice) {
      this.log(chalk.red(this.notice));
    }
  }
});

module.exports = VSCodeGenerator;