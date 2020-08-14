Back: {@tutorial getting-started}

#### I - Connect your softwares to Pulsar

You can also open you scene files directly in an instance of your software that is already open.

![Pulsar](https://github.com/ArtFXDev/Pulsar/raw/master/tutorials/img/pulsar-6.png)

**Connect Houdini to Pulsar**
Add the following to your `houdini.env`
You can find the `houdini.env` in `C:\Users\*YourUser*\Documents\houdiniXX.Y`
```houdini.env
HOUDINI_PATH = "C:\Users\*YourUser*\Pulsar\engines;&;"
HOUDINI_PULSAR = "C:\Users\*YourUser*\Pulsar\engines"
```

**Connect Maya to Pulsar**
Add the following to your `Maya.env`
You can find the `Maya.env` in `C:\Users\leege\Documents\maya\20XX`
```Maya.env
PYTHONPATH = $PYTHONPATH;C:/Users/*YourUser*/Pulsar/engines
MAYA_PULSAR = $MAYA_SCRIPT_PATH;C:/Users/*YourUser*/Pulsar/engines
```
