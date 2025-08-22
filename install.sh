#!/bin/bash

# VPS Manager Installation Script
clear
echo "╭════════════════════════════════════════════════════════════╮"
echo "│                    VPS MANAGER INSTALLER                   │"
echo "╰════════════════════════════════════════════════════════════╯"

# Minta input domain
read -p "Masukkan domain untuk web panel: " DOMAIN
if [[ -z "$DOMAIN" ]]; then
    echo "Domain tidak boleh kosong!"
    exit 1
fi

# Install dependencies
apt update
apt install -y curl wget nginx nodejs npm postgresql

# Setup web application
git clone https://github.com/DEDIPREMIUM/dianaprojek.git /var/www/vps-manager
npm install

# Setup database
sudo -u postgres createdb vpsmanager
echo "DATABASE_URL=postgresql://postgres:password@localhost:5432/vpsmanager" > .env

# Configure Nginx
cat > /etc/nginx/sites-available/vps-manager << EOF
server {
    listen 80;
    server_name $DOMAIN;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
EOF

ln -s /etc/nginx/sites-available/vps-manager /etc/nginx/sites-enabled/
systemctl reload nginx

# Start application
npm run build
npm start

echo "✅ Instalasi selesai!"
echo "🌐 Akses web panel di: http://$DOMAIN"
