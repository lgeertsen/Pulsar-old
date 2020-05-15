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

*An example*:
`C:/Users/JeanJacques/Documents/SynologyDrive/ARAL/...`

When this is done you need to execute the following command in a terminal. (You can open a terminal by pressing the `windows key` & typing `cmd`)

For this command make sure you put the path until the `SynologyDrive` directory, do not include the `SynologyDrive` directory in the command.

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

After executing the `.exe` Pulsar will launch automatically and you are ready to move on to step 3.

#### III - First Usage

![Welcome](https://github.com/ArtFXDev/Pulsar/raw/master/docs/img/first-usage-1.png)

You'll get this screen when you launch Pulsar for the first time. The application will lead you through the setup.

First you will have the choice to select a `light` of `dark` theme for Pulsar. After choosing your theme press the next button.

![Theme](https://github.com/ArtFXDev/Pulsar/raw/master/docs/img/first-usage-2.png)

Next you can choose your primary color for your interface. Pick a color and click next.

![Color](https://github.com/ArtFXDev/Pulsar/raw/master/docs/img/first-usage-3.png)

**And now a very important step: Adding your project.**

Fill in the project name on the left. **Don't use spaces in the name!!!**.

If your project is called 'My Project' you can fill in `MyProject` or `My_Project`

The click on `Select Project Directory` on select your project folder.
If your project path is `I:/SynologyDrive/ARAL/` you select the `ARAL` folder.

![Select Project](https://github.com/ArtFXDev/Pulsar/raw/master/docs/img/first-usage-4.png)

**!!!!!!!!!!!!!!!! Very important: Don't forget to click on the plus button to add it to the project list before clicking next. Your project should be added like in the image below**

![Add Project](https://github.com/ArtFXDev/Pulsar/raw/master/docs/img/first-usage-5.png)

Awesome. Everything is set up and you can now dive into Pulsar

![All set up](https://github.com/ArtFXDev/Pulsar/raw/master/docs/img/first-usage-6.png)

#### IV - Using Pulsar

The usage of the Pulsar file manager is pretty easy.

On the top you can select the project you want to browse. Next to the project selection you can to choose to browse `Assets` of `Shots`

Underneath that you have the filters. With this you can decide to only show work or published scenes.

On the bottom you have a classic file manager where you can browse the directories of your assets & shots.

In the most right browser window, the file browser you can sort the files by version, size, state, tags,...

![Pulsar](https://github.com/ArtFXDev/Pulsar/raw/master/docs/img/pulsar-1.png)

When you click on a file, a file view opens on the bottom. Here you have more details on the project file. You can edit the comment, or add/remove tags.

![Pulsar](https://github.com/ArtFXDev/Pulsar/raw/master/docs/img/pulsar-2.png)

When you click open button on the bottom left of the file detail window, you can choose to open file in the supported software.

**For the moment only Maya, Houdini & Nuke files can be opened with Pulsar**

![Pulsar](https://github.com/ArtFXDev/Pulsar/raw/master/docs/img/pulsar-3.png)

#### V - Adding assets

You can also add new assets or shots to your project by clicking on the `Create Asset` button on the top left of the file manager. This will open a window were you can put in the information for the new asset/shot.

![Pulsar](https://github.com/ArtFXDev/Pulsar/raw/master/docs/img/pulsar-4.png)

For the moment you can only create an asset from an existing scene file (Maya, Houdini or Nuke). This is can also be useful to conform scenes.

![Pulsar](https://github.com/ArtFXDev/Pulsar/raw/master/docs/img/pulsar-5.png)

[GithubRelease]: [https://github.com/ArtFXDev/Pulsar/releases
