import { LicenseService } from '../../services/license.service.js';

const licenseService = new LicenseService();

export const getLicense = async (ctx) => {
  try {
    const userId = ctx.state.user.id;
    const license = await licenseService.getUserLicense(userId);

    ctx.status = 200;
    ctx.body = {
      success: true,
      data: license
    };
  } catch (error) {
    ctx.status = error.status || 500;
    ctx.body = {
      success: false,
      message: error.message
    };
  }
};

export const purchaseLicense = async (ctx) => {
  try {
    const userId = ctx.state.user.id;
    const license = await licenseService.createLicense(userId);

    ctx.status = 201;
    ctx.body = {
      success: true,
      data: license
    };
  } catch (error) {
    ctx.status = error.status || 500;
    ctx.body = {
      success: false,
      message: error.message
    };
  }
};
