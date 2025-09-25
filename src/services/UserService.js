class UserService {
  constructor() {
    this.repository = new UserRepository();
  }
  async signUp() {}
}

module.exports = UserService;
