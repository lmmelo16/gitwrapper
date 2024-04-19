# Commands

## Build

### Build and Run API, MongoDB and Jaeger

`docker-compose up -d --build` - This will build and start the API on port 3000, MongoDB and Jaeger on port 16686

### Run API, MongoDB and Jaeger

`docker compose up -d` - This will start the API on port 3000, MongoDB and Jaeger on port 16686

### Run Cli (after running docker-compose)

`bash cli.sh <command>` - Abstracts the cli interaction that is also running in the docker container

## CLI

### `add <git_repo>`

-   This command will clone git repository to the machine and add it to the database

### `rm <git_repo>`

-   This command will remove git repository from the machine and the database

### `ls`

-   This command will list all the git repositories in the database

### `c <git_repo> [-n <number_of_commits>] [-f]`

-   This command will list the commits of a git repository

-   The `-n` flag will limit the number of commits

-   The `-f` flag will force cache to update

## API

### `GET /projects`

-   This endpoint will list all the git repositories in the database

### `POST /projects`

-   json: `{ "gitRepo": "<gitRepo>"}`
-   This endpoint will add a git repository to the database

### `DELETE /projects/:gitRepo`

-   This endpoint will remove a git repository from the database
-   gitRepo can be repository url or name

### `GET /commits/:gitRepo`

-   Number of commits can be passed as query `?number=<number_of_commits>`
-   This endpoint will list the commits of a git repository
-   gitRepo can be repository url or name

## Metrics - Jaeger

-   Jaeger is used to trace the API requests
-   The UI can be accessed at `http://localhost:16686/`
-   Used to check the latency and flows of requests and it alsos allows to debug the requests
-   Alerts can be creating by connecting with `prometheus` and `grafana` as a data source

# How it works

-   When `projects` are added they are cloned to the machine and also added to the database

-   When `commits` are listed they are added to database and periodically updated (poll time is 5 min)

-   `Git is used as 3rd party` and the primary source of information is the `database to cache` possible requests

-   The CLI is implemented using the `commander` library

-   The API is implemented using the `express` library

-   To implement both the CLI and the API all the common logic is implemented as a service in the `service` folder

-   To have persistend data, `MongoDB` is used as a database and models logic is in the `models` folder

### Git Abstraction

-   All commands that interact with the git cli are implemented in a class that abstracts the git commands

-   The class is in the `third-parties/git` folder
