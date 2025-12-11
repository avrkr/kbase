# Deployment Guide for AWS EC2 (Ubuntu + Apache2)

This guide assumes you have a fresh Ubuntu instance on AWS EC2.

## 1. Server Preparation

Connect to your server via SSH:
```bash
ssh -i your-key.pem ubuntu@your-server-ip
```

Update the system and install necessary tools:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git apache2
```

Install Node.js (v18 or v20):
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

Install PM2 (Process Manager) globally:
```bash
sudo npm install -g pm2
```

## 2. Clone the Repository

Clone your project to `/var/www/kbase` (or your preferred location):
```bash
sudo mkdir -p /var/www/kbase
sudo chown -R ubuntu:ubuntu /var/www/kbase
git clone <your-github-repo-url> /var/www/kbase
cd /var/www/kbase
```

## 3. Backend Setup

Navigate to the backend folder and install dependencies:
```bash
cd backend
npm install
```

Create the environment file:
```bash
nano .env
```
Paste your production environment variables (ensure `NODE_ENV=production`):
```env
NODE_ENV=production
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SMTP_HOST=...
SMTP_USER=...
SMTP_PASS=...
# ... other variables
```

Start the backend with PM2:
```bash
cd ..
pm2 start deployment/ecosystem.config.js
pm2 save
pm2 startup
# Run the command displayed by pm2 startup to configure auto-start on boot
```

## 4. Frontend Setup

Navigate to the frontend folder and install dependencies:
```bash
cd frontend
npm install
```

Build the frontend for production:
```bash
npm run build
```
This will create a `dist` folder in `frontend/dist`.

## 5. Apache Configuration

Enable necessary Apache modules (Proxy and Rewrite):
```bash
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod rewrite
```

Copy the provided Apache config:
```bash
sudo cp deployment/apache.conf /etc/apache2/sites-available/kbase.conf
```

Edit the config to set your domain or IP:
```bash
sudo nano /etc/apache2/sites-available/kbase.conf
# Change 'ServerName your_domain_or_ip' to your actual IP or domain
```

Enable the site and restart Apache:
```bash
sudo a2dissite 000-default.conf  # Disable default site
sudo a2ensite kbase.conf         # Enable your site
sudo systemctl restart apache2
```

## 6. Firewall (Security Groups)

Ensure your AWS Security Group allows:
- **SSH (22)**: Your IP only
- **HTTP (80)**: Anywhere (0.0.0.0/0)
- **HTTPS (443)**: Anywhere (0.0.0.0/0) (If you set up SSL)

## 7. SSL (Optional but Recommended)

If you have a domain name pointed to your server IP, use Certbot for free SSL:

```bash
sudo apt install -y certbot python3-certbot-apache
sudo certbot --apache -d yourdomain.com
```

## Troubleshooting

- **Backend Logs**: `pm2 logs kbase-backend`
- **Apache Logs**: `sudo tail -f /var/log/apache2/error.log`
