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
If your project path is `C:/Users/JeanJacques/Documents/SynologyDrive/ARAL/` you select the `ARAL` folder.

![Select Project](https://github.com/ArtFXDev/Pulsar/raw/master/docs/img/first-usage-4.png)

**!!!!!!!!!!!!!!!! Very important: Don't forget to click on the plus button to add it to the project list before clicking next. Your project should be added like in the image below**

![Add Project](https://github.com/ArtFXDev/Pulsar/raw/master/docs/img/first-usage-5.png)

Awesome. Everything is set up and you can now dive into Pulsar

![All set up](https://github.com/ArtFXDev/Pulsar/raw/master/docs/img/first-usage-6.png)

[GithubRelease]: [https://github.com/ArtFXDev/Pulsar/releases
