Back: {@tutorial getting-started}

#### I - Download the latest version of Pulsar

<iframe width="560" height="315" src="https://www.youtube.com/embed/-y5r7ATqI94" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

You can find the latest version of Pulsar on the pulsar website:
[pulsarvfx.com](https://pulsarvfx.com/)

<!-- ![Github Release](https://github.com/ArtFXDev/Pulsar/raw/master/tutorials/img/github-release.png) -->

For the moment Pulsar is only available for Windows. OSX & Linux support will come later.

After executing the `.exe` Pulsar will launch automatically and you are ready to move on to step 3.

#### II - First Usage

![Welcome](https://github.com/ArtFXDev/Pulsar/raw/master/tutorials/img/first-usage-1.png)

You'll get this screen when you launch Pulsar for the first time. The application will lead you through the setup.

First you will have the choice to select a `light` of `dark` theme for Pulsar. After choosing your theme press the next button.

![Theme](https://github.com/ArtFXDev/Pulsar/raw/master/tutorials/img/first-usage-2.png)

Next you can choose your primary color for your interface. Pick a color and click next.

![Color](https://github.com/ArtFXDev/Pulsar/raw/master/tutorials/img/first-usage-3.png)

**And now a very important step: Adding your project.**

Fill in the project name on the left. **Don't use spaces in the name!!!**.

If your project is called 'My Project' you can fill in `MyProject` or `My_Project`

The click on `Select Project Directory` on select your project folder.
If your project path is `I:/SynologyDrive/ARAL/` you select the `ARAL` folder.

![Select Project](https://github.com/ArtFXDev/Pulsar/raw/master/tutorials/img/first-usage-4.png)

**!!!!!!!!!!!!!!!! Very important: Don't forget to click on the plus button to add it to the project list before clicking next. Your project should be added like in the image below**

![Add Project](https://github.com/ArtFXDev/Pulsar/raw/master/tutorials/img/first-usage-5.png)

Once the project is added you will have to configure your project paths
- In the Asset : scene input you paste the following:
`{project}/03_WORK/01_ASSET_3D/{asset_type}/{asset_name}/{dimension}/scenes/{task}/{subtask}/{state}_{version}/{file}`
- And in shot : scene input you paste:
`{project}/03_WORK/02_SHOT/{dimension}/scenes/{sequence}/{shot}/{task}/{subtask}/{state}_{version}/{file}`

![Configure Project](https://github.com/ArtFXDev/Pulsar/raw/master/tutorials/img/first-usage-5-1.png)

Next you will have let the Pulsar know where you have installed your software.
Select the software you want to use with the pipeline by clicking on the software icon.
You can unselect the software by clicking on the icon again.

**For the moment only Houdini & Maya are supported, other software will be added later this year**

![Setup Software 1](https://github.com/ArtFXDev/Pulsar/raw/master/tutorials/img/first-usage-5-2.png)

On the next screen you will have to select the executables for every selected software.
Underneath every asked executables you will find the path of the default install location of the executable.
When this is done click next.

![Setup Software 2](https://github.com/ArtFXDev/Pulsar/raw/master/tutorials/img/first-usage-5-3.png)

Awesome. Everything is set up and you can now dive into Pulsar

![All set up](https://github.com/ArtFXDev/Pulsar/raw/master/tutorials/img/first-usage-6.png)

#### III - Using Pulsar

The usage of the Pulsar file manager is pretty easy.

On the top you can select the project you want to browse. Next to the project selection you can to choose to browse `Assets` of `Shots`

Underneath that you have the filters. With this you can decide to only show work or published scenes.

On the bottom you have a classic file manager where you can browse the directories of your assets & shots.

In the most right browser window, the file browser you can sort the files by version, size, state, tags,...

![Pulsar](https://github.com/ArtFXDev/Pulsar/raw/master/tutorials/img/pulsar-1.png)

When you click on a file, a file view opens on the bottom. Here you have more details on the project file. You can edit the comment, or add/remove tags.

![Pulsar](https://github.com/ArtFXDev/Pulsar/raw/master/tutorials/img/pulsar-2.png)

When you click open button on the bottom left of the file detail window, you can choose to open file in the supported software or increment the version.

**For the moment only Maya, Houdini files can be opened with Pulsar**

![Pulsar](https://github.com/ArtFXDev/Pulsar/raw/master/tutorials/img/pulsar-3.png)

#### IV - Adding assets

You can add directories when you click on `Create New` in the browser columns.

![Pulsar](https://github.com/ArtFXDev/Pulsar/raw/master/tutorials/img/pulsar-4.png)

You can also add new assets or shots to your project by clicking on the `Create New` in the file browser.

![Pulsar](https://github.com/ArtFXDev/Pulsar/raw/master/tutorials/img/pulsar-5.png)

For the moment you can only create an asset from an existing scene file (Maya or Houdini).

[GithubRelease]: https://github.com/ArtFXDev/Pulsar/releases

Next: {@tutorial sockets}
