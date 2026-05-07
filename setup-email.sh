#!/bin/bash

echo "🔧 Setting up Email Delivery for Secure Enterprise Platform"
echo "=========================================================="

# Check if .env exists
if [ -f ".env" ]; then
    echo "⚠️  .env file already exists. Backing up to .env.backup"
    cp .env .env.backup
fi

# Copy production template
echo "📋 Copying production configuration..."
cp .env.production .env

echo ""
echo "📧 Email Setup Instructions:"
echo "============================"
echo ""
echo "1. Enable 2-Factor Authentication on your Google Account"
echo "2. Create an App Password:"
echo "   - Go to https://myaccount.google.com/"
echo "   - Security → 2-Step Verification → App passwords"
echo "   - Generate a new app password for 'Mail'"
echo "   - Copy the 16-character password"
echo ""
echo "3. Update your .env file with your Gmail credentials:"
echo "   - SMTP_USER=your-email@gmail.com"
echo "   - SMTP_PASS=your-16-character-app-password"
echo "   - SMTP_FROM=security@yourcompany.com"
echo ""
echo "4. Restart the server:"
echo "   npm run dev"
echo ""
echo "5. Test email delivery:"
echo "   curl -X POST http://localhost:5000/api/auth/register \\"
echo "     -H \"Content-Type: application/json\" \\"
echo "     -d '{\"email\":\"test@example.com\",\"password\":\"password123\"}'"
echo ""
echo "✅ Setup complete! Edit .env file with your Gmail credentials."
echo ""

# Open .env file for editing
echo "📝 Opening .env file for editing..."
if command -v code &> /dev/null; then
    code .env
elif command -v nano &> /dev/null; then
    nano .env
elif command -v vim &> /dev/null; then
    vim .env
else
    echo "Please manually edit the .env file with your SMTP credentials."
fi
