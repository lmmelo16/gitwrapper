## This is the docker entypoint script

## Goal usage
# docker run -it wrapper cli -> run the cli
# docker run -it wrapper api -> run the api

ARG=$1

if [ "$ARG" = "cli" ]; then
    ./dist/cli/cli.js "${@:2}"
elif [ "$ARG" = "api" ]; then
    npm run start:server
else
    echo "Usage: bash entrypoint.sh [cli|api]"
fi