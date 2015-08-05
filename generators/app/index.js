
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

  initializing: function () {
    // happens after yeoman logo
  },

  askFor: function () {
    var done = this.async();

    var prompts = [{
      type: 'list',
      name: 'type',
      message: 'What type of application do you want to create?',
      choices: [{
        name: 'Node/Express application (JavaScript)',
        value: 'expressJS'
      },
        {
          name: 'ASP.NET ' + chalk.bold('v5') +' Application',
          value: 'aspnet'
        }
      ]
    }];

    this.prompt(prompts, function (props) {
      this.type = props.type;
      done();
    }.bind(this));
  },

  askForName: function () {
    var done = this.async();
    var app = '';

    switch (this.type) {
      case 'expressJS':
        app = 'expressApp';
        var prompts = [{
          name: 'applicationName',
          message: 'What\'s the name of your application?',
          default: app
        }];

        this.prompt(prompts, function (props) {
          this.templatedata.namespace = props.applicationName;
          this.templatedata.applicationname = props.applicationName;
          this.applicationName = props.applicationName;
          done();
        }.bind(this));
        break;

      case 'aspnet':
        this.composeWith('aspnet', { options: {} })
        done();
        break;
    }
  },

  writing: function () {
    this.sourceRoot(path.join(__dirname, './templates/projects'));

    switch (this.type) {
      case 'expressJS':
        this._writingExpressJS();
        break;
      case 'aspnet':
        //aspnet generator will do its own writing
        break;
      default:
        //unknown project type
        break;
    }
  },

  _writingExpressJS: function () {
    var context = {
      appName: this.applicationName
    };

    this.sourceRoot(path.join(__dirname, '../templates/projects/' + this.type));

    this.template(this.sourceRoot() + '/_package.json', this.applicationName + '/package.json', context);

    this.copy(this.sourceRoot() + '/app.js', this.applicationName + '/app.js');
    this.copy(this.sourceRoot() + '/README.md', this.applicationName + '/README.md');
    this.copy(this.sourceRoot() + '/vscodequickstart.md', this.applicationName + '/gettingstarted.md');
    this.copy(this.sourceRoot() + '/gulpfile.js', this.applicationName + '/gulpfile.js');
    this.copy(this.sourceRoot() + '/jsconfig.json', this.applicationName + '/jsconfig.json');
    this.copy(this.sourceRoot() + '/_gitignore', this.applicationName + '/.gitignore');

    this.directory(this.sourceRoot() + '/.settings', this.applicationName + '/.settings');
    this.directory(this.sourceRoot() + '/bin', this.applicationName + '/bin');
    this.directory(this.sourceRoot() + '/images', this.applicationName + '/images');
    this.directory(this.sourceRoot() + '/public', this.applicationName + '/public');
    this.directory(this.sourceRoot() + '/routes', this.applicationName + '/routes');
    this.directory(this.sourceRoot() + '/tests', this.applicationName + '/tests');
    this.directory(this.sourceRoot() + '/typings', this.applicationName + '/typings');
    this.directory(this.sourceRoot() + '/views', this.applicationName + '/views');
  },

  install: function () {
    switch (this.type) {

      case 'expressJS':
        if (this.noNpmInstall) {
          return;
        } else {
          process.chdir(this.applicationName);
          this.installDependencies({
            bower: false,
            npm: true
          });
        }

        break;

      case 'aspnet':
        // aspnet wil do its own installation
        break;

      default:
        break;
    }
  },

  end: function () {

    switch (this.type) {

      case 'expressJS':
        this.log('\r\n');
        this.log('Your project is now created! To start Visual Studio Code, use the following commands:');
        this.log(chalk.bold('cd ' + this.applicationName));
        this.log(chalk.bold('code .'));
        this.log('\r\n');
        this.log('For more information, please visit http://code.visualstudio.com and follow us on twitter @code.');

        break;

      case 'aspnet':
        // aspnet wil handle its end
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