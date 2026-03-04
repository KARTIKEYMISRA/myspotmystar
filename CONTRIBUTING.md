# Contributing to SpotMYstar

Thank you for your interest in contributing to SpotMYstar! This document provides guidelines and instructions for contributing.

## 🤝 How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details (OS, Node version, etc.)

### Suggesting Features

Feature suggestions are welcome! Please:
- Check if the feature already exists or is planned
- Provide a clear use case
- Explain the expected behavior
- Consider implementation complexity

### Code Contributions

1. **Fork the Repository**
   ```bash
   git clone https://github.com/yourusername/spotmystar.git
   cd spotmystar
   ```

2. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

3. **Make Your Changes**
   - Follow the existing code style
   - Write clear, commented code
   - Test your changes thoroughly
   - Update documentation if needed

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature" 
   # or
   git commit -m "fix: resolve bug in booking system"
   ```

   Use conventional commit messages:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting)
   - `refactor:` - Code refactoring
   - `test:` - Adding tests
   - `chore:` - Maintenance tasks

5. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Provide a clear description
   - Link related issues

## 📝 Code Style Guidelines

### JavaScript/React

- Use ES6+ syntax
- Use functional components with hooks
- Follow React best practices
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

### Example:
```javascript
// Good
const handleBookingSubmit = async (bookingData) => {
  try {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  } catch (error) {
    console.error('Booking submission failed:', error);
    throw error;
  }
};

// Avoid
const f = async (d) => {
  return await api.post('/bookings', d);
};
```

### Backend

- Use async/await for asynchronous operations
- Implement proper error handling
- Validate all inputs
- Use middleware for common operations
- Follow RESTful API conventions

### Database

- Use parameterized queries (prevent SQL injection)
- Add indexes for frequently queried fields
- Maintain referential integrity
- Document schema changes

## 🧪 Testing

Before submitting:

1. **Test Locally**
   ```bash
   # Backend
   cd backend && npm run dev
   
   # Frontend
   cd frontend && npm run dev
   ```

2. **Test API Endpoints**
   - Use Postman or curl
   - Test all CRUD operations
   - Verify error handling

3. **Test UI**
   - Check all user flows
   - Test on different screen sizes
   - Verify form validations

4. **Check for Errors**
   - No console errors
   - No broken links
   - No missing images

## 📚 Documentation

Update documentation when:
- Adding new features
- Changing API endpoints
- Modifying database schema
- Updating configuration

Files to update:
- `README.md` - Overview and quick start
- `docs/API_DOCUMENTATION.md` - API changes
- `docs/DATABASE_SCHEMA.md` - Schema changes
- `docs/FEATURES.md` - New features

## 🔍 Code Review Process

Your PR will be reviewed for:
- Code quality and style
- Functionality and correctness
- Test coverage
- Documentation updates
- Security considerations
- Performance impact

## 🚫 What Not to Do

- Don't commit sensitive data (passwords, API keys)
- Don't commit `node_modules/` or `.env` files
- Don't make unrelated changes in one PR
- Don't ignore linting errors
- Don't skip testing

## 🎯 Priority Areas

We especially welcome contributions in:
- Payment integration (Razorpay/Stripe)
- Email notification system
- File upload functionality
- Advanced search and filters
- Mobile app development
- Testing (unit, integration, E2E)
- Performance optimizations
- Accessibility improvements

## 💡 Development Tips

### Backend Development

```bash
# Watch for changes
npm run dev

# Check database
psql -U postgres -d spotmystar

# View logs
tail -f logs/app.log
```

### Frontend Development

```bash
# Hot reload enabled
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Database Changes

```bash
# Backup before changes
pg_dump -U postgres spotmystar > backup.sql

# Make changes in migrate.js
# Test migration
npm run migrate

# Restore if needed
psql -U postgres spotmystar < backup.sql
```

## 🐛 Debugging

### Backend Issues

1. Check server logs
2. Verify environment variables
3. Test database connection
4. Check middleware order
5. Verify JWT token

### Frontend Issues

1. Check browser console
2. Verify API endpoints
3. Check network tab
4. Verify state management
5. Check routing

## 📞 Getting Help

- Check existing documentation
- Search closed issues
- Ask in discussions
- Contact maintainers

## 🎉 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to SpotMYstar! 🌟
