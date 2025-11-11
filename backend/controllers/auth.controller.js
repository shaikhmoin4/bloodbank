import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';
import Role from '../models/RoleModel.js';

export const register = async (req, res) => {
  try {
    const { first_name, last_name, username, email, phone_number, password, dob, gender, status, is_active, role_name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }, { phone_number }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email, username, or phone number'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Find default role or specified role
    let role = null;
    if (role_name) {
      role = await Role.findOne({ name: role_name, status: 'active' });
      if (!role) {
        return res.status(400).json({
          success: false,
          message: 'Invalid role specified'
        });
      }
    } else {
      // Assign default role
      role = await Role.findOne({ is_default: true, status: 'active' });
    }

    // Create user
    const user = new User({
      first_name,
      last_name,
      username,
      email,
      phone_number,
      password: hashedPassword,
      dob,
      gender,
      status: status || 'active',
      is_active: is_active !== undefined ? is_active : true,
      role: role ? role._id : null
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: role ? role.name : null },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          first_name: user.first_name,
          last_name: user.last_name,
          username: user.username,
          email: user.email,
          phone_number: user.phone_number,
          dob: user.dob,
          gender: user.gender,
          status: user.status,
          is_active: user.is_active,
          role: role ? role.name : null
        },
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username or email
    const user = await User.findOne({
      $or: [{ username }, { email: username }]
    }).populate('role');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (!user.is_active || user.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Account is inactive or blocked'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role ? user.role.name : null },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: `${user.first_name} ${user.last_name}`.trim(),
          first_name: user.first_name,
          last_name: user.last_name,
          username: user.username,
          email: user.email,
          phone_number: user.phone_number,
          dob: user.dob,
          gender: user.gender,
          status: user.status,
          is_active: user.is_active,
          role: user.role ? user.role.name : null
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

export const logout = async (req, res) => {
  try {
    // In a stateless JWT system, logout is handled on the client side
    // by removing the token from localStorage/cookies
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      error: error.message
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    // User is already attached to req by authMiddleware
    const user = req.user;

    res.json({
      success: true,
      message: 'Profile retrieved successfully',
      data: {
        user: {
          id: user._id,
          name: `${user.first_name} ${user.last_name}`.trim(),
          first_name: user.first_name,
          last_name: user.last_name,
          username: user.username,
          email: user.email,
          phone_number: user.phone_number,
          dob: user.dob,
          gender: user.gender,
          status: user.status,
          is_active: user.is_active,
          role: user.role ? user.role.name : null
        }
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile',
      error: error.message
    });
  }
};