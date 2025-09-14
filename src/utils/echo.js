import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const token = localStorage.getItem('access_token');

const echo = new Echo({
  broadcaster: 'pusher',
  key: import.meta.env.VITE_PUSHER_APP_KEY,
  cluster: 'mt1',
  wsHost: import.meta.env.VITE_WEBSOCKET_HOST,
  wsPort: import.meta.env.VITE_WEBSOCKET_PORT,
  wssPort: import.meta.env.VITE_WEBSOCKET_PORT,
  forceTLS: import.meta.env.VITE_WEBSOCKET_SCHEME === 'https',
  disableStats: true,
  enabledTransports: ['ws', 'wss'],
  encrypted: import.meta.env.VITE_WEBSOCKET_SCHEME === 'https',

  // 🔒 Dynamic auth endpoint
  authEndpoint: import.meta.env.VITE_AUTH_ENDPOINT,

  // 🔐 Auth header with Bearer token
  auth: {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  },
});

export default echo;



// root@vultr:/var/www/workable-api/bipani_latest# cat .env
// APP_NAME=Bipani
// APP_ENV=local
// APP_KEY=base64:xvwfTJBn+hf=
// APP_DEBUG=true
// APP_URL=https://www.bipani.com

// LOG_CHANNEL=stack
// LOG_DEPRECATIONS_CHANNEL=null
// LOG_LEVEL=debug

// DB_CONNECTION=mysql
// DB_HOST=127.0.0.1
// DB_PORT=3306
// DB_DATABASE=bipani
// DB_USERNAME=admin
// DB_PASSWORD=pass

// BROADCAST_DRIVER=pusher
// CACHE_DRIVER=file
// FILESYSTEM_DISK=public
// QUEUE_CONNECTION=sync
// SESSION_DRIVER=file
// SESSION_LIFETIME=120

// MEMCACHED_HOST=127.0.0.1

// REDIS_HOST=127.0.0.1
// REDIS_PASSWORD=null
// REDIS_PORT=6379

// MAIL_MAILER=smtp
// MAIL_HOST=smtp.gmail.com
// MAIL_PORT=587
// MAIL_USERNAME=
// MAIL_PASSWORD=
// MAIL_ENCRYPTION=tls
// MAIL_FROM_ADDRESS=
// MAIL_FROM_NAME="${APP_NAME}"

// AWS_ACCESS_KEY_ID=
// AWS_SECRET_ACCESS_KEY=
// AWS_DEFAULT_REGION=us-east-1
// AWS_BUCKET=
// AWS_USE_PATH_STYLE_ENDPOINT=false

// PUSHER_APP_ID=bipani-app
// PUSHER_APP_KEY=local
// PUSHER_APP_SECRET=local-secret
// PUSHER_HOST=127.0.0.1
// PUSHER_PORT=6001
// PUSHER_SCHEME=https
// PUSHER_APP_CLUSTER=mt1
// WEBSOCKETS_ENABLED_STATISTICS=false

// LARAVEL_WEBSOCKETS_SSL_LOCAL_CERT=/etc/letsencrypt/live/bipani.com/fullchain.pem
// LARAVEL_WEBSOCKETS_SSL_LOCAL_PK=/etc/letsencrypt/live/bipani.com/privkey.pem
// LARAVEL_WEBSOCKETS_SSL_PASSPHRASE=null

// VITE_APP_NAME="${APP_NAME}"
// VITE_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
// VITE_PUSHER_HOST="${PUSHER_HOST}"
// VITE_PUSHER_PORT="${PUSHER_PORT}"
// VITE_PUSHER_SCHEME="${PUSHER_SCHEME}"
// VITE_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"

// JWT_SECRET=Voae0olPgkjZPDWau1LJP9wi0xRKX946JBjrQ4Rih69Dtrrrz3GDYwhSUgsWQigFUsye