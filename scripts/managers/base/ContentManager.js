class ContentManager {
  constructor(platform) {
    this.platform = platform;
  }

  async enumerate() {
    throw new Error('Method enumerate must be implemented');
  }

  async getContent(path) {
    throw new Error('Method getContent must be implemented');
  }

  async createContent(path, content) {
    throw new Error('Method createContent must be implemented');
  }

  async updateContent(path, content) {
    throw new Error('Method updateContent must be implemented');
  }

  async deleteContent(path) {
    throw new Error('Method deleteContent must be implemented');
  }
}

module.exports = ContentManager;
