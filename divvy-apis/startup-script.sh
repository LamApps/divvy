#!/bin/bash
sudo mkdir divvy
sudo chmod 777 divvy
cd divvy
echo "-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
QyNTUxOQAAACCuBrlqyDw8uyEUQ6WtIL15ctgdCoVr7yLOnmxCIKyNnwAAAJg+7AuKPuwL
igAAAAtzc2gtZWQyNTUxOQAAACCuBrlqyDw8uyEUQ6WtIL15ctgdCoVr7yLOnmxCIKyNnw
AAAEBCgG/GRbHETLNFPKVKC2Gnlfh7/uAHUiBcsxSJU/odtq4GuWrIPDy7IRRDpa0gvXly
2B0KhWvvIs6ebEIgrI2fAAAAEW1ic2FpMjlAZ21haWwuY29tAQIDBA==
-----END OPENSSH PRIVATE KEY-----" | sudo tee -a ./id_ed25519
sudo chown root ./id_ed25519
sudo chmod 400 ./id_ed25519
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIK4GuWrIPDy7IRRDpa0gvXly2B0KhWvvIs6ebEIgrI2f mbsai29@gmail.com" | sudo tee -a ./id_ed25519.pub
sudo chown root ./id_ed25519.pub
sudo chmod 400 ./id_ed25519.pub
sudo apt-get install -y wget git
yes | sudo apt-get upgrade
sudo wget https://golang.org/dl/go1.16.5.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf go1.16.5.linux-amd64.tar.gz
export PATH="$PATH:/usr/local/go/bin"
sudo ssh-keyscan -H github.com >>  ~/.ssh/known_hosts
sudo ssh -o "StrictHostKeyChecking no" -i ./id_ed25519 git@github.com
yes | sudo ssh-agent bash -c 'ssh-add ./id_ed25519; git clone git@github.com:DivvyBet/divvy-apis'
cd divvy-apis
sudo gsutil cp  gs://divvy-apis/.env .
sudo /usr/local/go/bin/go build
sudo mv divvy-apis  ./apis
echo  -e 'Description= instance to serve divvy apis\nAfter=network.target\n[Service]\nUser=root\nGroup=www-data\nEnvironmentFile=/divvy/divvy-apis/.env\nExecStart=/divvy/divvy-apis/apis\n[Install]\nWantedBy=multi-user.target' | sudo tee -a /etc/systemd/system/apis.service
sudo systemctl start apis
sudo systemctl enable apis