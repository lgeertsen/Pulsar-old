Back: {@tutorial getting-started}

#### I - Project Preparation for 5RN students

<iframe width="560" height="315" src="https://www.youtube.com/embed/6_lStR4RBP4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Make sure that on you local computer you have the same directory arborescence as at school:
- For **assets**: `{project}/03_WORK/01_ASSET_3D/{asset_type}/{asset_name}/{dimension}/scenes/{task}/{subtask}/{state}_{version}/{file}`
- For **shots**: `{project}/03_WORK/02_SHOT/{dimension}/scenes/{sequence}/{shot}/{task}/{subtask}/{state}_{version}/{file}`

**You can download an empty folder structure for you project [here](https://mega.nz/file/FBwwyCSY#JhinQLMatsVs-wghJ2c9hV0LJp4Py0qTVUFxJBJw2Do)**

Once downloaded extract the `.zip` and rename the folder `FILM_NAME` with the name of your project. This should be the same name as it will be on the server on school.

Here is the list of the project names for the folder:
- BACKSTAGE
- BARNEY
- COCORICA
- DIVE
- DREAMBLOWER
- FROM_ABOVE
- GOOD_MORNING_KITTY
- GREEN
- HAKAM
- HOSTILE
- PACIFIC_DUMBASS
- PIR_HEARTH
- RELATIVITY

To be able to open scenes from school you should have a drive called `I:`. If you don't have this you can easily fake one with a simple command.

First you should create a directory called `SynologyDrive` wherever you want. And inside that directory you put your project arborescence.

So you have the following:
`{path-to-synology}/SynologyDrive/{project}/...`

*An example*:
`C:/Users/JeanJacques/Documents/SynologyDrive/BACKSTAGE/...`

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

Next: {@tutorial firstUsage}
