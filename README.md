# Cafe Website - MySQL Version

This is a Next.js cafe website that has been converted from MongoDB to MySQL database.

## Features

- 🍰 Menu management with categories
- 📷 Gallery management
- ✉️ Contact form with message storage
- 🔔 Admin notifications
- 📊 Dashboard with statistics
- 👤 Admin authentication system

## Prerequisites

Before running this project, make sure you have:

1. **Node.js** (v18 or higher)
2. **MySQL** (v8.0 or higher) running on your system
3. **npm** or **yarn** package manager

## Quick Start

### 1. Configure Environment Variables

Copy the example environment file and update it with your MySQL credentials:

```bash
cp .env.local .env.local.example
```

Edit `.env.local` with your MySQL settings:

```env
# MySQL Database Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=cafe_website
MYSQL_USERNAME=root
MYSQL_PASSWORD=your-password
MYSQL_CONNECTION_LIMIT=10

# Admin credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
JWT_SECRET=your-jwt-secret-key
```

### 2. Setup the Database

Run the database setup script to create all tables and default data:

```bash
npm run db:setup
```

This will:
- Create the `cafe_website` database
- Create all necessary tables
- Insert default admin user
- Insert default settings
- Insert default menu categories

### 3. (Optional) Seed Sample Data

Add sample menu items and gallery images:

```bash
npm run db:seed
```

### 4. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your cafe website.

## Admin Panel

Access the admin panel at [http://localhost:3000/admin](http://localhost:3000/admin)

Default credentials:
- Username: `admin`
- Password: `admin123` (or whatever you set in `.env.local`)

## Project Structure

```
cafe-website/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   │   ├── admin/         # Admin API endpoints
│   │   │   ├── contact/       # Contact form API
│   │   │   ├── dashboard/     # Dashboard stats API
│   │   │   ├── gallery/       # Gallery API
│   │   │   ├── menu/          # Menu API
│   │   │   └── settings/      # Settings API
│   │   ├── admin/             # Admin pages
│   │   ├── menu/              # Menu pages
│   │   ├── gallery/           # Gallery pages
│   │   └── contact/           # Contact page
│   ├── components/            # React components
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Database connection
│   │   └── mysql.js          # MySQL connection pool
│   ├── models/               # Data access layers
│   │   ├── menuModel.js
│   │   ├── menuCategoryModel.js
│   │   ├── galleryModel.js
│   │   ├── contactModel.js
│   │   ├── notificationModel.js
│   │   ├── settingsModel.js
│   │   ├── adminModel.js
│   │   └── activityModel.js
│   ├── services/             # Business logic
│   │   └── menuService.js
│   └── utils/                # Utility functions
│       └── activityLogger.js
├── scripts/                  # Database scripts
│   ├── setup-database.js    # Database setup
│   └── seed-data.js         # Sample data seeding
├── public/                   # Static assets
└── .env.local               # Environment variables
```

## Available npm Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run db:setup         # Setup database and tables
npm run db:migrate       # Migrate from MongoDB (if needed)
npm run db:seed          # Seed sample data
```

## Database Tables

The following tables are created:

1. `admin_users` - Admin user accounts
2. `menu_categories` - Menu item categories
3. `menu_items` - Menu items
4. `contact_messages` - Contact form messages
5. `gallery_images` - Gallery images
6. `notifications` - Admin notifications
7. `settings` - Site settings (key-value store)
8. `activity_logs` - Activity logging

## API Endpoints

### Public Endpoints
- `GET /api/menu` - Get all menu items
- `GET /api/gallery` - Get gallery images
- `GET /api/settings` - Get site settings
- `POST /api/contact` - Submit contact form

### Admin Endpoints (require authentication)
- `GET /api/admin/menu` - Manage menu items
- `POST /api/admin/menu` - Add menu item
- `PUT /api/admin/menu` - Update menu item
- `DELETE /api/admin/menu` - Delete menu item
- `GET /api/admin/notifications` - Get notifications
- `PUT /api/admin/notifications` - Mark as read
- `POST /api/admin/login` - Admin login
- `GET /api/dashboard/stats` - Dashboard statistics

## Troubleshooting

### MySQL Connection Issues

1. Make sure MySQL is running: `sudo systemctl status mysql`
2. Check credentials in `.env.local`
3. Ensure the database exists: `CREATE DATABASE cafe_website;`

### Port Already in Use

If port 3000 is already in use, run:
```bash
npm run dev -- -p 3001
```

### Module Not Found Errors

If you get module not found errors, try reinstalling:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Production Deployment

1. Update `.env.production` with your production MySQL credentials
2. Build the application: `npm run build`
3. Start the server: `npm run start`

Make sure your MySQL server is accessible from your production environment.

## License

This project is private and proprietary.
