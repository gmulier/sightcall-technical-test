/**
 * TypeScript type definitions for the AI Tutorials application
 * 
 * This file contains all the interface definitions used throughout
 * the frontend application, matching the Django backend models.
 */

// User interface based on Django User model with GitHub OAuth2 extensions
export interface User {
  id: string;
  username: string;
  email: string;
  github_id: string;
  avatar_url: string;
  profile_url: string;
}

// Transcript interface representing uploaded conversation files
export interface Transcript {
  id: string;
  user: User;
  filename: string;
  timestamp: string;  // ISO datetime string from the original conversation
  duration_in_ticks: number;  // Duration in system ticks (10,000,000 = 1 second)
  phrases: any[];  // Array of conversation phrases with text and metadata
  created_at: string;  // ISO datetime string when uploaded to our system
}

// Tutorial interface representing AI-generated tutorials from transcripts
export interface Tutorial {
  id: string;
  transcript: Transcript;  // Source transcript this tutorial was generated from
  title: string;  // AI-generated title
  introduction: string;  // AI-generated introduction paragraph
  steps: string[];  // Array of step-by-step instructions
  examples: string[];  // Array of practical examples
  summary: string;  // AI-generated summary paragraph
  duration_estimate: string;  // Estimated completion time (e.g., "5 minutes")
  tags: string[];  // Array of relevant keywords/tags
  updated_at: string;  // ISO datetime string when last modified
}

// API response interface for Django authentication endpoint
export interface AuthResponse {
  authenticated: boolean;
  user?: User;
  login_url?: string;
}

// Context interface for React authentication provider
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
} 