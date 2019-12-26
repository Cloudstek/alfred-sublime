# Alfred Sublime Workflow

Simple workflow that allows you to browse and open [Sublime](https://www.sublimetext.com) projects.

## Requirements

- NodeJS 8+
- [Sublime Text 3](https://www.sublimetext.com/)
- [ProjectManager package](https://packagecontrol.io/packages/ProjectManager)
- Alfred 4 with paid [Alfred Powerpack](https://www.alfredapp.com/powerpack)

## Installation

### NPM (preferred)

This workflow can be installed with NPM, as an added bonus you'll get a notification when an update is available!

```shell
npm install -g alfred-sublime
```

### Packal / GitHub

1. Download the latest `Sublime.alfredworkflow` from [Packal](http://www.packal.org/workflow/sublime) or [GitHub](https://github.com/Cloudstek/alfred-sublime/releases).
2. Double click `Sublime.alfredworkflow`.

## Usage

Simply type `subl` followed by space to list all projects. Optionally type a search string to filter results.

## Troubleshooting

> No projects are listed by the `subl` command

Please check that the directory `~/Library/Application Support/Sublime Text 3/Packages/User/Projects` exists and that it contains `.sublime-project` files.

Also check out the debug output, see the [Using the Workflow Debugger](https://www.alfredapp.com/help/workflows/advanced/debugger/) section of the Alfred documentation.
