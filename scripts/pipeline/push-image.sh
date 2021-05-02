echo "################################"
echo "`date` Pushing image to registry"
echo "################################"

###########################
# Declared CI variables:
# $BRANCH_PRD
# $BRANCH_HML
# $BRANCH_DEV
# $NEXUS_HOST
# $NEXUS_PORT
# $NEXUS_USER
# $NEXUS_PASS
# $IMAGE_PATH
# $IMAGE_LATEST_VERSION_DEV
# $IMAGE_LATEST_VERSION_HML
# $IMAGE_LATEST_VERSION_PRD
# $GITLAB_INTERNAL_IP
# $SSH_KEY_SDK
###########################

###########################
# Git Internal CI variables:
# $CI_COMMIT_REF_NAME (name of the branch)
# $CI_PROJECT_NAME (name of the project)
# $CI_COMMIT_TAG (name of the tag)
###########################


# Variable init
TAG_BRANCH=$CI_COMMIT_TAG
DOCKER_REGISTRY="$NEXUS_HOST:$NEXUS_PORT"
PUSH_IMAGE="NO"

# Identifies the branch and decides what to do accordingly
if [ $CI_COMMIT_REF_NAME == $BRANCH_DEV ]
then
  IMAGE_VERSION=$IMAGE_LATEST_VERSION_DEV
  PUSH_IMAGE="YES"
elif [ $CI_COMMIT_REF_NAME == $BRANCH_HML ]
then
  IMAGE_VERSION=$IMAGE_LATEST_VERSION_HML
  PUSH_IMAGE="YES"
elif [ $CI_COMMIT_REF_NAME == $BRANCH_PRD ]
then
  IMAGE_VERSION=$IMAGE_LATEST_VERSION_PRD
  PUSH_IMAGE="YES"
elif [[ ! -z "$TAG_BRANCH" ]]
then
  IMAGE_VERSION=$TAG_BRANCH
  PUSH_IMAGE="YES"
fi

if [[ $PUSH_IMAGE == "YES" ]]
then
  # Push notification message
  echo "`date` Image $CI_PROJECT_NAME:$IMAGE_VERSION will be pushed to $DOCKER_REGISTRY"

  # Push commands
  docker build --no-cache --add-host gitlab.brhsa.equinix.com:$GITLAB_INTERNAL_IP --build-arg ssh_key_sdk="$SSH_KEY_SDK" -t $DOCKER_REGISTRY/$IMAGE_PATH/$CI_PROJECT_NAME:$IMAGE_VERSION .
  docker push $DOCKER_REGISTRY/$IMAGE_PATH/$CI_PROJECT_NAME:$IMAGE_VERSION
  docker rmi $DOCKER_REGISTRY/$IMAGE_PATH/$CI_PROJECT_NAME:$IMAGE_VERSION || echo
else
  echo "################################"
  echo "`date` Push conditions not met"
  echo "################################"
fi
