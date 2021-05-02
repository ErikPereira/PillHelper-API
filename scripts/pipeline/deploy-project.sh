echo "#######################################"
echo "`date` Deploying project in production"
echo "#######################################"

###########################
# Declared CI variables:
# $BRANCH_PRD
# $BRANCH_HML
# $BRANCH_DEV
# $KUBE_NAMESPACE
# $KUBE_CONFIG_DEV
# $KUBE_CONFIG_HML
# $KUBE_CONFIG_PRD
# $NEXUS_HOST
# $NEXUS_PORT
# $NEXUS_USER
# $NEXUS_PASS
# $IMAGE_PATH
# $IMAGE_LATEST_VERSION_DEV
# $IMAGE_LATEST_VERSION_HML
# $IMAGE_LATEST_VERSION_PRD
###########################

###########################
# Git Internal CI variables:
# $CI_COMMIT_REF_NAME (name of the branch)
# $CI_PROJECT_NAME (name of the project)
# $CI_COMMIT_TAG (name of the tag)
###########################

# Variable init
DOCKER_REGISTRY="$NEXUS_HOST:$NEXUS_PORT"
DEPLOY="NO"

# Identifies the branch and decides what to do accordingly
if [ $CI_COMMIT_REF_NAME == $BRANCH_DEV ]
then
  IMAGE_VERSION=$IMAGE_LATEST_VERSION_DEV
  KUBE_CONFIG=$KUBE_CONFIG_DEV
  DEPLOY="YES"
elif [ $CI_COMMIT_REF_NAME == $BRANCH_HML ]
then
  IMAGE_VERSION=$IMAGE_LATEST_VERSION_HML
  KUBE_CONFIG=$KUBE_CONFIG_HML
  DEPLOY="YES"
elif [ $CI_COMMIT_REF_NAME == $BRANCH_PRD ]
then
  IMAGE_VERSION=$IMAGE_LATEST_VERSION_PRD
  KUBE_CONFIG=$KUBE_CONFIG_PRD
  DEPLOY="YES"
fi

if [[ $DEPLOY == "YES" ]]
then
  # Install kubectl
  apk update  && apk add --no-cache curl
  curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl
  chmod +x ./kubectl && mv ./kubectl /usr/local/bin/kubectl

  mkdir -p $HOME/.kube
  echo -n $KUBE_CONFIG | base64 -d > $HOME/.kube/config
  kubectl set image deployment $CI_PROJECT_NAME $CI_PROJECT_NAME=$DOCKER_REGISTRY/$IMAGE_PATH/$CI_PROJECT_NAME:$IMAGE_VERSION -n $KUBE_NAMESPACE
  kubectl rollout status deployment $CI_PROJECT_NAME -n $KUBE_NAMESPACE

  # TODO: test increase pod
else
  echo "################################"
  echo "`date` Deploy conditions not met"
  echo "################################"
fi
