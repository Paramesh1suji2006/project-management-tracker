import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Project from './models/Project.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✓ MongoDB Connected');

        // Clear existing data (optional - comment out if you want to keep existing data)
        await User.deleteMany({});
        await Project.deleteMany({});
        console.log('✓ Cleared existing data');

        // Create sample users
        const hashedPassword = await bcrypt.hash('password123', 10);

        const adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'Admin',
        });

        const managerUser = await User.create({
            name: 'Project Manager',
            email: 'manager@example.com',
            password: hashedPassword,
            role: 'Manager',
        });

        const developerUser1 = await User.create({
            name: 'Developer One',
            email: 'dev1@example.com',
            password: hashedPassword,
            role: 'Developer',
        });

        const developerUser2 = await User.create({
            name: 'Developer Two',
            email: 'dev2@example.com',
            password: hashedPassword,
            role: 'Developer',
        });

        console.log('✓ Created sample users');
        console.log(`  - Admin: admin@example.com / password123`);
        console.log(`  - Manager: manager@example.com / password123`);
        console.log(`  - Developer 1: dev1@example.com / password123`);
        console.log(`  - Developer 2: dev2@example.com / password123`);

        // Create sample projects
        const project1 = await Project.create({
            title: 'E-Commerce Platform',
            key: 'ECP',
            description: 'Building a modern e-commerce platform with React and Node.js',
            status: 'Active',
            owner: adminUser._id,
            createdBy: adminUser._id,
            teamMembers: [adminUser._id, managerUser._id, developerUser1._id, developerUser2._id],
        });

        const project2 = await Project.create({
            title: 'Mobile App Development',
            key: 'MAD',
            description: 'Cross-platform mobile application for iOS and Android',
            status: 'Active',
            owner: managerUser._id,
            createdBy: managerUser._id,
            teamMembers: [managerUser._id, developerUser1._id],
        });

        const project3 = await Project.create({
            title: 'Internal Dashboard',
            key: 'IDB',
            description: 'Analytics dashboard for internal business metrics',
            status: 'Planning',
            owner: adminUser._id,
            createdBy: adminUser._id,
            teamMembers: [adminUser._id, developerUser2._id],
        });

        console.log('✓ Created sample projects');
        console.log(`  - ${project1.title} (${project1.key})`);
        console.log(`  - ${project2.title} (${project2.key})`);
        console.log(`  - ${project3.title} (${project3.key})`);

        console.log('\n🎉 Database seeded successfully!');
        console.log('\n📝 You can now login with any of the users above and create tickets in the projects.');
        console.log('   All users have the password: password123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
