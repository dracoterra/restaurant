<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * Localized language
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'local' );

/** Database username */
define( 'DB_USER', 'root' );

/** Database password */
define( 'DB_PASSWORD', 'root' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',          '+5$%Z*!h %*F#!Xhl1vhHwQ*=e1~ou}o}Bf]GxG%/<pC~K~4*E8erZnDytGizCG9' );
define( 'SECURE_AUTH_KEY',   '>LqwDFn+grkj)<LfF|`*@oQ@8Gy)jN.c-uwi%}1RMIj]1Ox=9#,;jMr#k?ZfSE:#' );
define( 'LOGGED_IN_KEY',     'Pa.,(,E@% sRx#X@duNwB0bQu8`DUsaTw{%jty?KT 0Rlv5Mt85L~U,NTrT1DLPM' );
define( 'NONCE_KEY',         '%L67V!t}j+*WC$|~0OiS`$$H_wE%ne?T+Qq]!{.H:sc.mx<,1lyqC$3o{s.3~iZn' );
define( 'AUTH_SALT',         'kL-A}5r;1zY7i*X>tcmW/~_ONKa~0y,$Y8]E}jY,rU VrK`p#xIT_%zh/cfQxx?K' );
define( 'SECURE_AUTH_SALT',  'c6%V6Lj*~IP7g81)9[J^flA!NF`F(I[yyZlov!|h{_~O|h?dZN3Mn!rl%-o=?&..' );
define( 'LOGGED_IN_SALT',    '6%PCnRNOarK&;I*ug;92hR%%18)R_:+R7wMm`!:{}H7#a6vt:Uz^`7u+x3|vc{{l' );
define( 'NONCE_SALT',        '(;Sh6l(B);Cp,Y^Cg10c4oqMb993}v*kZmjk hk9/!q@! +ro,qf1fVmy)6e7h6Y' );
define( 'WP_CACHE_KEY_SALT', 'z7SACq-A%UAH/0GTS-(:]ruE~(VbT%^C|b6.{-Y@UvSnZlj#,e*}i8eMhJY$b2+4' );


/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';


/* Add any custom values between this line and the "stop editing" line. */

// Enable WordPress REST API
define( 'REST_REQUEST', true );

// Enable debugging for development
if ( ! defined( 'WP_DEBUG' ) ) {
	define( 'WP_DEBUG', true );
}
define( 'WP_DEBUG_LOG', true );
define( 'WP_DEBUG_DISPLAY', false );
@ini_set( 'display_errors', 0 );

// Enable GraphQL Debug
define( 'GRAPHQL_DEBUG', true );

// CORS configuration for development
define( 'WP_CORS_ENABLED', true );

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */

define( 'WP_ENVIRONMENT_TYPE', 'local' );
/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
