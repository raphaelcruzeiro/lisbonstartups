# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
    config.vm.box = "ubuntu"
    config.vm.network :forwarded_port, guest: 8000, host: 8000
    config.vm.provision :shell, :path => "install_dependencies.sh"
end

