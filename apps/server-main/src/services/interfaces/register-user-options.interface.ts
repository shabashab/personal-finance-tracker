export interface RegisterUserOptions {
  /**
   * Is it necessary to verify e-mail on user creation
   */
  verifyEmail?: boolean

  /**
   * Create admin user
   */
  isAdmin?: boolean
}
