# Pulsar Pipeline

In `Pulsar/` copy `.config.example.json` to `config.json`
Then updata the info and paths to correspond to your setup

## Frontend
The frontend code can be found in the following folders:
- `main/`: the code for the creation of the window
- `renderer/`: the code for the UI

In the project folder `Pulsar/` run to start developing:
```bash
# install dependencies
$ yarn install

# start dev server
$ yarn dev
```

## Backend
The source code for the backed can be found in: `python/`
To run the backend server:
```bash
# install dependencies
$ yarn install

# start dev server
$ yarn dev
```

## Engine plugins
The source code for the engine plugins can be found in: `engines/`

## Nodes for the graph editor
An example config file can be found in `nodes/.node.json`
```json
{
    "node" : {
        "name": "node1",
        "color": "#f00",
        "type": "python",
        "script": "helloWorld.py",
        "command": "",
        "inputs": [
          {
            "name": "name",
            "type": "string"
          }
        ],
        "outputs": [
          {
            "name": "hello",
            "type": "string"
          }
        ]
    }
}
```
