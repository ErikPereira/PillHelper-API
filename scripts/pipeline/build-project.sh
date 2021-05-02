echo "################################"
echo "`date` Configuring repository keys"
echo "################################"
# Run ssh-agent
eval $(ssh-agent -s)

# Create SSH directory
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Add the SSH key to the agent store
echo "$SSH_KEY_SDK" | tr -d '\r' | ssh-add -

# Use ssh-keyscan to scan the keys of your private server.
# IP 201.20.39.69 is from gitlab.brhsa.equinix.com
ssh-keyscan -p 22 gitlab.brhsa.equinix.com >> ~/.ssh/known_hosts
chmod 644 ~/.ssh/known_hosts

# Install node packages
echo "################################"
echo "`date` Building project"
echo "################################"
npm install
