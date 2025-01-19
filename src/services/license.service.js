import { LicenseRepository } from '../repositories/license.repository.js';

export class LicenseService {
  constructor() {
    this.licenseRepository = new LicenseRepository();
  }

  async getUserLicense(userId) {
    return this.licenseRepository.findByUserId(userId);
  }

  async createLicense(userId) {
    const existingLicense = await this.getUserLicense(userId);
    if (existingLicense) {
      throw new Error('User already has a license');
    }

    return this.licenseRepository.create({
      userId,
      type: 'lifetime',
      status: 'active',
      purchasedAt: new Date()
    });
  }
}
