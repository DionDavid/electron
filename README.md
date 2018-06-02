[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/dwyl/esta/issues) [![Known Vulnerabilities](https://snyk.io/test/github/DionDavid/electron/badge.svg?targetFile=ElectronClient/app/package.json)](https://snyk.io/test/github/DionDavid/electron) [![Maintainability](https://api.codeclimate.com/v1/badges/482ffb25e5b4c5bc17f8/maintainability)](https://codeclimate.com/github/DionDavid/electron/maintainability) [![dependencies Status](https://david-dm.org/DionDavid/electron/status.svg?path=ElectronClient/app)](https://david-dm.org/DionDavid/electron?path=ElectronClient/app) 

All the badges are tested against app inside the ElectronClient

# Electron Client for Servoy

This client is made for the possibility of using the NG-Client with access to the local functionalities of the operating system.

<a href="url"><img src="https://raw.githubusercontent.com/wiki/DionDavid/electron/images/home.jpg" height="400" width="650" ></a>

# Setup

The setup for further development of the Servoy Electron Client

## Prerequisites

Make sure you have Node.js, Python 2.x, installed on your system. Windows users will also require Visual Studio

[Python](https://www.python.org/downloads/) 

[Node.js](https://nodejs.org/en/) >= 7

[Visual Studio](https://www.visualstudio.com/vs/)

#### For further development of Microsoft Office integration

Please send an email to [dhaneveld@servoy.com](mailto:dhaneveld@servoy.com) to get the .NET project and information on how you can further improve it.

## Usage

#### Packaging the executable

The process of creating an executable is done with [Apache Ant](https://ant.apache.org/manual/install.html). For MacOS I recommend installing Apache Ant with [Homebrew](https://brew.sh/index_nl).

This project consists of an build.xml file where you can edit the settings of creating an executable. To execute the process, run the following command in your command prompt or terminal: 

```console
ant run.electron
```
#### Changing app icon

If you wish to change the icon for your local development installation you have to do the following:

1. Navigate to electron/ElectronClient/app/resources/icons/ | add your icon here.
2. Navigate to electron/ElectronClient/app/config/servoy.json | replace with the name of your icon















