/* global hexo */
const logger = require('hexo-log')();

/**
 * Print welcome message
 */
logger.info(`=======================================
 ██╗ ██████╗ █████╗ ██████╗ ██╗   ██╗███████╗
 ██║██╔════╝██╔══██╗██╔══██╗██║   ██║██╔════╝
 ██║██║     ███████║██████╔╝██║   ██║███████╗
 ██║██║     ██╔══██║██╔══██╗██║   ██║╚════██║
 ██║╚██████╗██║  ██║██║  ██║╚██████╔╝███████║
 ╚═╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝
=============================================`);

/**
 * Check if all dependencies are installed
 */
require('../include/dependency')(hexo);

/**
 * Configuration file checking and migration
 */
try {
  require('../include/config')(hexo);
} catch (e) {
  // Skip config for Hexo 7.x compatibility
  console.warn('Skipped config script for Hexo 7.x compatibility');
}

/**
 * Register Hexo extensions and remove Hexo filters that could cause OOM
 */
try {
  require('../include/register')(hexo);
} catch (e) {
  // Ignore hexo-component-inferno errors for Hexo 7.x compatibility
  console.warn('Skipped register script for Hexo 7.x compatibility');
}
