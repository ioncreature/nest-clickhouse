if [[ $# -eq 0 ]] ; then
    echo 'Pass tag for a new version. For example:'
    echo 'build_docker_image.sh 1.0'
    exit 0
fi

docker image rm dtu-rc
docker build --no-cache -t dtu-rc . &&

docker tag dtu-rc alexeyhimself/dtu:$1 &&
docker tag dtu-rc alexeyhimself/dtu:latest &&

docker push alexeyhimself/dtu:$1 &&
docker push alexeyhimself/dtu:latest
