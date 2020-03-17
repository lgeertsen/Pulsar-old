# Pulsar

Pulsar is an open source VFX pipeline tool

## Installation tutorial

#### I - Project Preparation

Make sure that on you local computer you have the same directory arborescence as at school:
- For **assets**: `{project}/03_WORK_PIPE/01_ASSET_3D/{group}/{name}/{dimension}/scenes/{task}/{subtask}/{state}_{version}/{file}`
- For **shots**: `{project}/03_WORK_PIPE/02_SHOT/{dimension}/scenes/{group}/{name}/{task}/{subtask}/{state}_{version}/{file}`

To be able to open scenes from school you should have a drive called `I:`. If you don't have this you can easily fake one with a simple command.

First you should create a directory called `SynologyDrive` wherever you want. And inside that directory you put your project arborescence.

So you have the following:
`{path-to-synology}/SynologyDrive/{project}/...`

*An example*
`C:/Users/JeanJacques/Documents/SynologyDrive/ARAL/...`

When this is done you need to execute the following command in a terminal. (You can open a terminal by pressing the 'windows key' & typing 'cmd')

For this command make sure u put the path until the `SynologyDrive` directory, do not include it in the command.

```bat
subst I: {path-to-synology}

# example for the path example from above
subst I: C:/Users/JeanJacques/Documents
```

*The only inconvenience is that the virtual drive is destroyed when your computer reboots.*

If you want the mount the `I:` drive on start-up you have to put the command `subst I: {path-to-synology}` in a `.bat` file.

Then copy this bat file to the following directory:
```
C:\Users\{your-user}\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup
```

Great! When all that is done we can finally go and install Pulsar!

#### II - Download the latest version of Pulsar
You can find the latest version of Pulsar on the Github Release page:

[https://github.com/ArtFXDev/Pulsar/releases][GithubRelease]

Download the Pulsar.Setup.{version}.exe

![Github Release](https://github.com/ArtFXDev/Pulsar/raw/master/docs/img/github-release.png)

For the moment Pulsar is only available for Windows. OSX & Linux support will come later.





[GithubRelease]: [https://github.com/ArtFXDev/Pulsar/releases
